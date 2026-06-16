import { useCallback, useEffect, useState } from "react";
import { AxiosError } from "axios";
import { X, User as UserIcon, Database, Pencil, Eye, EyeOff, Mail } from "lucide-react";
import logo from "@/assets/logo.svg";
import { useAuth } from "@/hooks/use-auth";
import { authService } from "@/services/auth.service";
import { anamneseService } from "@/services/anamnese.service";
import { ANAMNESE_UPDATED_EVENT } from "@/lib/events";
import type { Anamnese, AnamneseRequest, BodyFeeling, EatingStyle } from "@/models/anamnese.model";

interface Props {
    open: boolean;
    onClose: () => void;
}

type Section = "pessoal" | "anamnese";

const EditProfileModal = ({ open, onClose }: Props) => {
    const [section, setSection] = useState<Section>("pessoal");

    if (!open) return null;

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur bg-black/50 p-4 animate-fade-in"
            onClick={onClose}
        >
            <div
                className="flex w-full max-w-4xl overflow-hidden rounded-2xl bg-white shadow-2xl"
                onClick={(e) => e.stopPropagation()}
            >
                <aside className="flex w-56 flex-col gap-2 bg-slate-100 border-r border-zinc-500/50 p-4">
                    <button
                        onClick={onClose}
                        aria-label="Fechar"
                        className="mb-4 flex h-9 w-9 items-center justify-center rounded-md text-black hover:bg-slate-200"
                    >
                        <X className="h-5 w-5" />
                    </button>

                    <button
                        onClick={() => setSection("pessoal")}
                        className={`flex items-center gap-3 rounded-lg px-4 py-3 text-left font-semibold transition-colors ${section === "pessoal"
                                ? "bg-foodguard-500 text-white font-bold"
                                : "text-black hover:bg-slate-200"
                            }`}
                    >
                        <UserIcon className="h-5 w-5" />
                        Pessoal
                    </button>

                    <button
                        onClick={() => setSection("anamnese")}
                        className={`flex items-center gap-3 rounded-lg px-4 py-3 text-left font-semibold transition-colors ${section === "anamnese"
                                ? "bg-foodguard-500 text-white font-bold"
                                : "text-black hover:bg-slate-200"
                            }`}
                    >
                        <Database className="h-5 w-5" />
                        Perfil Alimentar
                    </button>
                </aside>

                {/* Content */}
                <div className="max-h-[90vh] flex-1 overflow-y-auto p-8">
                    {section === "pessoal" ? <PessoalSection /> : <AnamneseSection />}
                </div>
            </div>
        </div>
    );
};

const EditHeader = ({
    title,
    editing,
    onEdit,
}: {
    title: string;
    editing: boolean;
    onEdit: () => void;
}) => (
    <div className="mb-8 flex items-center gap-4">
        <h2 className="font-sansita text-4xl font-bold tracking-tight text-black">
            {title}
        </h2>
        <button
            onClick={onEdit}
            className={`flex items-center gap-2 rounded-full border-2 border-foodguard-500 px-4 py-1.5 text-sm font-semibold transition-colors ${editing
                    ? "bg-foodguard-600 text-white font-bold"
                    : "text-black hover:bg-foodguard-500/10"
                }`}
        >
            <Pencil className="h-4 w-4" />
            Editar
        </button>
    </div>
);

const fieldClass = (editing: boolean) =>
    `h-11 w-full rounded-md border border-border px-3 pr-10 text-black focus:border-foodguard-500 focus:outline-none focus:ring-2 focus:ring-foodguard-500/30 ${editing ? "bg-slate-50" : "bg-slate-100 cursor-not-allowed"
    }`;

const textareaClass = (editing: boolean) =>
    `w-full resize-none rounded-md border border-border px-3 py-2 text-black focus:border-foodguard-500 focus:outline-none focus:ring-2 focus:ring-foodguard-500/30 ${editing ? "bg-slate-50" : "bg-slate-100 cursor-not-allowed"
    }`;

const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;

