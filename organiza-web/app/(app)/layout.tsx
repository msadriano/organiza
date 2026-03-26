import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import AppSidebar from "./components/AppSidebar";
import ChangeTaskDueDateDialog from "./components/ChangeTaskDueDateDialog";
import ChangeTaskPriorityDialog from "./components/ChangeTaskPriorityDialog";
import ChangeTaskStatusDialog from "./components/ChangeTaskStatusDialog";
import Header from "./components/Header";
import CreateTaskDialogWrapper from "./components/CreateTaskDialogWrapper";
import DeleteListDialogWrapper from "./components/DeleteListDialogWrapper";
import DeleteTaskDialog from "./components/DeleteTaskDialog";
import EditTaskSheet from "./components/EditTaskSheet";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <Header />
        <CreateTaskDialogWrapper />
        <ChangeTaskDueDateDialog />
        <ChangeTaskStatusDialog />
        <ChangeTaskPriorityDialog />
        <EditTaskSheet />
        <DeleteListDialogWrapper />
        <DeleteTaskDialog />
        {children}
      </SidebarInset>
    </SidebarProvider>
  );
}
