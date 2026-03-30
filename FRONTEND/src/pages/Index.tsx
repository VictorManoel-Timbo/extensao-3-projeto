import { useState } from "react";
import NavBar from "@/components/navbar/Navbar";
import Sidebar, { type Conversation } from "@/components/sideBar/SideBar";
import ChatInput from "@/components/chatInput/ChatInput";
import ChatMessages, { type Message } from "@/components/chatMessages/ChatMessages";
import EmptyChat from "@/components/emptyChat/EmptyChat";

const SAMPLE_RESPONSE =
    "Vestibulum magna nisi, ornare non ligula sed, tincidunt ornare lorem. Nullam efficitur augue mauris, id eleifend augue tincidunt nec. Vivamus dignissim semper consectetur.\n\nPraesent erat risus, interdum sit amet auctor eget, ornare eleifend neque. Nulla nisl lacus, consequat rhoncus laoreet non, mollis a justo. Nunc lacinia malesuada mollis. Morbi elementum velit nec felis malesuada fermentum. Nunc porta neque ex, quis fermentum libero ornare nec. Integer varius facilisis eros, a facilisis urna. Nam eget semper elit. Vivamus accumsan leo a ornare ultricies. Donec venenatis, elit vel varius fringilla, felis ex rutrum libero, rhoncus laoreet nunc elit at est. Integer aliquam egestas condimentum. Praesent consequat tincidunt nibh, nec porta arcu volutpat at.";

const Index = () => {
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [conversations, setConversations] = useState<Conversation[]>([]);
    const [activeId, setActiveId] = useState<string | null>(null);
    const [messagesByChat, setMessagesByChat] = useState<Record<string, Message[]>>({});

    const messages = activeId ? messagesByChat[activeId] ?? [] : [];
    const isChatPending = messages.some((m) => m.pending);

    const handleNewChat = () => setActiveId(null);

    const handleSelect = (id: string) => setActiveId(id);

    const handleSend = (text: string, image?: File) => {
        let chatId = activeId;
        if (!chatId) {
            chatId = `c${Date.now()}`;
            const title = (text || image?.name || "Nova conversa").slice(0, 28);
            setConversations((prev) => [{ id: chatId!, title }, ...prev]);
            setActiveId(chatId);
        }

        const userMsg: Message = {
            id: `u${Date.now()}`,
            role: "user",
            text,
            image,
            imageUrl: image ? URL.createObjectURL(image) : undefined,
        };
        const pendingMsg: Message = {
            id: `p${Date.now()}`,
            role: "assistant",
            text: "",
            pending: true,
        };

        setMessagesByChat((prev) => ({
            ...prev,
            [chatId!]: [...(prev[chatId!] ?? []), userMsg, pendingMsg],
        }));

        setTimeout(() => {
            setMessagesByChat((prev) => ({
                ...prev,
                [chatId!]: (prev[chatId!] ?? []).map((m) =>
                    m.id === pendingMsg.id ? { ...m, text: SAMPLE_RESPONSE, pending: false } : m
                ),
            }));
        }, 1800);
    };

    return (
        <div className="flex px-[20vw] h-screen flex-col bg-slate-100 overflow-hidden">
            <NavBar />

            <main className="mx-auto flex w-full max-w-6xl flex-1 gap-8 px-6 py-8 overflow-hidden">
                <Sidebar
                    open={sidebarOpen}
                    onToggle={() => setSidebarOpen((v) => !v)}
                    onNewChat={handleNewChat}
                    conversations={conversations}
                    activeId={activeId}
                    onSelect={handleSelect}
                />

                <section className="flex flex-1 flex-col overflow-hidden">
                    <div className="flex flex-1 flex-col overflow-y-auto">
                        {messages.length === 0 ? (
                            <EmptyChat />
                        ) : (
                            <ChatMessages messages={messages} />
                        )}
                    </div>

                    <div className="pt-4 shrink-0" >
                        <ChatInput onSend={handleSend} disabled={isChatPending} />
                    </div>
                </section>
            </main>
        </div>
    );
};

export default Index;
