import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, User } from "lucide-react";
import AuthLayout from "@/components/authLayout/AuthLayout";

const Login = () => {
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = (e: React.SubmitEvent<HTMLFormElement> | React.KeyboardEvent<HTMLTextAreaElement>) => {
        e.preventDefault();
        navigate("/chat");
    };

    return (
        <AuthLayout>
            <h2 className="font-sansita text-3xl font-bold text-black">
                ACESSAR
            </h2>

            <form onSubmit={handleSubmit} className="space-y-12">
                <div className="space-y-2">
                    <label htmlFor="user" className="block font-semibold text-black">
                        Seu usuário
                    </label>
                    <div className="relative">
                        <input
                            id="user"
                            type="text"
                            placeholder="Usuário"
                            className="h-12 w-full rounded-md border border-zinc-500 bg-slate-50 px-4 pr-10 text-black placeholder:text-gray-700 focus:border-foodguard-500 focus:outline-none focus:ring-2 focus:ring-foodguard-500/30"
                        />
                        <User className="pointer-events-none absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-800" />
                    </div>
                </div>

                <div className="space-y-2">
                    <label htmlFor="password" className="block font-semibold text-black">
                        Sua senha
                    </label>
                    <div className="relative">
                        <input
                            id="password"
                            type={showPassword ? "text" : "password"}
                            placeholder="Senha"
                            className="h-12 w-full rounded-md border border-zinc-500 bg-slate-50 px-4 pr-10 text-black placeholder:text-gray-700 focus:border-foodguard-500 focus:outline-none focus:ring-2 focus:ring-foodguard-500/30"
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword((s) => !s)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-800 hover:text-black"
                            aria-label="Mostrar senha"
                        >
                            {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                        </button>
                    </div>
                    <Link
                        to="/esqueci-senha"
                        className="inline-block pt-1 font-semibold text-foodguard-500 hover:underline"
                    >
                        Esqueci minha senha
                    </Link>
                </div>

                <div>
                    <button
                        type="submit"
                        className="h-12 w-full rounded-lg bg-foodguard-500 font-bold uppercase tracking-wide text-white transition-colors hover:bg-foodguard-500/90"
                    >
                        Entrar
                    </button>

                    <p className="text-sm text-black mt-3">
                        Não possui conta?{" "}
                        <Link to="/cadastro" className="font-bold uppercase text-foodguard-500 hover:underline">
                            Cadastrar-se
                        </Link>
                    </p>
                </div>

            </form>
        </AuthLayout>
    );
};

export default Login;
