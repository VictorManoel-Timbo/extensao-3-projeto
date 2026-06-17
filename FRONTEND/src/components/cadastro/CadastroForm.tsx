import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Calendar, Eye, EyeOff, Mail, User } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { PASSWORD_REGEX, inputClass, extractError } from "@/lib/anamnese.constants";

const NAME_REGEX = /^[a-zA-ZÀ-ÿ '-]+$/;

const CadastroForm = () => {
    const navigate = useNavigate();
    const { register } = useAuth();

    const [name, setName] = useState("");
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [dob, setDob] = useState("");
    const [password, setPassword] = useState("");
    const [confirm, setConfirm] = useState("");
    const [showPwd, setShowPwd] = useState(false);
    const [showPwd2, setShowPwd2] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [submitting, setSubmitting] = useState(false);

    const validate = (): string | null => {
        if (!NAME_REGEX.test(name.trim()))
            return "O nome deve conter apenas letras, espaços, apóstrofos e hífens.";
        if (name.length > 250) return "O nome deve ter no máximo 250 caracteres.";
        if (!PASSWORD_REGEX.test(password))
            return "A senha precisa de no mínimo 8 caracteres, com maiúscula, minúscula e número.";
        if (password !== confirm) return "As senhas não coincidem.";
        return null;
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError(null);

        const validationError = validate();
        if (validationError) {
            setError(validationError);
            return;
        }

        setSubmitting(true);
        try {
            await register({
                name: name.trim(),
                username: username.trim(),
                email: email.trim(),
                date_of_birth: dob || null,
                password,
                password_confirm: confirm,
            });
            navigate("/anamnese", { replace: true });
        } catch (err) {
            setError(extractError(err, "Não foi possível concluir o cadastro. Tente novamente."));
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <>
            <h2 className="font-sansita text-3xl font-extrabold tracking-tight text-black">
                CADASTRAR
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">
                {error && (
                    <div className="rounded-md bg-red-100 px-4 py-2 text-sm font-medium text-red-700">
                        {error}
                    </div>
                )}

                <div className="grid gap-6 sm:grid-cols-2">
                    <div className="space-y-2">
                        <label htmlFor="cadastro-nome" className="block text-sm font-semibold text-black">Nome completo</label>
                        <div className="relative">
                            <input
                                id="cadastro-nome"
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                                maxLength={250}
                                placeholder="Nome completo"
                                className={inputClass}
                            />
                            <User className="pointer-events-none absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-800" />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="cadastro-usuario" className="block text-sm font-semibold text-black">Seu usuário</label>
                        <div className="relative">
                            <input
                                id="cadastro-usuario"
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required
                                placeholder="Usuário"
                                className={inputClass}
                            />
                            <User className="pointer-events-none absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-800" />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="cadastro-email" className="block text-sm font-semibold text-black">Seu email</label>
                        <div className="relative">
                            <input
                                id="cadastro-email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                placeholder="Email"
                                className={inputClass}
                            />
                            <Mail className="pointer-events-none absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-800" />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="cadastro-dob" className="block text-sm font-semibold text-black">Data de nascimento</label>
                        <div className="relative">
                            <input
                                id="cadastro-dob"
                                type="date"
                                value={dob}
                                onChange={(e) => setDob(e.target.value)}
                                className={inputClass}
                            />
                            <Calendar className="pointer-events-none absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-800" />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="cadastro-senha" className="block text-sm font-semibold text-black">Sua senha</label>
                        <div className="relative">
                            <input
                                id="cadastro-senha"
                                type={showPwd ? "text" : "password"}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                placeholder="Senha"
                                className={inputClass}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPwd((s) => !s)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-800 hover:text-black"
                                aria-label={showPwd ? "Ocultar senha" : "Mostrar senha"}
                            >
                                {showPwd ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                            </button>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="cadastro-confirmar-senha" className="block text-sm font-semibold text-black">Confirmar a senha</label>
                        <div className="relative">
                            <input
                                id="cadastro-confirmar-senha"
                                type={showPwd2 ? "text" : "password"}
                                value={confirm}
                                onChange={(e) => setConfirm(e.target.value)}
                                required
                                placeholder="Confirme a senha"
                                className={inputClass}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPwd2((s) => !s)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-800 hover:text-black"
                                aria-label={showPwd2 ? "Ocultar senha" : "Mostrar senha"}
                            >
                                {showPwd2 ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                            </button>
                        </div>
                    </div>
                </div>

                <div>
                    <button
                        type="submit"
                        disabled={submitting}
                        className="h-12 w-full rounded-lg bg-foodguard-500 font-bold uppercase tracking-wide text-white transition-colors hover:bg-foodguard-500/90 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        {submitting ? "Cadastrando..." : "Continuar"}
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
