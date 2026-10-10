import { useEffect, useRef, useState } from "react";
import { Brain, Send, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { TexMindMark } from "@/components/brand/logo";

type Msg = { id: number; role: "user" | "ai"; text: string };

const SUGGESTIONS = [
  "Which orders are delayed?",
  "Which stage is the bottleneck?",
  "What should I prioritize today?",
  "How many garments are currently in sewing?",
  "Why is Order ORD-2026-001 delayed?",
];

function mockAnswer(q: string) {
  const t = q.toLowerCase();
  if (t.includes("delay"))
    return "2 orders are currently delayed: ORD-2026-011 (Dyeing, 24%) and ORD-2026-015 (Sewing, 61%). ORD-2026-015 is running 22% below the planned rate — adding one sewing line recovers about 4 days.";
  if (t.includes("bottleneck") || t.includes("load"))
    return "Sewing is your bottleneck: 18,450 pcs pending against 2,800 pcs/day capacity while 3,600 pcs/day is required. Cutting is a secondary constraint at medium risk.";
  if (t.includes("priorit"))
    return "Today's priorities: 1) Recover ORD-2026-015 in sewing, 2) Raise a PO for 3,200 kg cotton yarn before stock falls under minimum, 3) Close packing on ORD-2026-012 (96%) for an early shipment.";
  if (t.includes("sewing"))
    return "Sewing currently holds 3 active orders with 32,450 pcs completed and 18,450 pcs pending, averaging 74% progress across lines. Line 3 is the weakest at 76% efficiency.";
  if (t.includes("ord-2026-001"))
    return "ORD-2026-001 is on track at 78%, not delayed. Sewing has completed 7,800 of 10,000 pcs at 2,800 pcs/day, with expected completion on 18 Sep — two days ahead of the 20 Sep delivery.";
  if (t.includes("inventory") || t.includes("yarn"))
    return "Cotton yarn is at 4,500 kg with 1,800 kg reserved, giving roughly 7 days of cover. Polyester yarn 150D and export cartons are already below minimum levels.";
  return "Across 15 orders, factory health is 87/100 with an 86% on-time rate. 11 orders are in production, 3 completed and 2 delayed. Sewing is the highest-load stage — ask me about any stage, order or buyer.";
}

export function AiAssistant({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
}) {
  const [messages, setMessages] = useState<Msg[]>([
    {
      id: 0,
      role: "ai",
      text: "Good morning. I've reviewed today's production data — factory health is 87/100 and sewing needs attention. What would you like to know?",
    },
  ]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, typing]);

  function send(text: string) {
    const q = text.trim();
    if (!q) return;
    setMessages((m) => [...m, { id: Date.now(), role: "user", text: q }]);
    setInput("");
    setTyping(true);
    setTimeout(() => {
      setTyping(false);
      setMessages((m) => [...m, { id: Date.now() + 1, role: "ai", text: mockAnswer(q) }]);
    }, 900);
  }

  return (
    <>
      {!open && (
        <button
          onClick={() => onOpenChange(true)}
          className="fixed bottom-5 right-5 z-50 flex size-13 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg transition-transform hover:scale-105"
          style={{ width: 52, height: 52 }}
          aria-label="Open TexMind AI assistant"
        >
          <Brain className="size-5.5" />
        </button>
      )}

      <div
        className={cn(
          "surface fixed bottom-4 right-4 z-50 flex w-[min(400px,calc(100vw-2rem))] flex-col overflow-hidden transition-all duration-300",
          open ? "pointer-events-auto translate-y-0 opacity-100" : "pointer-events-none translate-y-4 opacity-0",
        )}
        style={{ height: "min(600px, calc(100vh - 2rem))" }}
      >
        <div className="flex items-center gap-2.5 border-b border-border px-4 py-3">
          <TexMindMark className="size-8" />
          <div className="leading-tight">
            <div className="text-[13.5px] font-semibold">TexMind AI</div>
            <div className="text-[11px] text-muted-foreground">Factory Intelligence Assistant</div>
          </div>
          <button
            onClick={() => onOpenChange(false)}
            className="ml-auto text-muted-foreground hover:text-foreground"
            aria-label="Close assistant"
          >
            <X className="size-4" />
          </button>
        </div>

        <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto px-4 py-4">
          {messages.map((m) => (
            <div key={m.id} className={cn("flex", m.role === "user" ? "justify-end" : "justify-start")}>
              {m.role === "ai" ? (
                <div className="max-w-[92%]">
                  <div className="mb-1 text-[10.5px] font-semibold uppercase tracking-wider text-primary">
                    TexMind
                  </div>
                  <p className="text-[13px] leading-relaxed text-foreground">{m.text}</p>
                </div>
              ) : (
                <p className="max-w-[85%] rounded-2xl rounded-br-sm bg-primary px-3.5 py-2 text-[13px] text-primary-foreground">
                  {m.text}
                </p>
              )}
            </div>
          ))}
          {typing && (
            <div className="flex items-center gap-1.5 text-[12px] text-muted-foreground">
              <span className="size-1.5 animate-bounce rounded-full bg-primary [animation-delay:0ms]" />
              <span className="size-1.5 animate-bounce rounded-full bg-primary [animation-delay:120ms]" />
              <span className="size-1.5 animate-bounce rounded-full bg-primary [animation-delay:240ms]" />
              <span className="ml-1">TexMind is thinking…</span>
            </div>
          )}
        </div>

        <div className="border-t border-border px-3 py-2.5">
          <div className="mb-2 flex gap-1.5 overflow-x-auto pb-1">
            {SUGGESTIONS.map((s) => (
              <button
                key={s}
                onClick={() => send(s)}
                className="shrink-0 rounded-full border border-border px-2.5 py-1 text-[11.5px] text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground"
              >
                {s}
              </button>
            ))}
          </div>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              send(input);
            }}
            className="flex items-center gap-2"
          >
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about orders, stages or risks…"
              className="h-9 text-[13px]"
            />
            <Button type="submit" size="icon" className="size-9 shrink-0" aria-label="Send">
              <Send className="size-4" />
            </Button>
          </form>
        </div>
      </div>
    </>
  );
}
