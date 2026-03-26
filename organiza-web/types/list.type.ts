export interface List {
  id: string;
  title: string;
  color?: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export interface ListOverview extends List {
  countTasks: number;
}
