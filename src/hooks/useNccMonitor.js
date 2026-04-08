import { useState, useCallback } from "react";
import { TODAY, RESEARCH_SYSTEM, RESEARCH_USER, STRUCTURE_SYSTEM } from "../constants/nccMedia";
import { callClaude, extractText, countSearches, parseJSON } from "../utils/claudeApi";

const fmt = (d) => d.toLocaleTimeString("en-NZ", { hour: "2-digit", minute: "2-digit" });

export function useNccMonitor() {
  const [status, setStatus]           = useState("idle");
  const [runTime, setRunTime]         = useState(null);
  const [error, setError]             = useState(null);
  const [rawFindings, setRawFindings] = useState("");
  const [stories, setStories]         = useState([]);
  const [fuelStatus, setFuelStatus]   = useState(null);
  const [summary, setSummary]         = useState(null);
  const [logs, setLogs]               = useState([]);
  const [showRaw, setShowRaw]         = useState(false);

  const log = useCallback((msg, type = "info") => {
    setLogs(l => [...l, { msg, type, time: fmt(new Date()) }]);
  }, []);

  const run = useCallback(async () => {
    setStatus("running");
    setError(null);
    setLogs([]);
    setStories([]);
    setFuelStatus(null);
    setSummary(null);
    setRawFindings("");
    setShowRaw(false);
    setRunTime(fmt(new Date()));

    try {
      // ── PASS 1: Research with web search ───────────────────────
      log("Starting media scan — pass 1: web research...", "info");
      log("Searching Nelson local sources...", "search");
      log("Checking MBIE fuel stocks update...", "search");
      log("Scanning national stories for NCC relevance...", "search");

      const researchData = await callClaude({
        system: RESEARCH_SYSTEM,
        user: RESEARCH_USER,
        tools: [{ type: "web_search_20250305", name: "web_search" }],
      });

      const searchCount = countSearches(researchData);
      const findings = extractText(researchData);

      if (!findings) {
        throw new Error(
          "No findings returned. Web search may not be available — ensure this is running in a Claude.ai artifact with web search enabled."
        );
      }

      log(`${searchCount} web search${searchCount !== 1 ? "es" : ""} completed`, "search");
      log(`Research pass done — ${findings.length} chars retrieved`, "success");
      setRawFindings(findings);

      // ── PASS 2: Structure as clean JSON (no tools) ─────────────
      log("Pass 2: structuring results as JSON...", "info");

      const structureData = await callClaude({
        system: STRUCTURE_SYSTEM,
        user:
          "Convert these NCC media monitoring findings into the required JSON format. Today is " +
          TODAY +
          ".\n\n" +
          findings,
      });

      const rawJson = extractText(structureData);
      log("JSON response received (" + rawJson.length + " chars)", "info");

      let parsed;
      try {
        parsed = parseJSON(rawJson);
      } catch (parseErr) {
        log("Parse error: " + parseErr.message, "error");
        setShowRaw(true);
        throw new Error(
          "JSON parse failed after two attempts. The raw research findings are shown below — the information was retrieved successfully but could not be structured automatically. Try running again."
        );
      }

      const storyList = Array.isArray(parsed.stories) ? parsed.stories : [];
      setStories(storyList);
      setFuelStatus(parsed.fuel_status || null);
      setSummary(
        parsed.summary || {
          total_stories: storyList.length,
          high_count: storyList.filter(s => s.relevance === "HIGH").length,
          medium_count: storyList.filter(s => s.relevance === "MEDIUM").length,
          low_count: storyList.filter(s => s.relevance === "LOW").length,
          top_story: storyList[0] ? storyList[0].headline : "No stories found",
          immediate_actions_required: storyList.some(
            s => s.action === "escalate_CE" || s.action === "escalate_ELT" || s.action === "prepare_response"
          ),
        }
      );

      log("Parsed " + storyList.length + " stories successfully", "success");
      const highCount = storyList.filter(s => s.relevance === "HIGH").length;
      if (highCount > 0) log(highCount + " HIGH priority " + (highCount === 1 ? "story" : "stories") + " found", "warn");
      log("Roundup complete.", "success");
      setStatus("done");
    } catch (err) {
      log("Failed: " + err.message, "error");
      setError(err.message);
      setStatus("error");
    }
  }, [log]);

  return {
    status, runTime, error, rawFindings, stories, fuelStatus, summary,
    logs, showRaw, setShowRaw, run,
  };
}
