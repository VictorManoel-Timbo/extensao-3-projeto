import { useState } from "react"
import ChatInput from "./components/chatInput/chatInput"

type Message = {
  id: number
  text: string
  imageUrl: string | null
}

function App() {
  const [messages, setMessages] = useState<Message[]>([])

  const handleReceiveData = (text: string, imageFile: File | null) => {
    const newImageUrl = imageFile ? URL.createObjectURL(imageFile) : null

    const newMessage: Message = {
      id: Date.now(),
      text: text,
      imageUrl: newImageUrl
    }

    setMessages((prevMessages) => [...prevMessages, newMessage])
  }

  return (
    <main className="flex flex-col items-center justify-center gap-8 bg-[#F2F9FF] w-full h-screen">

      <section className="flex-1 w-full h-full overflow-y-auto flex flex-col gap-4 custom-scrollbar px-[20vw]">
        {messages.length === 0 ? (
          <div className="flex flex-col gap-4 h-full items-center justify-center">
            <div className="rounded-full overflow-hidden w-fit h-fit">
              <img src="logo.svg" alt="logo" className="w-60 h-60" />
            </div>
            <p className="text-black font-sansita font-bold text-4xl">Inteligência que nutre</p>
          </div>

        ) : (
          messages.map((msg) => (
            <div key={msg.id} className="flex flex-col items-end gap-2 max-w-[80%] self-end">
              {msg.imageUrl && (
                <div className="bg-foodguard-500 p-4 w-fit h-fit rounded-2xl rounded-se shadow">
                  <img
                    src={msg.imageUrl}
                    alt="Anexo enviado"
                    className="w-20 h-20 object-cover rounded-xl border border-foodguard-300"
                  />
                </div>
              )}
              {msg.text && (
                <div className="bg-foodguard-500 p-4 rounded-2xl rounded-se shadow">
                  <p className="text-black whitespace-pre-wrap">{msg.text}</p>
                </div>

              )}
            </div>
          ))
        )}
      </section>

      <section className="w-full bg-foodguard-500 border-t border-[#a8a8a8] py-6 px-[20vw] transition-all duration-300">
        <ChatInput onSubmit={handleReceiveData} />
      </section>
    </main>
  )
}

export default App
