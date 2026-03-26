"use client";

import { useState } from "react";
import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
} from "@/components/ui/collapsible";
import CardsView from "./CardsView";
import { ChevronDown } from "lucide-react";
import { GroupOption } from "./ListView";

interface CollapsibleGroupProps {
  group: GroupOption;
}

export default function CollapsibleGroup({ group }: CollapsibleGroupProps) {
  const [open, setOpen] = useState(true);

  return (
    <Collapsible
      className="bg-surface p-3 rounded-md border border-sidebar-border shadow"
      open={open}
      onOpenChange={setOpen}
    >
      <CollapsibleTrigger className="flex flex-row items-center justify-between w-full bg-surface p-2 rounded-md text-sm font-bold cursor-pointer ">
        {group.label}
        <ChevronDown />
      </CollapsibleTrigger>
      <CollapsibleContent className="overflow-hidden data-[state=open]:animate-[collapsible-down_0.1s_ease-out] data-[state=closed]:animate-[collapsible-up_0.1s_ease-out]">
        <CardsView groupValue={group.id} />
      </CollapsibleContent>
    </Collapsible>
  );
}
