import { useState } from "react";
import { X, User as UserIcon, Database, Pencil, Eye, EyeOff, Mail } from "lucide-react";
import logo from "@/assets/logo.svg";

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

const PessoalSection = () => {
    const [editing, setEditing] = useState(false);
    const [showPwd, setShowPwd] = useState(false);
    const [showPwd2, setShowPwd2] = useState(false);

    return (
        <>
            <EditHeader title="DADOS PESSOAIS" editing={editing} onEdit={() => setEditing((s) => !s)} />

            <div className="grid gap-8 sm:grid-cols-[1fr_auto] sm:items-start">
                <div className="space-y-6">
                    <div className="space-y-2">
                        <label className="block text-sm font-semibold text-black">Seu usuário</label>
                        <div className="relative">
                            <input
                                type="text"
                                defaultValue="Nome generico"
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
                                defaultValue="email.email@teste.com"
                                disabled={!editing}
                                className={fieldClass(editing)}
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
                    <label className="block text-sm font-semibold text-black">Sua senha</label>
                    <div className="relative">
                        <input
                            type={showPwd ? "text" : "password"}
                            defaultValue="************"
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
                            defaultValue="************"
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
                    disabled={!editing}
                    className="h-12 rounded-lg bg-foodguard-500 px-10 font-bold uppercase tracking-wide text-white transition-colors hover:bg-foodguard-500/90 disabled:cursor-not-allowed disabled:opacity-50"
                >
                    Atualizar
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

const AnamneseSection = () => {
    const [editing, setEditing] = useState(false);
    const [consulta, setConsulta] = useState("sim");
    const [alergia, setAlergia] = useState("");
    const [doencas, setDoencas] = useState("");
    const [intol, setIntol] = useState("");
    const [pref, setPref] = useState("");
    const [naoGosta, setNaoGosta] = useState("");
    const [sent, setSent] = useState("muito-satisfeito");
    const [veg, setVeg] = useState("outro");
    const [vegOutro, setVegOutro] = useState("");
    const [alcool, setAlcool] = useState("sim");
    const [fumo, setFumo] = useState("sim");

    const d = !editing;

    return (
        <>
            <EditHeader title="PERFIL ALIMENTAR" editing={editing} onEdit={() => setEditing((s) => !s)} />

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
                    <p className="text-sm font-semibold text-black">Vegetariano?</p>
                    <div className="grid grid-cols-2 gap-2">
                        <Radio name="veg" value="nao" checked={veg === "nao"} onChange={setVeg} label="Não" disabled={d} />
                        <Radio name="veg" value="vegano" checked={veg === "vegano"} onChange={setVeg} label="Vegano(a)" disabled={d} />
                        <Radio name="veg" value="vegetariano" checked={veg === "vegetariano"} onChange={setVeg} label="Vegetariano(a)" disabled={d} />
                        <Radio name="veg" value="outro" checked={veg === "outro"} onChange={setVeg} label="Outro" disabled={d} />
                    </div>
                    {veg === "outro" && (
                        <input
                            type="text"
                            disabled={d}
                            value={vegOutro}
                            onChange={(e) => setVegOutro(e.target.value)}
                            className={`mt-2 ${fieldClass(editing)}`}
                        />
                    )}
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
                    disabled={!editing}
                    className="h-12 rounded-lg bg-foodguard-500 px-10 font-bold uppercase tracking-wide text-white transition-colors hover:bg-foodguard-500/90 disabled:cursor-not-allowed disabled:opacity-50"
                >
                    Atualizar
                </button>
            </div>
        </>
    );
};

export default EditProfileModal;
