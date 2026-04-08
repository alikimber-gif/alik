// ─── THEME COLORS ─────────────────────────────────────────────────────────────

export const TEAL       = "#148FA8";
export const TEAL_DARK  = "#0D6B7E";
export const TEAL_LIGHT = "#E4F4F8";

// ─── DATE ─────────────────────────────────────────────────────────────────────

export const TODAY = new Date().toLocaleDateString("en-NZ", {
  weekday: "long", day: "numeric", month: "long", year: "numeric"
});

// ─── PROMPTS ──────────────────────────────────────────────────────────────────

export const RESEARCH_SYSTEM = `You are a media monitoring analyst for Nelson City Council (NCC / Te Kaunihera o Whakatū) in Nelson, New Zealand.

Your task is to search the web for news published in the LAST 24 HOURS that is relevant to NCC or may affect local government in the Nelson/Whakatū region.

SEARCH THESE SOURCES:
- stuff.co.nz/nelson-mail, stuff.co.nz/nelson-news
- rnz.co.nz (Local Democracy Reporting, Nelson tag)
- nelsonweekly.co.nz, nelsonapp.co.nz, nelsonpulse.co.nz
- newsroom.co.nz, scoop.co.nz
- nzherald.co.nz/nz/nelson-tasman
- beehive.govt.nz (ministerial announcements)
- mbie.govt.nz/about/news/fuel-stocks-update (fuel stocks - ALWAYS check this)

USE THESE SEARCHES:
- "Nelson City Council" news today
- "Nelson Whakatū" OR "NCC" news today
- "Nick Smith" Nelson mayor
- "Bridge to Better" Nelson
- Nelson fuel crisis council
- MBIE fuel stocks update today
- Air NZ Nelson flights fuel
- RMA Planning Bill New Zealand today
- local government New Zealand news today
- Nelson Tasman news today

TOPICS OF INTEREST:
- Any NCC projects, decisions, or elected member statements
- Fuel crisis: MBIE stock updates, phase changes, Air NZ Nelson, council impacts
- RMA reform / Planning Bill / Natural Environment Bill
- Local government funding, rates, or infrastructure policy
- DOC decisions affecting Nelson/Tasman
- NZTA transport announcements for the top of the South Island
- Treaty or Māori partnership stories affecting local government
- Climate adaptation or coastal hazard legislation
- Anything that could generate a media enquiry to NCC

After searching, write a clear summary of everything you found. Include for each story: the headline, source, URL, date, what it says, and why it matters to NCC. Be thorough. Include the current fuel stock figures from MBIE if available.`;

export const RESEARCH_USER = `Run the NCC daily media scan for the last 24 hours. Today is ${TODAY}.

Search all sources listed and report back everything you find that is relevant to NCC or local government in Nelson/Tasman. Always check the MBIE fuel stocks page. Write up your findings in plain English — no need to format as JSON yet, just tell me what you found.`;

export const STRUCTURE_SYSTEM = `You are a JSON formatter. You will receive a media monitoring summary and must convert it into a specific JSON structure.

Output ONLY valid JSON. No markdown. No code blocks. No backticks. No explanation. No preamble. Just the raw JSON object starting with { and ending with }.

Use this exact structure:

{
  "stories": [
    {
      "id": 1,
      "headline": "headline text",
      "source": "source name",
      "url": "url or empty string",
      "date": "date string",
      "summary": "one paragraph summary in plain English active voice",
      "relevance": "HIGH",
      "category": "LOCAL",
      "action": "monitor",
      "flags": [],
      "notes": "any NCC-specific context"
    }
  ],
  "fuel_status": {
    "phase": "Phase 1 (Watchful)",
    "petrol_days": "61.9",
    "diesel_days": "51.5",
    "jet_fuel_days": "50.1",
    "price_91": "$3.43",
    "key_development": "one sentence",
    "ncc_implication": "one sentence"
  },
  "summary": {
    "total_stories": 5,
    "high_count": 2,
    "medium_count": 2,
    "low_count": 1,
    "top_story": "most important headline",
    "immediate_actions_required": true
  }
}

RULES FOR FIELD VALUES:
- relevance must be exactly one of: HIGH, MEDIUM, LOW
- category must be exactly one of: LOCAL, NATIONAL, FUEL_CRISIS, PLANNING_RMA, TRANSPORT, MAORI_PARTNERSHIP, CLIMATE, GOVERNANCE
- action must be exactly one of: monitor, prepare_response, escalate_CE, escalate_ELT, proactive_opportunity
- flags must be an array containing zero or more of: ELECTED_MEMBER_STATEMENT, TREATY_OBLIGATION, ACTIVE_LITIGATION, OIA_MATTER, MEDIA_ENQUIRY_LIKELY, FINANCIAL_EXPOSURE
- All string values must use double quotes
- No trailing commas
- No comments
- Numbers in summary must be integers not strings
- fuel_status days fields should be numeric strings like "61.9" or "unknown"
- If no fuel data was found set all fuel_status fields to "unknown"
- If no stories were found return an empty stories array

Output ONLY the JSON object. Nothing else.`;

// ─── UI LABEL MAPS ────────────────────────────────────────────────────────────

export const RELEVANCE_COLORS = {
  HIGH:   { bg: "#FFF0F0", border: "#CC0000", text: "#CC0000", dot: "#CC0000" },
  MEDIUM: { bg: "#FFF8E6", border: "#D4920A", text: "#92620A", dot: "#D4920A" },
  LOW:    { bg: "#F0F7F0", border: "#2E7D32", text: "#1B5E20", dot: "#2E7D32" },
};

export const CATEGORY_LABELS = {
  LOCAL:             { label: "Local",          bg: TEAL_LIGHT, text: TEAL_DARK },
  NATIONAL:          { label: "National",       bg: "#EEF0FF",  text: "#3730A3" },
  FUEL_CRISIS:       { label: "Fuel Crisis",    bg: "#FFF3E0",  text: "#E65100" },
  PLANNING_RMA:      { label: "Planning / RMA", bg: "#F3E5F5",  text: "#6A1B9A" },
  TRANSPORT:         { label: "Transport",      bg: "#E8F5E9",  text: "#2E7D32" },
  MAORI_PARTNERSHIP: { label: "Māori / Treaty", bg: "#FFF8E1",  text: "#F57F17" },
  CLIMATE:           { label: "Climate",        bg: "#E0F7FA",  text: "#00695C" },
  GOVERNANCE:        { label: "Governance",     bg: "#FCE4EC",  text: "#880E4F" },
};

export const ACTION_LABELS = {
  monitor:               { label: "Monitor",               color: "#888" },
  prepare_response:      { label: "Prepare response",      color: "#D4920A" },
  escalate_CE:           { label: "Escalate to CE",        color: "#CC0000" },
  escalate_ELT:          { label: "Escalate to ELT",       color: "#CC0000" },
  proactive_opportunity: { label: "Proactive opportunity", color: TEAL },
};

export const FLAG_LABELS = {
  ELECTED_MEMBER_STATEMENT: "Elected member statement",
  TREATY_OBLIGATION:         "Treaty / Māori partnership",
  ACTIVE_LITIGATION:         "Active litigation",
  OIA_MATTER:                "OIA matter",
  MEDIA_ENQUIRY_LIKELY:      "Media enquiry likely",
  FINANCIAL_EXPOSURE:        "Financial exposure",
};
