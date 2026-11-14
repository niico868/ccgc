import { createServerFn } from "@tanstack/react-start";
import { buildChatSystemPrompt, parseReply, sanitizeTurns, topicQuery, type ChatTurn } from "./chat-knowledge";
import { BRAIN } from "./brain-files";

/**
 * Cloudflare Workers AI model. Free daily allowance on Cloudflare, no API key:
 * the "AI" binding in wrangler.jsonc connects it.
 */
const MODEL = "@cf/meta/llama-3.3-70b-instruct-fp8-fast";

const FALLBACK =
  "Sorry, I'm having trouble answering right now. Cathy's team can help you straight away on WhatsApp.";

type AiBinding = {
  run: (
    model: string,
    input: { messages: { role: string; content: string }[]; max_tokens?: number; temperature?: number },
  ) => Promise<unknown>;
};

function replyText(result: unknown): string {
  if (!result || typeof result !== "object") return "";
  const r = result as { response?: unknown; choices?: { message?: { content?: unknown } }[] };
  if (typeof r.response === "string") return r.response;
  const choice = r.choices?.[0]?.message?.content;
  return typeof choice === "string" ? choice : "";
}

export const askAssistant = createServerFn({ method: "POST" })
  .validator((data: { messages: ChatTurn[] }) => ({ messages: sanitizeTurns(data?.messages) }))
  .handler(async ({ data }) => {
    try {
      // Built-in Cloudflare module, loaded only at runtime on Cloudflare. The specifier is
      // assembled so the build step does not try to resolve or bundle it.
      const builtin = "cloudflare:" + "workers";
      const { env } = (await import(/* @vite-ignore */ builtin)) as { env: { AI?: AiBinding } };
      if (!env.AI) throw new Error("Workers AI binding (AI) is not configured");

      const result = await env.AI.run(MODEL, {
        messages: [{ role: "system", content: buildChatSystemPrompt(BRAIN, topicQuery(data.messages)) }, ...data.messages],
        max_tokens: 350,
        temperature: 0.3,
      });
      const { text, handoff } = parseReply(replyText(result));
      if (!text) return { text: FALLBACK, handoff: true };
      return { text, handoff };
    } catch (error) {
      console.error("askAssistant failed", error);
      return { text: FALLBACK, handoff: true };
    }
  });
