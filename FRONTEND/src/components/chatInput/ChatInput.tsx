import { FiSend, FiX } from 'react-icons/fi'
import { useRef, useState } from "react";
import { LuScanBarcode } from 'react-icons/lu'

type ChatInputProps = {
  onSend: (text: string, image?: File) => void;
  disabled?: boolean;
};

const ChatInput = ({ onSend, disabled }: ChatInputProps) => {
  const [value, setValue] = useState("");
  const [image, setImage] = useState<File | null>();
  const fileRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)

  const handleSubmit = () => {
    if (disabled || (!value.trim() && !image)) return;

    onSend(value, image || undefined);
    setValue('');
    removeImage();

    if (textareaRef.current) {
      textareaRef.current.value = '';
      textareaRef.current.style.height = 'auto';
    }
  };

  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setValue(e.target.value);
    const textarea = e.target;
    textarea.style.height = 'auto';
    textarea.style.height = `${textarea.scrollHeight}px`;
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      setPreviewUrl(URL.createObjectURL(file));// Cria uma URL temporária para o preview
    }
  }

  const removeImage = () => {
    setImage(null);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }
    if (fileRef.current) fileRef.current.value = '';
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter') {
      if (e.shiftKey) {
        return;
      } else {
        e.preventDefault();
        handleSubmit();
      }
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col w-full bg-white border border-zinc-500 rounded-3xl transition-all duration-200">

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
          ref={fileRef}
          onChange={handleImageChange}
          className="hidden"
        />

        <div
          onClick={() => fileRef.current?.click()}
          className="flex items-center justify-center bg-transparent p-2 cursor-pointer rounded-full transition-all"
        >
          <LuScanBarcode className="text-2xl text-black" />
        </div>

        <textarea
          ref={textareaRef}
          value={value}
          onChange={handleInput}
          onKeyDown={handleKeyDown}
          disabled={disabled}
          rows={1}
          className="resize-none w-full max-h-[120px] outline-none py-2.5 bg-transparent text-black overflow-y-auto leading-tight custom-scrollbar placeholder-slate-800/60 placeholder-opacity-80 disabled:bg-transparent"
          placeholder="O que vamos comer hoje?"
        />

        <button
          type="submit"
          disabled={disabled}
          aria-label="Enviar"
          className="flex items-center justify-center rounded-full p-2 bg-foodguard-500/20 disabled:opacity-50">
          <FiSend className="text-2xl text-foodguard-500" />
        </button>
      </div>
    </form>
  );
};

export default ChatInput;
