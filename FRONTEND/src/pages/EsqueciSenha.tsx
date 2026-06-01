import { Link } from "react-router-dom";
import { Mail } from "lucide-react";
import AuthLayout from "@/components/authLayout/AuthLayout";

const EsqueciSenha = () => {
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
    };

    return (
        <AuthLayout>
            <h2 className="font-sansita text-3xl font-bold text-black">
                ESQUECI A SENHA
            </h2>

            <form onSubmit={handleSubmit} className="space-y-12">
                <div className="space-y-2">
                    <label className="block font-semibold text-black">Seu email</label>
                    <div className="relative">
                        <input
                            type="email"
                            placeholder="Email"
                            className="h-12 w-full rounded-md border border-zinc-500 bg-slate-50 px-4 pr-10 placeholder:text-gray-700 focus:border-foodguard-500 focus:outline-none focus:ring-2 focus:ring-foodguard-500/30"
                        />
                        <Mail className="pointer-events-none absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-800" />
                    </div>
                </div>

                <div>
                    <button
                        type="submit"
                        className="h-12 w-full rounded-lg bg-foodguard-500 font-bold uppercase tracking-wide text-white transition-colors hover:bg-foodguard-500/90"
                    >
                        Enviar
                    </button>

                    <p className="text-sm text-black mt-3">
                        Já possui conta?{" "}
                        <Link to="/login" className="font-bold uppercase text-foodguard-500 hover:underline">
                            Acessar
                        </Link>
                    </p>
                </div>
            </form>
        </AuthLayout>
    );
};

export default EsqueciSenha;
