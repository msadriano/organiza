"use client";

import CardsView from "./CardsView";
import { useGetLists } from "@/hooks/useLists";
import FiltersBar from "./FiltersBar";
import CollapsibleGroup from "./CollapsibleGroup";
import { useAppStore } from "@/store/useAppStore";

export interface GroupOption {
  id: string;
  label: string;
  cor: string;
}

export interface GroupByFilterData {
  status: GroupOption[];
  priority: GroupOption[];
  list: GroupOption[];
}

export default function ListView() {
  const { groupBy } = useAppStore();

  const { data: dataLists } = useGetLists();

  const groupByFilter: GroupByFilterData = {
    priority: [
      { id: "LOW", label: "Baixa", cor: "red" },
      { id: "MEDIUM", label: "Média", cor: "yellow" },
      { id: "HIGH", label: "Alta", cor: "gree" },
    ],
    status: [
      { id: "TODO", label: "A fazer", cor: "yellow" },
      { id: "IN_PROGRESS", label: "Em andamento", cor: "blue" },
      { id: "DONE", label: "Concluído", cor: "green" },
    ],
    list:
      dataLists?.map((list) => ({
        id: list.id,
        label: list.title,
        cor: "purple",
      })) ?? [],
  };

  const activeGroup =
    groupBy !== "none"
      ? groupByFilter[groupBy as keyof GroupByFilterData]
      : null;

  return (
    <section className="overflow-hidden min-w-0 space-y-4">
      <FiltersBar />

      {groupBy === "none" ? (
        <CardsView />
      ) : (
        activeGroup?.map((group) => (
          <CollapsibleGroup key={group.id} group={group} />
        ))
      )}
    </section>
  );
}
