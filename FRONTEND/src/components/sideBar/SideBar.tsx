import { Menu, SquarePen, MoreVertical } from "lucide-react";
import { cn } from "@/lib/utils";

export type Conversation = { id: string; title: string };

type SidebarProps = {
    open: boolean;
    onToggle: () => void;
    onNewChat: () => void;
    conversations: Conversation[];
    activeId: string | null;
    onSelect: (id: string) => void;
};

const Sidebar = ({
    open,
    onToggle,
    onNewChat,
    conversations,
    activeId,
    onSelect,
}: SidebarProps) => {
    return (
        <aside
            className={cn(
                "flex flex-col border border-zinc-500 bg-white p-4 shadow-sm shadow-black/15 transition-all duration-300",
                open ? "w-52 rounded-xl" : "w-16 items-center rounded-lg"
            )}
        >
            <button
                onClick={onToggle}
                aria-label={open ? "Fechar menu" : "Abrir menu"}
                className="flex h-10 w-10 items-center justify-center rounded-lg text-black hover:bg-slate-100"
            >
                <Menu className="h-6 w-6" strokeWidth={2.5} />
            </button>

            <button
                onClick={onNewChat}
                className={cn(
                    "mt-4 flex items-center rounded-lg text-black hover:bg-slate-100",
                    open ? "w-full gap-3 px-2 py-2" : "h-10 w-10 justify-center"
                )}
                aria-label="Nova conversa"
            >
                <SquarePen className="h-6 w-6 shrink-0" strokeWidth={2.2} />
                {open && <span className="text-base font-medium">Nova conversa</span>}
            </button>

            {open && (
                <div className="mt-6 flex-1 overflow-y-auto">
                    <h2 className="mb-3 px-2 text-xl font-bold text-black">
                        Conversas
                    </h2>
                    <ul className="space-y-1">
                        {conversations.map((c) => {
                            const active = c.id === activeId;
                            return (
                                <li key={c.id}>
                                    <button
                                        onClick={() => onSelect(c.id)}
                                        className={cn(
                                            "group flex w-full items-center justify-between rounded-lg px-3 py-2 text-left font-semibold transition-colors",
                                            active
                                                ? "bg-foodguard-500 text-white"
                                                : "text-black hover:bg-slate-100"
                                        )}
                                    >
                                        <span className="truncate">{c.title}</span>
                                        <MoreVertical
                                            className={cn(
                                                "h-4 w-4 shrink-0 opacity-0 transition-opacity group-hover:opacity-100",
                                                active && "opacity-100"
                                            )}
                                        />
                                    </button>
                                </li>
                            );
                        })}
                    </ul>
                </div>
            )}
        </aside>
    );
};

export default Sidebar;
