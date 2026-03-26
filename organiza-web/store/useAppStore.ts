import { create } from "zustand";
import {
  ActiveView,
  ButtonGroupBy,
  ButtonOrderBy,
  Priority,
  Status,
} from "../types/filters.types";

interface AppStore {
  selectedList: string;
  selectedListTitle: string;
  selectedTask: string;
  activeView: ActiveView;
  createTaskListId: string;
  openCreateTask: boolean;
  openDeleteTask: boolean;
  openDeleteList: boolean;
  groupBy: ButtonGroupBy;
  orderBy: ButtonOrderBy;
  selectedTasks: string[];
  searchWhereFilter: string;
  statusWhereFilter: Status;
  priorityWhereFilter: Priority;
  openChangeStatusDialog: boolean;
  openChangeDueDateDialog: boolean;
  openChangePriorityDialog: boolean;
  openEditTaskSheet: boolean;
  listIdSelectedToDelete: string;
  listTitleSelectedToDelete: string;

  setSelectedList: (id: string) => void;
  setSelectedListTitle: (title: string) => void;
  setSelectedTask: (id: string) => void;
  setActiveView: (name: ActiveView) => void;
  setCreateTaskListId: (name: string) => void;
  setOpenCreateTask: (open: boolean) => void;
  setOpenDeleteTask: (open: boolean) => void;
  setOpenDeleteList: (open: boolean) => void;
  setOrderBy: (value: ButtonOrderBy) => void;
  setGroupBy: (value: ButtonGroupBy) => void;
  setSelectedTasks: (value: string) => void;
  setSelectedTaskIds: (ids: string[]) => void;
  clearSelectedTasks: () => void;
  setSearchWhereFilter: (search: string) => void;
  setStatusWhereFilter: (status: Status) => void;
  setPriorityWhereFilter: (priority: Priority) => void;
  setOpenChangeStatusDialog: (open: boolean) => void;
  setOpenChangeDueDateDialog: (open: boolean) => void;
  setOpenChangePriorityDialog: (open: boolean) => void;
  setOpenEditTaskSheet: (open: boolean) => void;
  setListIdSelectedToDelete: (listId: string) => void;
  setListTitleSelectedToDelete: (listTitle: string) => void;
}

export const useAppStore = create<AppStore>((set) => ({
  selectedList: "all-tasks",
  selectedListTitle: "all-tasks",
  selectedTask: "",
  activeView: "list",
  createTaskListId: "all-tasks",
  openCreateTask: false,
  openDeleteTask: false,
  openDeleteList: false,
  groupBy: "none",
  orderBy: "dueDate",
  view: "list",
  selectedTasks: [],
  searchWhereFilter: "",
  statusWhereFilter: null,
  priorityWhereFilter: null,
  openChangeStatusDialog: false,
  openChangeDueDateDialog: false,
  openChangePriorityDialog: false,
  openEditTaskSheet: false,
  listIdSelectedToDelete: "",
  listTitleSelectedToDelete: "",

  setSelectedList: (id: string) => set({ selectedList: id }),
  setSelectedListTitle: (title: string) => set({ selectedListTitle: title }),
  setSelectedTask: (id: string) => set({ selectedTask: id }),
  setActiveView: (name: ActiveView) => set({ activeView: name }),
  setCreateTaskListId: (id: string) => set({ createTaskListId: id }),
  setOpenCreateTask: (open: boolean) => set({ openCreateTask: open }),
  setOpenDeleteTask: (open: boolean) => set({ openDeleteTask: open }),
  setOpenDeleteList: (open: boolean) => set({ openDeleteList: open }),
  setOrderBy: (value: ButtonOrderBy) => set({ orderBy: value }),
  setGroupBy: (value: ButtonGroupBy) => set({ groupBy: value }),
  setSelectedTaskIds: (ids: string[]) => set({ selectedTasks: ids }),
  clearSelectedTasks: () => set({ selectedTasks: [] }),
  setSearchWhereFilter: (search: string) => set({ searchWhereFilter: search }),
  setStatusWhereFilter: (status: Status) => set({ statusWhereFilter: status }),
  setOpenChangeStatusDialog: (open: boolean) =>
    set({ openChangeStatusDialog: open }),
  setOpenChangeDueDateDialog: (open: boolean) =>
    set({ openChangeDueDateDialog: open }),
  setPriorityWhereFilter: (priority: Priority) =>
    set({ priorityWhereFilter: priority }),
  setOpenChangePriorityDialog: (open: boolean) =>
    set({ openChangePriorityDialog: open }),
  setOpenEditTaskSheet: (open: boolean) => set({ openEditTaskSheet: open }),
  setListIdSelectedToDelete: (listId: string) =>
    set({ listIdSelectedToDelete: listId }),
  setListTitleSelectedToDelete: (listTitle: string) =>
    set({ listTitleSelectedToDelete: listTitle }),
  setSelectedTasks: (value: string) =>
    set((state) => {
      const hasTask = state.selectedTasks.includes(value);

      if (hasTask) {
        return {
          selectedTasks: state.selectedTasks.filter((task) => task != value),
        };
      } else {
        return { selectedTasks: [...state.selectedTasks, value] };
      }
    }),
}));
