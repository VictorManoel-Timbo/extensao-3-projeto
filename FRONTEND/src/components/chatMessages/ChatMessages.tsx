import { useEffect, useRef } from "react";

export type Message = {
    id: string;
    role: "user" | "assistant";
    text: string;
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
                            <div className="max-w-[85%] rounded-2xl rounded-ss border border-zinc-400 bg-white px-6 py-5 text-black shadow shadow-black/15">
                                {m.text.split("\n\n").map((p, i) => (
                                    <p key={`${m.id}-${i}`} className={i > 0 ? "mt-4" : ""}>{p}</p>
                                ))}
                            </div>
                        )}
                    </div>
                );
            })}
            <div ref={endRef} />
        </div>
    );
};

export default ChatMessages;
