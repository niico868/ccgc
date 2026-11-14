/**
 * Brand brain: markdown knowledge files in src/brain. This module is pure
 * (no Vite imports) so it can be tested; brain-files.ts loads the files.
 */

export type BrainFile = {
  name: string;
  title: string;
  description: string;
  use: string[];
  always: boolean;
  keywords: string[];
  body: string;
};

function parseValue(raw: string): string | string[] | boolean {
  const v = raw.trim();
  if (v === "true") return true;
  if (v === "false") return false;
  if (v.startsWith("[") && v.endsWith("]")) {
    return v
      .slice(1, -1)
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
  }
  return v;
}

/** Parse one markdown file with a simple `key: value` front matter block. */
export function parseBrainFile(name: string, source: string): BrainFile {
  const text = source.replace(/\r\n/g, "\n");
  const meta: Record<string, string | string[] | boolean> = {};
  let body = text;
  const match = text.match(/^---\n([\s\S]*?)\n---\n?/);
  if (match) {
    for (const line of match[1].split("\n")) {
      const idx = line.indexOf(":");
      if (idx > 0) meta[line.slice(0, idx).trim()] = parseValue(line.slice(idx + 1));
    }
    body = text.slice(match[0].length);
  }
  // Editor notes in <!-- --> comments are for people, not the model.
  body = body.replace(/<!--[\s\S]*?-->/g, "").trim();
  const list = (v: unknown) => (Array.isArray(v) ? v : typeof v === "string" && v ? [v] : []);
  return {
    name,
    title: typeof meta.title === "string" ? meta.title : name,
    description: typeof meta.description === "string" ? meta.description : "",
    use: list(meta.use),
    always: meta.always === true,
    keywords: list(meta.keywords).map((k) => k.toLowerCase()),
    body,
  };
}

/** Turn an import.meta.glob result ({"../brain/core.md": "..."}) into parsed files. */
export function parseBrain(files: Record<string, string>): BrainFile[] {
  return Object.entries(files)
    .map(([path, src]) => parseBrainFile(path.split("/").pop()!.replace(/\.md$/, ""), src))
    .sort((a, b) => a.name.localeCompare(b.name));
}

/** Pick the chatbot files for a message: the always-on core plus topics whose keywords appear. */
export function selectBrainFiles(brain: BrainFile[], query: string, fallback = "faq"): BrainFile[] {
  const q = ` ${query.toLowerCase()} `;
  const chat = brain.filter((f) => f.use.includes("chatbot"));
  const always = chat.filter((f) => f.always);
  const topics = chat.filter((f) => !f.always && f.keywords.some((k) => q.includes(k)));
  if (topics.length === 0) {
    const fb = chat.find((f) => f.name === fallback);
    if (fb) topics.push(fb);
  }
  return [...always, ...topics];
}

/** FAQ entries from a file whose questions are "## " headings. */
export function parseFaq(file: BrainFile): { q: string; a: string }[] {
  return file.body
    .split(/^## /m)
    .slice(1)
    .map((block) => {
      const [first, ...rest] = block.split("\n");
      return { q: first.trim(), a: rest.join("\n").trim().replace(/\s*\n\s*/g, " ") };
    })
    .filter((f) => f.q && f.a);
}
