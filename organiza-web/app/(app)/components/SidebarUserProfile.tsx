"use client";

import { MoreVertical, User, LogOut } from "lucide-react";
import { useSidebar } from "@/components/ui/sidebar";
import { createClient } from "@/lib/supabase/cliente";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { useGetMe } from "@/hooks/useUsers";

// Mock data - Dados mockados para visualização
const mockUser = {
  name: "shadcn",
  email: "m@example.com",
  avatar: "https://github.com/shadcn.png",
};

export default function SidebarUserProfile() {
  const { data, isLoading: isLoadingGetMe, isError: isErrorGetMe } = useGetMe();
  const { state } = useSidebar();
  const isCollapsed = state === "collapsed";
  const supabase = createClient();

  if (isLoadingGetMe)
    return (
      <p className="flex flex-col items-center justify-center w-full h-full">
        Carregando...
      </p>
    );
  if (isErrorGetMe) return <p>Erro ao carregar listas</p>;


  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();

    if (error) {
      console.error("Erro ao sair: ", error.message);
    } else {
      window.location.href = "/login";
    }
  };

  return (
    <div className="border-t border-sidebar-border px-2 py-3">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          {isCollapsed ? (
            // Modo Colapsado: Avatar Centralizado
            <button className="flex items-center justify-center w-full cursor-pointer rounded-md hover:bg-sidebar-accent">
              <div className="h-9 w-9 rounded-full overflow-hidden shrink-0 bg-sidebar-accent flex items-center justify-center">
                {data.avatar ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={data.avatar}
                    alt={data.name}
                    className="h-9 w-9 object-cover"
                  />
                ) : (
                  <span className="text-xs font-semibold text-sidebar-foreground">
                    {data.name.charAt(0).toUpperCase()}
                  </span>
                )}
              </div>
            </button>
          ) : (
            // Modo Expandido: Avatar + Nome + Email + Menu
            <button className="flex items-center justify-between gap-2 p-2 w-full cursor-pointer rounded-md hover:bg-sidebar-hover">
              <div className="flex items-center gap-2 flex-1 min-w-0">
                {/* Avatar */}
                <div className="h-9 w-9 rounded-full overflow-hidden shrink-0 bg-sidebar-accent flex items-center justify-center">
                  {data.avatar ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={data.avatar}
                      alt={data.name}
                      className="h-9 w-9 object-cover"
                    />
                  ) : (
                    <span className="text-xs font-semibold text-sidebar-foreground">
                      {data.name.charAt(0).toUpperCase()}
                    </span>
                  )}
                </div>

                {/* Nome + Email */}
                <div className="flex-1 min-w-0 flex flex-col items-start overflow-hidden">
                  <p className="text-[11px] font-semibold text-sidebar-foreground truncate">
                    {data.name}
                  </p>
                  <p className="text-[9px] text-sidebar-foreground/70 truncate">
                    {data.email}
                  </p>
                </div>
              </div>

              {/* Menu Button */}
              <MoreVertical className="h-4 w-4 shrink-0" />
            </button>
          )}
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuItem className="cursor-pointer">
            <User className="mr-2 h-4 w-4" />
            <span>Account</span>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="cursor-pointer">
            <button
              onClick={handleLogout}
              className="flex flex-row items-center gap-2 cursor-pointer"
            >
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </button>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
