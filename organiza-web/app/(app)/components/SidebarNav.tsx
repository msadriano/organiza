"use client";

import { useGetLists } from "@/hooks/useLists";
import { useAppStore } from "@/store/useAppStore";
import {
  ChevronDown,
  SquareCheckBig,
  ListTodo,
  LayoutList,
  EllipsisVertical,
  Plus,
  Trash2,
} from "lucide-react";
import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
  useSidebar,
} from "@/components/ui/sidebar";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import CreateListDialog from "./CreateListDialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

export default function SidebarNav() {
  const { setOpen, state } = useSidebar();
  const isCollapsed = state === "collapsed";

  const { data: dataLists, isLoading, isError } = useGetLists();
  const {
    selectedList,
    setSelectedListTitle,
    setSelectedList,
    setCreateTaskListId,
    setOpenCreateTask,
    setOpenDeleteList,
    setListIdSelectedToDelete,
    setListTitleSelectedToDelete,
    setGroupBy,
    setOrderBy,
  } = useAppStore();

  if (isLoading)
    return (
      <p className="flex flex-col items-center justify-center w-full h-full">
        Carregando...
      </p>
    );
  if (isError) return <p>Erro ao carregar listas</p>;

  return (
    <TooltipProvider>
      <SidebarGroup>
        <SidebarMenu>
          {/* Item: Todas as tarefas */}
          <SidebarMenuItem>
            <SidebarMenuButton
              size="sm"
              asChild
              isActive={selectedList === "all-tasks"}
              className="hover:bg-sidebar-hover"
            >
              <button
                onClick={() => {
                  setSelectedListTitle("all-tasks");
                  setSelectedList("all-tasks");
                }}
                className="flex items-center justify-start gap-2 w-full cursor-pointer"
              >
                <SquareCheckBig className="h-4 w-4 shrink-0" />
                {!isCollapsed && <span>Todas as tarefas</span>}
              </button>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            {!isCollapsed ? (
              <Collapsible defaultOpen className="w-full">
                <div className="flex items-center gap-2 px-2">
                  <CollapsibleTrigger asChild>
                    <button className="flex items-center flex-1 gap-2 cursor-pointer py-2">
                      <ChevronDown className="h-4 w-4 shrink-0 transition-transform" />
                      <span className="text-sm">Listas</span>
                    </button>
                  </CollapsibleTrigger>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <CreateListDialog />
                    </TooltipTrigger>
                    <TooltipContent side="right">Criar lista</TooltipContent>
                  </Tooltip>
                </div>

                <CollapsibleContent className="mt-1">
                  <SidebarMenuSub>
                    {dataLists?.map((list) => (
                      <SidebarMenuSubItem key={list.id}>
                        <SidebarMenuSubButton
                          size="sm"
                          onClick={() => {
                            setGroupBy("none");
                            setOrderBy("dueDate");
                            setSelectedList(list.id);
                            setSelectedListTitle(list.title);
                          }}
                          className="flex items-center gap-2 w-full cursor-pointer justify-between transition-colors duration-200"
                          isActive={selectedList === list.id}
                        >
                          <button className="flex items-center gap-2 w-full cursor-pointer justify-between">
                            <div className="flex items-center gap-2">
                              <ListTodo className="h-4 w-4 shrink-0" />
                              <span>{list.title}</span>
                            </div>
                            <span
                              className={cn(
                                "text-[10px] border  rounded-sm flex items-center justify-center w-5 h-5 ",
                                selectedList === list.id
                                  ? "bg-transparent border-[#4a186c] text-[#4a186c]"
                                  : "opacity-20",
                              )}
                            >
                              {list.countTasks}
                            </span>
                          </button>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <button
                                type="button"
                                className="inline-flex items-center justify-center rounded-sm p-1 hover:bg-sidebar-accent cursor-pointer"
                                onClick={(e) => e.stopPropagation()}
                                aria-label="Ações da lista"
                              >
                                <EllipsisVertical className="h-4 w-4 text-[#4a186c]" />
                              </button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent
                              className="min-w-44"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <DropdownMenuItem
                                className="cursor-pointer gap-2"
                                onClick={(e) => {
                                  setListIdSelectedToDelete(list.id);
                                  setListTitleSelectedToDelete(list.title);
                                  setOpenDeleteList(true);
                                }}
                              >
                                <Trash2 size={13} />
                                <span>Apagar Lista</span>
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                className="cursor-pointer gap-2"
                                onClick={() => {
                                  setCreateTaskListId(list.id);
                                  setOpenCreateTask(true);
                                }}
                              >
                                <Plus size={13} />
                                <span>Nova Tarefa</span>
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    ))}
                  </SidebarMenuSub>
                </CollapsibleContent>
              </Collapsible>
            ) : (
              // Modo Colapsado: LayoutList (clicável)
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    onClick={() => setOpen(true)}
                    className="flex items-center justify-center cursor-pointer w-full py-2 rounded-md hover:bg-sidebar-accent"
                  >
                    <LayoutList className="h-4 w-4 shrink-0" />
                  </button>
                </TooltipTrigger>
                <TooltipContent side="right">Listas</TooltipContent>
              </Tooltip>
            )}
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarGroup>
    </TooltipProvider>
  );
}
