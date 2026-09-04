// Newsletter/article bodies are stored as JSON blocks: [{type,text}, ...].
// Writing raw JSON in an admin form is unpleasant, so the admin textarea
// uses a tiny markdown-lite syntax instead, converted both ways:
//
//   A plain line (or several) is a paragraph.
//   "## Heading text"   -> {type:"h2", text:"Heading text"}
//   "> Quoted text"      -> {type:"quote", text:"Quoted text"}
//   Blank lines separate blocks.

export function textToBlocks(text) {
  if (!text) return [];
  const lines = text.replace(/\r\n/g, "\n").split("\n");
  const blocks = [];
  let buffer = [];

  function flush() {
    const joined = buffer.join(" ").trim();
    if (joined) blocks.push({ type: "p", text: joined });
    buffer = [];
  }

  for (const rawLine of lines) {
    const line = rawLine.trim();
    if (line === "") {
      flush();
      continue;
    }
    if (line.startsWith("## ")) {
      flush();
      blocks.push({ type: "h2", text: line.slice(3).trim() });
      continue;
    }
    if (line.startsWith("> ")) {
      flush();
      blocks.push({ type: "quote", text: line.slice(2).trim() });
      continue;
    }
    buffer.push(line);
  }
  flush();
  return blocks;
}

export function blocksToText(blocks) {
  if (!Array.isArray(blocks)) return "";
  return blocks
    .map((b) => {
      if (b.type === "h2") return `## ${b.text}`;
      if (b.type === "quote") return `> ${b.text}`;
      return b.text;
    })
    .join("\n\n");
}

export function slugify(input) {
  const base = (input || "")
    .toLowerCase()
    .trim()
    // Kannada/other non-Latin scripts don't romanize automatically —
    // strip anything that isn't a-z/0-9 and collapse whitespace/dashes.
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");

  if (base) return base;

  // Kannada (or any non-Latin) title -> nothing survives the strip above.
  // Fall back to a short, unique, editable slug instead of an empty string.
  const suffix = Math.random().toString(36).slice(2, 8);
  return `article-${suffix}`;
}

export function excerptFrom(body, maxLen = 155) {
  const text = (Array.isArray(body) ? body : [])
    .filter((b) => b.type === "p")
    .map((b) => b.text)
    .join(" ");
  if (text.length <= maxLen) return text;
  return text.slice(0, maxLen - 1).trim() + "…";
}
