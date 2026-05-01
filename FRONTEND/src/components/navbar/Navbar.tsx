import { FiUser } from "react-icons/fi"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

const NavBar = () => {
    return (
        <header className="pt-6">
            <div className="flex max-w-6xl items-center gap-4">
                <div className="flex flex-1 items-center justify-between rounded-full border border-zinc-500 bg-white pl-6 pr-8 py-3 shadow-sm shadow-black/15">
                    <h1 className="font-sansita text-4xl font-extrabold tracking-tight text-black">
                        FoodGuard
                    </h1>
                    <nav className="flex items-center gap-16">
                        <a
                            href="#como-funciona"
                            className="text-base font-semibold text-black transition-colors hover:text-foodguard-500"
                        >
                            Como funciona?
                        </a>
                        <a
                            href="#quem-somos"
                            className="text-base font-semibold text-black transition-colors hover:text-foodguard-500"
                        >
                            Quem somos
                        </a>
                    </nav>
                </div>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <div className="flex items-center justify-center bg-red-500/20 rounded-full p-4 max-w-14 max-h-14 shadow-sm shadow-black/15 cursor-pointer"
                            aria-label="Perfil de usuário">
                            <FiUser className="text-4xl text-red-500 font-extrabold" />
                        </div>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start" className="bg-white border border-zinc-500 font-medium">
                        <DropdownMenuGroup>
                            <DropdownMenuItem className="outline-none hover:bg-foodguard-300/50 active:bg-foodguard-300">
                                Editar
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-red-700 outline-none hover:bg-red-300 active:bg-red-400">
                                Sair
                            </DropdownMenuItem>
                        </DropdownMenuGroup>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>

        </header>
    );
};

export default NavBar;
