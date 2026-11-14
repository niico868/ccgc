import { useEffect, useRef, useState, type FormEvent, type ReactNode } from "react";
import { MessageCircle, Send, X } from "lucide-react";
import { askAssistant } from "@/lib/chat.functions";
import { CHAT_LIMITS, type ChatTurn } from "@/lib/chat-knowledge";
import { useBasket } from "@/lib/basket";
import { waLink } from "@/lib/whatsapp";
import wa from "@/assets/whatsapp.png";

type Msg = ChatTurn & { handoff?: boolean };

const STORAGE_KEY = "ccgc-chat-v1";
const GREETING: Msg = {
  role: "assistant",
  content:
    "Hi! I'm Cathy's website assistant 🥗 Ask me about this week's meals, prices, delivery or how to order.",
};
const SUGGESTIONS = [
  "What meals are on this week?",
  "Where do you deliver, and how much?",
  "How do I place an order?",
  "Are the juices diabetic-friendly?",
];

function load(): Msg[] {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    const parsed = raw ? (JSON.parse(raw) as Msg[]) : null;
    return Array.isArray(parsed) && parsed.length ? parsed : [GREETING];
  } catch {
    return [GREETING];
  }
}

function save(msgs: Msg[]) {
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(msgs.slice(-30)));
  } catch {
    /* storage unavailable: chat still works for this page view */
  }
}

