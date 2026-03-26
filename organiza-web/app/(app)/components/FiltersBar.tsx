"use client";

import { cn } from "@/lib/utils";
import { useAppStore } from "@/store/useAppStore";
import { Layers, ArrowUpDown } from "lucide-react";

export default function FiltersBar() {
  const { groupBy, setGroupBy, orderBy, setOrderBy, selectedList } =
    useAppStore();

  return (
    <div className=" card p-3 bg-surface rounded-md text-xs flex flex-col  md:flex-row md:items-center border border-sidebar-border gap-4 md:gap-14">
      <div className="flex flex-col md:flex-row gap-2 md:gap-4">
        <span className="flex flex-row items-center gap-1">
          <Layers size={12} />
          Agrupar por:
        </span>
        <div className="flex flex-row items-center gap-2">
          <button
            onClick={() => setGroupBy("none")}
            className={cn(
              "bg-background border border-sidebar-border px-2.5 py-1.5 rounded-md hover:border-sidebar-foreground cursor-pointer transition-colors duration-300",
              groupBy === "none" ? "bg-primary text-white" : "",
            )}
          >
            Nenhum
          </button>
          <button
            onClick={() => setGroupBy("status")}
            className={cn(
              "bg-background border border-sidebar-border px-2.5 py-1.5 rounded-md hover:border-sidebar-foreground cursor-pointer transition-colors duration-300",
              groupBy === "status" ? "bg-primary text-white" : "",
            )}
          >
            Status
          </button>
          <button
            onClick={() => setGroupBy("priority")}
            className={cn(
              "bg-background border border-sidebar-border px-2.5 py-1.5 rounded-md hover:border-sidebar-foreground cursor-pointer transition-colors duration-300",
              groupBy === "priority" ? "bg-primary text-white" : "",
            )}
          >
            Prioridade
          </button>
          <button
            onClick={() => setGroupBy("list")}
            className={cn(
              "bg-background border border-sidebar-border px-2.5 py-1.5 rounded-md hover:border-sidebar-foreground cursor-pointer transition-colors duration-300",
              groupBy === "list" ? "bg-primary text-white" : "",
              selectedList !== "all-tasks" && "cursor-not-allowed opacity-35",
            )}
            disabled={selectedList !== "all-tasks"}
          >
            Lista
          </button>
        </div>
      </div>
      <div className="flex flex-col md:flex-row gap-2 md:gap-4">
        <span className="flex flex-row items-center gap-1 mt-4 md:mt-0">
          <ArrowUpDown size={12} />
          Ordenar por:
        </span>
        <div className="flex flex-row items-center gap-2">
          <button
            onClick={() => setOrderBy("dueDate")}
            className={cn(
              "bg-background border border-sidebar-border px-2.5 py-1.5 rounded-md hover:border-sidebar-foreground cursor-pointer transition-colors duration-300",
              orderBy === "dueDate" ? "bg-primary text-white" : "",
            )}
          >
            Vencimento
          </button>
          <button
            onClick={() => setOrderBy("priority")}
            className={cn(
              "bg-background border border-sidebar-border px-2.5 py-1.5 rounded-md hover:border-sidebar-foreground cursor-pointer transition-colors duration-300",
              orderBy === "priority" ? "bg-primary text-white" : "",
            )}
          >
            prioridade
          </button>
          <button
            onClick={() => setOrderBy("status")}
            className={cn(
              "bg-background border border-sidebar-border px-2.5 py-1.5 rounded-md hover:border-sidebar-foreground cursor-pointer transition-colors duration-300",
              orderBy === "status" ? "bg-primary text-white" : "",
            )}
          >
            Status
          </button>
        </div>
      </div>
    </div>
  );
}
