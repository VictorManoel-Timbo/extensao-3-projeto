import { useRef, useState } from 'react'
import { LuScanBarcode } from 'react-icons/lu'
import { FiSend, FiX } from 'react-icons/fi'
import { AiOutlineLoading3Quarters } from 'react-icons/ai'

interface ChatInputProps {
  onSubmit: (text: string, image: File | null) => void
}

export default function ChatInput({ onSubmit }: ChatInputProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [text, setText] = useState('')
  const [image, setImage] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value)
    const textarea = e.target
    textarea.style.height = 'auto'
    textarea.style.height = `${textarea.scrollHeight}px`
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setImage(file)
      setPreviewUrl(URL.createObjectURL(file)) // Cria uma URL temporária para o preview
    }
  }

  const removeImage = () => {
    setImage(null)
    setPreviewUrl(null)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const handleSubmit = () => {
    if (isLoading || (!text.trim() && !image)) return

    setIsLoading(true)
    onSubmit(text, image)
    setText('')
    removeImage()

    if (textareaRef.current) {
      textareaRef.current.value = ''
      textareaRef.current.style.height = 'auto'
    }

    setTimeout(() => {
      setIsLoading(false)
    }, 3000)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter') {
      if (e.shiftKey) {
        return
      } else {
        e.preventDefault()
        handleSubmit()
      }
    }
  }

  return (
    <div className={
      `flex flex-col w-full bg-white border border-[#a8a8a8] rounded-3xl shadow-sm shadow-black/15 transition-all duration-200 ${isLoading ? 'opacity-70 pointer-events-none' : ''}`
    }
    >

      {previewUrl && (
        <div className="relative p-3 pb-0">
          <div className="relative inline-block">
            <img src={previewUrl} alt="Preview" className="h-20 w-20 object-cover rounded-xl border border-foodguard-300" />
            <button
              onClick={removeImage}
              className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-1 shadow-md hover:bg-red-600"
            >
              <FiX className="text-xs" />
            </button>
          </div>
        </div>
      )}

      <div className="flex flex-row items-end gap-2 w-full min-h-11 py-1 px-1">

        <input
          type="file"
          accept="image/*"
          capture="environment"
          ref={fileInputRef}
          onChange={handleImageChange}
          className="hidden"
        />

        <div
          onClick={() => fileInputRef.current?.click()}
          className="flex items-center justify-center bg-transparent p-2 cursor-pointer hover:bg-foodguard-100 rounded-full transition-colors"
        >
          <LuScanBarcode className="text-2xl text-black" />
        </div>

        <textarea
          ref={textareaRef}
          value={text}
          onChange={handleInput}
          onKeyDown={handleKeyDown}
          disabled={isLoading}
          rows={1}
          className="resize-none w-full max-h-[120px] outline-none py-2.5 bg-transparent text-black overflow-y-auto leading-tight custom-scrollbar placeholder-black placeholder-opacity-80 disabled:bg-transparent"
          placeholder="O que vamos comer hoje?"
        />

        <div
          onClick={handleSubmit}
          className={
            `flex items-center justify-center rounded-full p-2 bg-purple-700  border border-[#a8a8a8] ${!text.trim() || isLoading ? 'cursor-default' : 'cursor-pointer'}`
          }
        >
          {isLoading ? (
            <AiOutlineLoading3Quarters className="text-xl text-white animate-spin" />
          ) : (
            <FiSend className="text-xl text-white" />
          )}
        </div>

      </div>
    </div>
  )
}