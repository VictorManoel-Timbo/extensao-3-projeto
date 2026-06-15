import { useEffect, useRef, useState } from "react";
import type { AssistantStatus } from "@/hooks/use-messages";

export type Message = {
    id: string;
    role: "user" | "assistant";
    text: string;
    status?: AssistantStatus;
    summary?: string;
    details?: string;
    image?: File;
    imageUrl?: string;
    pending?: boolean;
};

const TypingDots = () => (
    <div className="flex items-center gap-1.5">
        {[0, 1, 2].map((i) => (
            <span
                key={i}
                className="h-2.5 w-2.5 animate-pulse rounded-full bg-foodguard-600"
                style={{ animationDelay: `${i * 0.15}s` }}
            />
        ))}
    </div>
);

const STATUS_CONFIG: Record<AssistantStatus, { label: string; className: string }> = {
  seguro: {
    label: "SEGURO",
    className: "bg-foodguard-500 text-white",
  },
  cuidado: {
    label: "CUIDADO",
    className: "bg-amber-400 text-amber-900",
  },
};

const AssistantBubble = ({ message }: { message: Message }) => {
  const [detailsOpen, setDetailsOpen] = useState(false);
  const hasStructured = !!message.status && !!message.summary;
  if (!hasStructured) {
    return (
      <div className="max-w-[85%] rounded-2xl rounded-ss border border-zinc-400 bg-white px-6 py-5 text-black shadow shadow-black/15">
        {message.text.split("\n\n").map((p, i) => (
          <p key={i} className={i > 0 ? "mt-4" : ""}>
            {p}
          </p>
        ))}
      </div>
    );
  }

  const statusCfg = STATUS_CONFIG[message.status!];

  return (
    <div className="max-w-[85%] rounded-2xl rounded-ss border border-zinc-400 bg-white px-6 py-5 text-black shadow shadow-black/15 flex flex-col gap-3">
      <span
        className={`w-fit rounded-md px-3 py-1 text-xs font-bold tracking-widest uppercase ${statusCfg.className}`}
      >
        {statusCfg.label}
      </span>

      <p className="text-sm leading-relaxed text-black">{message.summary}</p>

      {message.details && (
        <>
          {detailsOpen && (
            <div className="border-t border-zinc-200 pt-3">
              <p className="text-sm leading-relaxed text-zinc-700">
                {message.details}
              </p>
            </div>
          )}
          <button
            onClick={() => setDetailsOpen((v) => !v)}
            className="self-end text-xs font-medium text-zinc-400 hover:text-zinc-600 transition-colors underline-offset-2 hover:underline"
          >
            {detailsOpen ? "ocultar detalhes" : "detalhes"}
          </button>
        </>
      )}
    </div>
  );
};

const ChatMessages = ({ messages }: { messages: Message[] }) => {
    const endRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        endRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    return (
        <div className="flex flex-col gap-4 px-2 py-6">
            {messages.map((m) => {
                if (m.role === "user") {
                    return (
                        <div key={m.id} className="flex flex-col items-end gap-2 animate-fade-in">
                            {m.imageUrl && (
                                <div className="flex h-fit w-fit flex-col items-center justify-center gap-1 rounded-2xl p-2 rounded-se border border-zinc-400 bg-foodguard-500 text-white shadow-sm">
                                    <img
                                        src={m.imageUrl}
                                        alt="Anexo enviado"
                                        className="w-20 h-20 object-cover rounded-xl border border-foodguard-300"
                                    />
                                </div>
                            )}
                            {m.text && (
                                <div className="max-w-[80%] rounded-2xl rounded-se border border-zinc-400 bg-foodguard-500 p-4 text-white whitespace-break-spaces shadow shadow-black/15">
                                    {m.text}
                                </div>
                            )}
                        </div>
                    );
                }

                return (
                    <div key={m.id} className="flex animate-fade-in">
                        {m.pending ? (
                            <div className="flex items-center gap-3 px-2 py-2">
                                <TypingDots />
                                <span className="text-black">Sua mensagem está sendo processada ...</span>
                            </div>
                        ) : (
                            <AssistantBubble message={m} />
                        )}
                    </div>
                );
            })}
            <div ref={endRef} />
        </div>
    );
};

export default ChatMessages;