const PessoalSection = () => {
    const { user, setUser } = useAuth();
    const [editing, setEditing] = useState(false);
    const [showPwd, setShowPwd] = useState(false);
    const [showPwd2, setShowPwd2] = useState(false);

    const [username, setUsername] = useState(user?.username ?? "");
    const [password, setPassword] = useState("");
    const [confirm, setConfirm] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);
    const [saving, setSaving] = useState(false);

    const handleUpdate = async () => {
        setError(null);
        setSuccess(false);

        if (password) {
            if (!PASSWORD_REGEX.test(password)) {
                setError("A senha precisa de no mínimo 8 caracteres, com maiúscula, minúscula e número.");
                return;
            }
            if (password !== confirm) {
                setError("As senhas não coincidem.");
                return;
            }
        }

        const payload: { username?: string; password?: string } = {};
        if (username && username !== user?.username) payload.username = username;
        if (password) payload.password = password;

        if (Object.keys(payload).length === 0) {
            setEditing(false);
            return;
        }

        setSaving(true);
        try {
            const updated = await authService.atualizarPerfil(payload);
            setUser(updated);
            setPassword("");
            setConfirm("");
            setSuccess(true);
            setEditing(false);
        } catch (err) {
            const detail =
                err instanceof AxiosError && err.response?.data
                    ? String(Object.values(err.response.data as Record<string, unknown>)[0])
                    : "Não foi possível atualizar o perfil.";
            setError(detail);
        } finally {
            setSaving(false);
        }
    };

    return (
        <>
            <EditHeader title="DADOS PESSOAIS" editing={editing} onEdit={() => setEditing((s) => !s)} />

            {error && (
                <div className="mb-4 rounded-md bg-red-100 px-4 py-2 text-sm font-medium text-red-700">
                    {error}
                </div>
            )}
            {success && (
                <div className="mb-4 rounded-md bg-foodguard-100 px-4 py-2 text-sm font-medium text-foodguard-600">
                    Perfil atualizado com sucesso.
                </div>
            )}

            <div className="grid gap-8 sm:grid-cols-[1fr_auto] sm:items-start">
                <div className="space-y-6">
                    <div className="space-y-2">
                        <label className="block text-sm font-semibold text-black">Nome</label>
                        <div className="relative">
                            <input
                                type="text"
                                value={user?.name ?? ""}
                                disabled
                                className={fieldClass(false)}
                            />
                            <UserIcon className="pointer-events-none absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-800" />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="block text-sm font-semibold text-black">Seu usuário</label>
                        <div className="relative">
                            <input
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                disabled={!editing}
                                className={fieldClass(editing)}
                            />
                            <UserIcon className="pointer-events-none absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-800" />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="block text-sm font-semibold text-black">Seu email</label>
                        <div className="relative">
                            <input
                                type="email"
                                value={user?.email ?? ""}
                                disabled
                                className={fieldClass(false)}
                            />
                            <Mail className="pointer-events-none absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-800" />
                        </div>
                    </div>
                </div>

                <div className="flex justify-center sm:justify-end">
                    <img src={logo} alt="" className="h-40 w-40 rounded-full" />
                </div>
            </div>

            <div className="mt-6 grid gap-6 sm:grid-cols-2">
                <div className="space-y-2">
                    <label className="block text-sm font-semibold text-black">Nova senha</label>
                    <div className="relative">
                        <input
                            type={showPwd ? "text" : "password"}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder={editing ? "Deixe em branco para manter" : "************"}
                            disabled={!editing}
                            className={fieldClass(editing)}
                        />
                        <button
                            type="button"
                            onClick={() => setShowPwd((s) => !s)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-800 hover:text-black"
                        >
                            {showPwd ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                        </button>
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="block text-sm font-semibold text-black">Confirmar a senha</label>
                    <div className="relative">
                        <input
                            type={showPwd2 ? "text" : "password"}
                            value={confirm}
                            onChange={(e) => setConfirm(e.target.value)}
                            disabled={!editing}
                            className={fieldClass(editing)}
                        />
                        <button
                            type="button"
                            onClick={() => setShowPwd2((s) => !s)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-800 hover:text-black"
                        >
                            {showPwd2 ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                        </button>
                    </div>
                </div>
            </div>

            <div className="mt-10 flex justify-end">
                <button
                    onClick={handleUpdate}
                    disabled={!editing || saving}
                    className="h-12 rounded-lg bg-foodguard-500 px-10 font-bold uppercase tracking-wide text-white transition-colors hover:bg-foodguard-500/90 disabled:cursor-not-allowed disabled:opacity-50"
                >
                    {saving ? "Salvando..." : "Atualizar"}
                </button>
            </div>
        </>
    );
};

const Radio = ({
    name,
    value,
    checked,
    onChange,
    label,
    disabled,
}: {
    name: string;
    value: string;
    checked: boolean;
    onChange: (v: string) => void;
    label: string;
    disabled: boolean;
}) => (
    <label
        className={`flex items-center gap-2 text-black ${disabled ? "cursor-not-allowed" : "cursor-pointer"
            }`}
    >
        <input
            type="radio"
            name={name}
            value={value}
            checked={checked}
            onChange={() => onChange(value)}
            disabled={disabled}
            className="sr-only"
        />
        <span
            className={`flex h-5 w-5 items-center justify-center rounded-full border-2 transition-colors ${checked ? "border-foodguard-700" : "border-zinc-500"
                }`}
        >
            {checked && <span className="h-2.5 w-2.5 rounded-full bg-foodguard-500" />}
        </span>
        <span className="text-sm">{label}</span>
    </label>
);

// Mapeamento sentimento ↔ enum do backend (mesmo de cadastro/Anamnese.tsx, nos dois sentidos).
const FEELING_TO_BACKEND: Record<string, BodyFeeling> = {
    "muito-satisfeito": "very_satisfied",
    satisfeito: "satisfied",
    indiferente: "indifferent",
    insatisfeito: "dissatisfied",
    "muito-insatisfeito": "very_dissatisfied",
};

const FEELING_TO_FORM: Record<BodyFeeling, string> = {
    very_satisfied: "muito-satisfeito",
    satisfied: "satisfeito",
    indifferent: "indiferente",
    dissatisfied: "insatisfeito",
    very_dissatisfied: "muito-insatisfeito",
};

const AnamneseSection = () => {
    const [editing, setEditing] = useState(false);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    const [consulta, setConsulta] = useState("nao");
    const [objetivo, setObjetivo] = useState("");
    const [resultado, setResultado] = useState("");
    const [alergia, setAlergia] = useState("");
    const [doencas, setDoencas] = useState("");
    const [medicamentos, setMedicamentos] = useState("");
    const [intol, setIntol] = useState("");
    const [pref, setPref] = useState("");
    const [naoGosta, setNaoGosta] = useState("");
    const [sent, setSent] = useState("indiferente");
    const [veg, setVeg] = useState<EatingStyle>("not");
    const [alcool, setAlcool] = useState("nao");
    const [fumo, setFumo] = useState("nao");

    const applyAnamnese = useCallback((a: Anamnese) => {
        setConsulta(a.previous_consultation ? "sim" : "nao");
        setObjetivo(a.previous_consultation_objective ?? "");
        setResultado(a.previous_consultation_result ?? "");
        setAlergia(a.food_allergies ?? "");
        setDoencas(a.disease_history ?? "");
        setMedicamentos(a.medications ?? "");
        setIntol(a.food_intolerances ?? "");
        setPref(a.favorite_foods ?? "");
        setNaoGosta(a.food_aversions ?? "");
        setSent(a.body_feeling ? FEELING_TO_FORM[a.body_feeling] : "indiferente");
        setVeg(a.eating_style);
        setAlcool(a.alcohol_intake ? "sim" : "nao");
        setFumo(a.smoking ? "sim" : "nao");
    }, []);

    // Carrega a anamnese real ao abrir o modal (RF016).
    useEffect(() => {
        let active = true;
        setLoading(true);
        setError(null);
        anamneseService
            .getMe()
            .then((a) => active && applyAnamnese(a))
            .catch(() => active && setError("Não foi possível carregar o perfil alimentar."))
            .finally(() => active && setLoading(false));
        return () => {
            active = false;
        };
    }, [applyAnamnese]);

    const handleUpdate = async () => {
        setError(null);
        setSuccess(false);

        const isPrevious = consulta === "sim";
        if (isPrevious && !objetivo.trim()) {
            setError("Informe o objetivo da consulta prévia com nutricionista.");
            return;
        }
        if (!pref.trim()) {
            setError("Informe ao menos um alimento de preferência.");
            return;
        }

        const payload: AnamneseRequest = {
            previous_consultation: isPrevious,
            previous_consultation_objective: isPrevious ? objetivo.trim() : null,
            previous_consultation_result: isPrevious ? resultado.trim() || null : null,
            disease_history: doencas.trim() || null,
            medications: medicamentos.trim() || null,
            food_allergies: alergia.trim() || null,
            food_intolerances: intol.trim() || null,
            favorite_foods: pref.trim(),
            food_aversions: naoGosta.trim() || null,
            body_feeling: FEELING_TO_BACKEND[sent] ?? null,
            eating_style: veg,
            alcohol_intake: alcool === "sim",
            smoking: fumo === "sim",
        };

        setSaving(true);
        try {
            const updated = await anamneseService.atualizar(payload);
            applyAnamnese(updated);
            setSuccess(true);
            setEditing(false);
            // RN004: a atualização invalida os chats antigos no backend — sinaliza a UI de chat para recarregar.
            window.dispatchEvent(new Event(ANAMNESE_UPDATED_EVENT));
        } catch (err) {
            const detail =
                err instanceof AxiosError && err.response?.data
                    ? String(Object.values(err.response.data as Record<string, unknown>)[0])
                    : "Não foi possível atualizar o perfil alimentar.";
            setError(detail);
        } finally {
            setSaving(false);
        }
    };

    const d = !editing;

    return (
        <>
            <EditHeader
                title="PERFIL ALIMENTAR"
                editing={editing}
                onEdit={() => !loading && setEditing((s) => !s)}
            />

            {error && (
                <div className="mb-4 rounded-md bg-red-100 px-4 py-2 text-sm font-medium text-red-700">
                    {error}
                </div>
            )}
            {success && (
                <div className="mb-4 rounded-md bg-foodguard-100 px-4 py-2 text-sm font-medium text-foodguard-600">
                    Perfil alimentar atualizado. Suas conversas serão recarregadas.
                </div>
            )}

            {loading ? (
                <div className="flex h-40 items-center justify-center">
                    <span className="animate-pulse text-slate-500">Carregando perfil alimentar...</span>
                </div>
            ) : (
                <>
                    <div className="grid gap-x-8 gap-y-6 sm:grid-cols-2">
                        <div className="space-y-3">
                            <p className="text-sm font-semibold text-black">
                                Já fez consulta prévia com nutricionista?
                            </p>
                            <div className="space-y-2">
                                <Radio name="consulta" value="sim" checked={consulta === "sim"} onChange={setConsulta} label="Sim" disabled={d} />
                                <Radio name="consulta" value="nao" checked={consulta === "nao"} onChange={setConsulta} label="Não" disabled={d} />
                            </div>
                        </div>

                        {consulta === "sim" ? (
                            <>
                                <div className="space-y-2">
                                    <label className="block text-sm font-semibold text-black">
                                        Qual era o objetivo na época?
                                    </label>
                                    <textarea rows={3} disabled={d} value={objetivo} onChange={(e) => setObjetivo(e.target.value)} className={textareaClass(editing)} />
                                </div>

                                <div className="space-y-2">
                                    <label className="block text-sm font-semibold text-black">
                                        Obteve resultado? Se sim, qual?
                                    </label>
                                    <textarea rows={3} disabled={d} value={resultado} onChange={(e) => setResultado(e.target.value)} className={textareaClass(editing)} />
                                </div>
                            </>
                        ) : null}

                        <div className="space-y-2">
                            <label className="block text-sm font-semibold text-black">
                                Possui alergia a algum alimento? Se sim, qual?
                            </label>
                            <textarea rows={3} disabled={d} value={alergia} onChange={(e) => setAlergia(e.target.value)} className={textareaClass(editing)} />
                        </div>

                        <div className="space-y-2">
                            <label className="block text-sm font-semibold text-black">
                                Você possui histórico de doenças? Se sim, quais?
                            </label>
                            <textarea rows={3} disabled={d} value={doencas} onChange={(e) => setDoencas(e.target.value)} className={textareaClass(editing)} />
                        </div>

                        <div className="space-y-2">
                            <label className="block text-sm font-semibold text-black">
                                Faz uso de algum medicamento? Se sim, qual?
                            </label>
                            <textarea rows={3} disabled={d} value={medicamentos} onChange={(e) => setMedicamentos(e.target.value)} className={textareaClass(editing)} />
                        </div>

                        <div className="space-y-2">
                            <label className="block text-sm font-semibold text-black">
                                Tem intolerância a algum alimento? Se sim, qual?
                            </label>
                            <textarea rows={3} disabled={d} value={intol} onChange={(e) => setIntol(e.target.value)} className={textareaClass(editing)} />
                        </div>

                        <div className="space-y-2">
                            <label className="block text-sm font-semibold text-black">
                                Alimentos que você tem preferência?
                            </label>
                            <textarea rows={3} disabled={d} value={pref} onChange={(e) => setPref(e.target.value)} className={textareaClass(editing)} />
                        </div>

                        <div className="space-y-2">
                            <label className="block text-sm font-semibold text-black">
                                Alimentos que você não gosta?
                            </label>
                            <textarea rows={3} disabled={d} value={naoGosta} onChange={(e) => setNaoGosta(e.target.value)} className={textareaClass(editing)} />
                        </div>

                        <div className="space-y-3">
                            <p className="text-sm font-semibold text-black">
                                Sentimento sobre o seu corpo e alimentação?
                            </p>
                            <div className="grid grid-cols-2 gap-2">
                                <Radio name="sent" value="muito-satisfeito" checked={sent === "muito-satisfeito"} onChange={setSent} label="Muito Satisfeito" disabled={d} />
                                <Radio name="sent" value="satisfeito" checked={sent === "satisfeito"} onChange={setSent} label="Satisfeito" disabled={d} />
                                <Radio name="sent" value="indiferente" checked={sent === "indiferente"} onChange={setSent} label="Indiferente" disabled={d} />
                                <Radio name="sent" value="insatisfeito" checked={sent === "insatisfeito"} onChange={setSent} label="Insatisfeito" disabled={d} />
                                <Radio name="sent" value="muito-insatisfeito" checked={sent === "muito-insatisfeito"} onChange={setSent} label="Muito Insatisfeito" disabled={d} />
                            </div>
                        </div>

                        <div className="space-y-3">
                            <p className="text-sm font-semibold text-black">Estilo de alimentação</p>
                            <div className="grid grid-cols-2 gap-2">
                                <Radio name="veg" value="not" checked={veg === "not"} onChange={(v) => setVeg(v as EatingStyle)} label="Não" disabled={d} />
                                <Radio name="veg" value="vegan" checked={veg === "vegan"} onChange={(v) => setVeg(v as EatingStyle)} label="Vegano(a)" disabled={d} />
                                <Radio name="veg" value="vegetarian" checked={veg === "vegetarian"} onChange={(v) => setVeg(v as EatingStyle)} label="Vegetariano(a)" disabled={d} />
                            </div>
                        </div>

                        <div className="space-y-3">
                            <p className="text-sm font-semibold text-black">Ingestão de Álcool?</p>
                            <div className="space-y-2">
                                <Radio name="alcool" value="sim" checked={alcool === "sim"} onChange={setAlcool} label="Sim" disabled={d} />
                                <Radio name="alcool" value="nao" checked={alcool === "nao"} onChange={setAlcool} label="Não" disabled={d} />
                            </div>
                        </div>

                        <div className="space-y-3">
                            <p className="text-sm font-semibold text-black">Fumo?</p>
                            <div className="space-y-2">
                                <Radio name="fumo" value="sim" checked={fumo === "sim"} onChange={setFumo} label="Sim" disabled={d} />
                                <Radio name="fumo" value="nao" checked={fumo === "nao"} onChange={setFumo} label="Não" disabled={d} />
                            </div>
                        </div>
                    </div>

                    <div className="mt-10 flex justify-end">
                        <button
                            onClick={handleUpdate}
                            disabled={!editing || saving}
                            className="h-12 rounded-lg bg-foodguard-500 px-10 font-bold uppercase tracking-wide text-white transition-colors hover:bg-foodguard-500/90 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            {saving ? "Salvando..." : "Atualizar"}
                        </button>
                    </div>
                </>
            )}
        </>
    );
};

export default EditProfileModal;
