export interface List {
    id: string
    userId: string
    title: string
    color: string
    createdAt: Date
    updatedAt: Date | null
}

export interface ListOverview extends List{
    countTasks: number
}