/** Turn bare URLs in the assistant's reply into links; site links open in the same tab. */
function linkify(text: string): ReactNode[] {
  const parts = text.split(/(https?:\/\/[^\s)]+[^\s).,!?])/g);
  return parts.map((part, i) => {
    if (!/^https?:\/\//.test(part)) return <span key={i}>{part}</span>;
    let href = part;
    let label = part.replace(/^https?:\/\/(www\.)?/, "");
    let external = true;
    try {
      const u = new URL(part);
      if (u.hostname.endsWith("cathyscleangreenclassics.com")) {
        href = u.pathname + u.search;
        label = u.pathname === "/" ? "our homepage" : u.pathname.slice(1);
        external = false;
      }
    } catch {
      /* leave as-is */
    }
    return (
      <a
        key={i}
        href={href}
        {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
        className="font-semibold text-leaf underline underline-offset-2"
      >
        {label}
      </a>
    );
  });
}

export function ChatWidget() {
  const [mounted, setMounted] = useState(false);
  const [open, setOpen] = useState(false);
  const [msgs, setMsgs] = useState<Msg[]>([GREETING]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const listRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const { count } = useBasket();

  useEffect(() => {
    setMsgs(load());
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted) save(msgs);
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: "smooth" });
  }, [msgs, busy, mounted]);

  useEffect(() => {
    if (!open) return;
    inputRef.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  async function send(text: string) {
    const content = text.trim().slice(0, CHAT_LIMITS.maxCharsPerMessage);
    if (!content || busy) return;
    const next: Msg[] = [...msgs, { role: "user", content }];
    setMsgs(next);
    setInput("");
    setBusy(true);
    try {
      const history = next
        .filter((m, i) => !(i === 0 && m.role === "assistant"))
        .map(({ role, content: c }) => ({ role, content: c }));
      const res = await askAssistant({ data: { messages: history } });
      setMsgs((m) => [...m, { role: "assistant", content: res.text, handoff: res.handoff }]);
    } catch {
      setMsgs((m) => [
        ...m,
        {
          role: "assistant",
          content: "Sorry, I couldn't connect just now. The team can help you on WhatsApp.",
          handoff: true,
        },
      ]);
    } finally {
      setBusy(false);
    }
  }

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    void send(input);
  }

  const lastQuestion = [...msgs].reverse().find((m) => m.role === "user")?.content;
  const waHref = waLink(
    lastQuestion
      ? `Hi Cathy's team! I was chatting on the website and have a question: ${lastQuestion}`
      : "Hi Cathy's team! I have a question.",
  );
  const showSuggestions = msgs.length === 1 && !busy;

  if (!mounted) return null;

  // Lift above the mobile checkout bar when the basket has items.
  const lift = count > 0 ? "bottom-24 md:bottom-5" : "bottom-4 sm:bottom-5";

  return (
    <div className={`fixed left-4 z-40 sm:left-5 ${lift}`}>
      {open && (
        <section
          role="dialog"
          aria-label="Chat with Cathy's website assistant"
          className="mb-3 flex h-[min(560px,calc(100dvh-8rem))] w-[min(380px,calc(100vw-2rem))] flex-col overflow-hidden rounded-3xl border border-leaf-deep/15 bg-cream shadow-soft"
        >
          <header className="flex items-center justify-between gap-3 bg-leaf-deep px-5 py-4 text-cream">
            <div>
              <div className="text-display text-lg leading-tight">Ask Cathy's</div>
              <div className="text-xs text-cream/75">Usually answers in seconds</div>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close chat"
              className="grid h-9 w-9 place-items-center rounded-full transition hover:bg-cream/15"
            >
              <X className="h-5 w-5" />
            </button>
          </header>

          <div ref={listRef} className="flex-1 space-y-3 overflow-y-auto px-4 py-4" aria-live="polite">
            {msgs.map((m, i) => (
              <div key={i} className={m.role === "user" ? "flex justify-end" : "flex flex-col items-start gap-2"}>
                <div
                  className={
                    m.role === "user"
                      ? "max-w-[85%] rounded-2xl rounded-br-md bg-leaf-deep px-4 py-2.5 text-sm text-cream"
                      : "max-w-[90%] whitespace-pre-line rounded-2xl rounded-bl-md bg-white px-4 py-2.5 text-sm text-foreground shadow-card"
                  }
                >
                  {m.role === "assistant" ? linkify(m.content) : m.content}
                </div>
                {m.handoff && (
                  <a
                    href={waHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-full bg-wa px-4 py-2 text-xs font-semibold text-cream shadow-card transition hover:brightness-105"
                  >
                    <img src={wa} alt="" className="h-4 w-4" />
                    Continue on WhatsApp
                  </a>
                )}
              </div>
            ))}

            {busy && (
              <div className="flex items-center gap-1 rounded-2xl rounded-bl-md bg-white px-4 py-3 shadow-card w-fit" aria-label="Typing">
                {[0, 150, 300].map((d) => (
                  <span
                    key={d}
                    className="h-2 w-2 animate-bounce rounded-full bg-leaf-soft"
                    style={{ animationDelay: `${d}ms` }}
                  />
                ))}
              </div>
            )}

            {showSuggestions && (
              <div className="flex flex-wrap gap-2 pt-1">
                {SUGGESTIONS.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => void send(s)}
                    className="rounded-full border border-leaf-deep/20 bg-white px-3 py-1.5 text-xs font-medium text-leaf-deep transition hover:border-leaf-deep/50"
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}
          </div>

          <form onSubmit={onSubmit} className="border-t border-leaf-deep/10 bg-white px-3 pb-2 pt-3">
            <div className="flex items-center gap-2">
              <input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                maxLength={CHAT_LIMITS.maxCharsPerMessage}
                placeholder="Type your question…"
                aria-label="Your question"
                className="h-11 flex-1 rounded-full border border-border bg-cream px-4 text-sm outline-none focus:border-leaf"
              />
              <button
                type="submit"
                disabled={busy || !input.trim()}
                aria-label="Send"
                className="grid h-11 w-11 place-items-center rounded-full bg-leaf-deep text-cream transition disabled:opacity-40"
              >
                <Send className="h-4 w-4" />
              </button>
            </div>
            <div className="mt-2 flex items-center justify-between px-1 text-[11px] text-muted-foreground">
              <span>AI assistant. The team confirms every order.</span>
              <a href={waHref} target="_blank" rel="noopener noreferrer" className="font-semibold text-leaf">
                Talk to a person
              </a>
            </div>
          </form>
        </section>
      )}

      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-label={open ? "Close chat" : "Chat with us"}
        className="inline-flex h-12 items-center gap-2 rounded-full bg-leaf-deep px-5 text-sm font-semibold text-cream shadow-soft transition hover:brightness-110"
      >
        {open ? <X className="h-5 w-5" /> : <MessageCircle className="h-5 w-5" />}
        <span>{open ? "Close" : "Ask us"}</span>
      </button>
    </div>
  );
}
