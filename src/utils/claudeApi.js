// ─── API HELPERS ──────────────────────────────────────────────────────────────

export async function callClaude({ system, user, tools }) {
  const body = {
    model: "claude-sonnet-4-20250514",
    max_tokens: 4000,
    system,
    messages: [{ role: "user", content: user }],
  };
  if (tools && tools.length) body.tools = tools;

  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error?.message || `API error ${res.status}`);
  }
  return res.json();
}

export function extractText(data) {
  if (!data || !data.content) return "";
  return data.content
    .filter(b => b.type === "text")
    .map(b => b.text)
    .join("\n")
    .trim();
}

export function countSearches(data) {
  if (!data || !data.content) return 0;
  return data.content.filter(b => b.type === "tool_use").length;
}

export function parseJSON(raw) {
  // Strip markdown fences
  const text = raw
    .replace(/^```(?:json)?\s*/im, "")
    .replace(/\s*```\s*$/im, "")
    .trim();

  const start = text.indexOf("{");
  if (start === -1) throw new Error("No JSON object found in response");

  // Walk to find matching closing brace
  let depth = 0;
  let end = -1;
  let inString = false;
  let escape = false;

  for (let i = start; i < text.length; i++) {
    const ch = text[i];
    if (escape) { escape = false; continue; }
    if (ch === "\\") { escape = true; continue; }
    if (ch === '"') { inString = !inString; continue; }
    if (inString) continue;
    if (ch === "{") depth++;
    else if (ch === "}") {
      depth--;
      if (depth === 0) { end = i; break; }
    }
  }

  const jsonStr = end !== -1 ? text.slice(start, end + 1) : text.slice(start);

  try {
    return JSON.parse(jsonStr);
  } catch {
    // Try fixing trailing commas
    const fixed = jsonStr.replace(/,(\s*[}\]])/g, "$1");
    try {
      return JSON.parse(fixed);
    } catch (e2) {
      throw new Error(`${e2.message} (attempted repair failed)`);
    }
  }
}
