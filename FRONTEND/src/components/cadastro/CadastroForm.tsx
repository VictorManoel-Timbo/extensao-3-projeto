import { useState } from "react";
import { Link } from "react-router-dom";
import { Eye, EyeOff, Mail, User } from "lucide-react";

interface Props {
    onNext: () => void;
}

const CadastroForm = ({ onNext }: Props) => {
    const [showPwd, setShowPwd] = useState(false);
    const [showPwd2, setShowPwd2] = useState(false);

    const handleSubmit = (e: React.SubmitEvent<HTMLFormElement> | React.KeyboardEvent<HTMLTextAreaElement>) => {
        e.preventDefault();
        onNext();
    };

    return (
        <>
            <h2 className="font-sansita text-3xl font-extrabold tracking-tight text-black">
                CADASTRAR
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid gap-6 sm:grid-cols-2">
                    <div className="space-y-2">
                        <label className="block text-sm font-semibold text-black">Seu usuário</label>
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Usuário"
                                className="h-12 w-full rounded-md border border-zinc-500 bg-slate-50 px-4 pr-10 placeholder:text-gray-700 focus:border-foodguard-500 focus:outline-none focus:ring-2 focus:ring-foodguard-500/30"
                            />
                            <User className="pointer-events-none absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-800" />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="block text-sm font-semibold text-black">Sua senha</label>
                        <div className="relative">
                            <input
                                type={showPwd ? "text" : "password"}
                                placeholder="Senha"
                                className="h-12 w-full rounded-md border border-zinc-500 bg-slate-50 px-4 pr-10 placeholder:text-gray-700 focus:border-foodguard-500 focus:outline-none focus:ring-2 focus:ring-foodguard-500/30"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPwd((s) => !s)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-800 hover:text-black"
                                aria-label="Mostrar senha"
                            >
                                {showPwd ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                            </button>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="block text-sm font-semibold text-black">Seu email</label>
                        <div className="relative">
                            <input
                                type="email"
                                placeholder="Email"
                                className="h-12 w-full rounded-md border border-zinc-500 bg-slate-50 px-4 pr-10 placeholder:text-gray-700 focus:border-foodguard-500 focus:outline-none focus:ring-2 focus:ring-foodguard-500/30"
                            />
                            <Mail className="pointer-events-none absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-800" />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="block text-sm font-semibold text-black">Confirmar a senha</label>
                        <div className="relative">
                            <input
                                type={showPwd2 ? "text" : "password"}
                                placeholder="Confirme a senha"
                                className="h-12 w-full rounded-md border border-zinc-500 bg-slate-50 px-4 pr-10 placeholder:text-gray-700 focus:border-foodguard-500 focus:outline-none focus:ring-2 focus:ring-foodguard-500/30"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPwd2((s) => !s)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-800 hover:text-black"
                                aria-label="Mostrar senha"
                            >
                                {showPwd2 ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                            </button>
                        </div>
                    </div>
                </div>

                <div>
                    <button
                        type="submit"
                        className="h-12 w-full rounded-lg bg-foodguard-500 font-bold uppercase tracking-wide text-white transition-colors hover:bg-foodguard-500/90"
                    >
                        Continuar
                    </button>

                    <p className="text-sm text-black mt-3">
                        Já possui conta?{" "}
                        <Link to="/login" className="font-bold uppercase text-foodguard-500 hover:underline">
                            Acessar
                        </Link>
                    </p>
                </div>
            </form>
        </>
    );
};

export default CadastroForm;
