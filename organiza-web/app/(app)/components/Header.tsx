"use client";

import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Toggle } from "@/components/ui/toggle";
import { Button } from "@/components/ui/button";
import { Moon, Sun, Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useTheme } from "next-themes";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAppStore } from "@/store/useAppStore";
import { Priority, Status } from "@/types/filters.types";
import { useEffect, useState } from "react";

export default function Header() {
  const {
    setOpenCreateTask,
    selectedList,
    selectedListTitle,
    activeView,
    setActiveView,
    priorityWhereFilter,
    statusWhereFilter,
    setSearchWhereFilter,
    setStatusWhereFilter,
    setPriorityWhereFilter,
    setCreateTaskListId,
  } = useAppStore();
  const IsMobile = useIsMobile();
  const { theme, setTheme } = useTheme();
  const [searchInput, setSearchInput] = useState("");

  useEffect(() => {
    const t = setTimeout(() => {
      setSearchWhereFilter(searchInput);
    }, 300);
    return () => clearTimeout(t);
  }, [searchInput, setSearchWhereFilter]);

  return (
    <header className="p-4 md:px-8 md:py-6 border-b border-sidebar-border bg-surface">
      <div className="flex items-center justify-start gap-2 mb-4">
        {IsMobile && <SidebarTrigger className="h-6 w-6" />}
        <h5 className="flex flex-1">
          {selectedListTitle !== "all-tasks"
            ? selectedListTitle
            : "Todas as Tarefas"}
        </h5>
        <Button
          onClick={() => {
            setCreateTaskListId(selectedList);
            setOpenCreateTask(true);
          }}
        >
          <Plus strokeWidth={3} color="#fff" />
          {!IsMobile && "Nova tarefa"}
        </Button>
        <Toggle
          size="sm"
          className="rounded-full h-8 w-8 border border-sidebar-border bg-gray-100 cursor-pointer"
          pressed={theme === "dark"}
          onPressedChange={(pressed) => setTheme(pressed ? "dark" : "light")}
        >
          {theme === "dark" ? (
            <Sun className="text-primary" />
          ) : (
            <Moon className="text-primary" />
          )}
        </Toggle>
      </div>
      <div className="flex flex-col md:flex-row gap-2">
        <div className="p-0.5 flex flex-row items-center justify-evenly border border-sidebar-border rounded-md bg-background">
          <button
            className={cn(
              "flex-1 px-3 py-1.5 text-xs rounded-md cursor-pointer text-center",
              activeView === "list"
                ? "bg-primary text-white "
                : "hover:bg-secondary",
            )}
            onClick={() => setActiveView("list")}
          >
            Lista
          </button>
          <button
            className={cn(
              "flex-1 px-3 py-1.5  text-xs rounded-md cursor-pointer text-center",
              activeView === "kanban"
                ? "bg-primary text-white"
                : "hover:bg-secondary",
            )}
            onClick={() => setActiveView("kanban")}
          >
            Kanban
          </button>
          <button
            className={cn(
              "flex-1 px-3 py-1.5 text-xs rounded-md cursor-pointer text-center",
              activeView === "calendar"
                ? "bg-primary text-white"
                : "hover:bg-secondary",
            )}
            onClick={() => setActiveView("calendar")}
          >
            Calendário
          </button>
        </div>
        <Input
          placeholder="Buscar tarefas..."
          className="md:flex-1 border-sidebar-border bg-background dark:bg-background md:text-xs"
          onChange={(e) => setSearchInput(e.target.value)}
        />
        <div className="flex flex-row gap-2 items-center justify-evenly">
          <Select
            value={priorityWhereFilter ?? "ALL"}
            onValueChange={(value) =>
              setPriorityWhereFilter(
                value === "ALL" ? null : (value as Priority),
              )
            }
          >
            <SelectTrigger className="w-full bg-background dark:bg-background text-xs border-sidebar-border">
              <SelectValue placeholder="Prioridade" />
            </SelectTrigger>

            <SelectContent position="popper" align="end" className="p-1">
              <SelectItem value="ALL" className="text-xs text-muted-foreground">
                Todas as prioridades
              </SelectItem>
              <SelectItem value="LOW" className="text-xs">
                Baixa
              </SelectItem>
              <SelectItem value="MEDIUM" className="text-xs">
                Média
              </SelectItem>
              <SelectItem value="HIGH" className="text-xs">
                Alta
              </SelectItem>
            </SelectContent>
          </Select>
          <Select
            value={statusWhereFilter ?? "ALL"}
            onValueChange={(value) =>
              setStatusWhereFilter(value === "ALL" ? null : (value as Status))
            }
          >
            <SelectTrigger className="w-full bg-background dark:bg-background text-xs border-sidebar-border ">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent position="popper" align="end" className="p-1">
              <SelectItem value="ALL" className="text-xs text-muted-foreground">
                Todas os status
              </SelectItem>
              <SelectItem value="TODO" className="text-xs">
                A fazer
              </SelectItem>
              <SelectItem value="IN_PROGRESS" className="text-xs">
                Em andamento
              </SelectItem>
              <SelectItem value="DONE" className="text-xs">
                Concluído
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </header>
  );
}
