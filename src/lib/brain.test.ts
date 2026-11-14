import { describe, expect, it } from "vitest";
import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { parseBrain, parseBrainFile, parseFaq, selectBrainFiles } from "./brain";
import { HANDOFF_TOKEN, buildChatSystemPrompt } from "./chat-knowledge";

const dir = join(__dirname, "../brain");
const brain = parseBrain(
  Object.fromEntries(readdirSync(dir).map((f) => [`../brain/${f}`, readFileSync(join(dir, f), "utf8")])),
);

describe("brand brain", () => {
  it("has exactly one always-on chatbot file, and it carries the handoff marker", () => {
    const always = brain.filter((f) => f.always && f.use.includes("chatbot"));
    expect(always.map((f) => f.name)).toEqual(["core"]);
    expect(always[0].body).toContain(HANDOFF_TOKEN);
  });

  it("gives every chatbot topic file keywords", () => {
    for (const f of brain.filter((f) => f.use.includes("chatbot") && !f.always)) {
      expect(f.keywords.length, f.name).toBeGreaterThan(0);
    }
  });

  it("parses front matter and strips editor comments", () => {
    const f = parseBrainFile("x", "---\ntitle: X\nuse: [chatbot]\nkeywords: [Nut, pay]\n---\n<!-- note -->\nBody");
    expect(f).toMatchObject({ title: "X", use: ["chatbot"], keywords: ["nut", "pay"], body: "Body" });
  });

  it("loads only the topics a question needs, with the FAQ as a fallback", () => {
    const names = (q: string) => selectBrainFiles(brain, q).map((f) => f.name);
    expect(names("I'm allergic to peanuts")).toEqual(["core", "policies"]);
    expect(names("hello")).toEqual(["core", "faq"]);
  });

  it("keeps the FAQ page questions", () => {
    const faq = parseFaq(brain.find((f) => f.name === "faq")!);
    expect(faq.length).toBeGreaterThan(10);
    expect(faq.every((f) => f.q.endsWith("?") && f.a.length > 0)).toBe(true);
  });

  it("puts live prices and this week's meals in the prompt", () => {
    const prompt = buildChatSystemPrompt(brain, "what's on this week", new Date("2026-11-14T09:00:00Z"));
    expect(prompt).toContain("$45 TTD");
    expect(prompt).toContain("Menu A");
  });
});
