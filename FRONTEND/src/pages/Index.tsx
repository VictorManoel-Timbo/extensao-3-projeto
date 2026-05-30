import { useState } from "react";
import NavBar from "@/components/navbar/Navbar";
import Sidebar from "@/components/sideBar/SideBar";
import ChatInput from "@/components/chatInput/ChatInput";
import ChatMessages from "@/components/chatMessages/ChatMessages";
import EmptyChat from "@/components/emptyChat/EmptyChat";
import { useChat } from "@/hooks/use-chat";

const Index = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const {
    chats,
    activeId,
    messages,
    loading,
    error,
    isChatPending,
    handleNewChat,
    handleSelect,
    handleDelete,
    handleSend,
  } = useChat();

  const conversations = chats.map((c) => ({
    id: c.id,
    title: c.title ?? "Nova conversa",
  }));

  return (
    <div className="flex px-[20vw] h-screen flex-col bg-slate-100 overflow-hidden">
      <NavBar variant="app" />

      <main className="mx-auto flex w-full max-w-6xl flex-1 gap-8 px-6 py-8 overflow-hidden">
        <Sidebar
          open={sidebarOpen}
          onToggle={() => setSidebarOpen((v) => !v)}
          onNewChat={handleNewChat}
          conversations={conversations}
          activeId={activeId}
          onSelect={handleSelect}
          onDelete={handleDelete}
        />

        <section className="flex flex-1 flex-col overflow-hidden">
          {error && (
            <div className="mb-2 rounded-lg bg-red-100 px-4 py-2 text-sm text-red-700">
              {error}
            </div>
          )}

          <div className="flex flex-1 flex-col overflow-y-auto">
            {loading && messages.length === 0 ? (
              <div className="flex flex-1 items-center justify-center">
                <span className="text-slate-500 animate-pulse">
                  Carregando...
                </span>
              </div>
            ) : messages.length === 0 ? (
              <EmptyChat />
            ) : (
              <ChatMessages messages={messages} />
            )}
          </div>

          <div className="pt-4 shrink-0">
            <ChatInput onSend={handleSend} disabled={isChatPending} />
          </div>
        </section>
      </main>
    </div>
  );
};

export default Index;
