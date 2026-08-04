"use client";

import {
  closestCorners,
  DndContext,
  type DragEndEvent,
  type DragOverEvent,
  DragOverlay,
  type DragStartEvent,
  KeyboardSensor,
  PointerSensor,
  useDroppable,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useEffect, useMemo, useState } from "react";
import { LeadBoardCard } from "@/components/leads/lead-board-card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { LeadCard, LeadColumnMeta } from "@/types/lead";

function columnDroppableId(columnId: string) {
  return `column:${columnId}`;
}

function parseColumnId(droppableId: string): string | null {
  return droppableId.startsWith("column:")
    ? droppableId.slice("column:".length)
    : null;
}

function findContainer(
  items: Record<string, string[]>,
  id: string,
): string | undefined {
  if (id in items) return id;
  const fromColumn = parseColumnId(id);
  if (fromColumn && fromColumn in items) return fromColumn;
  return Object.keys(items).find((key) => items[key]?.includes(id));
}

interface LeadKanbanBoardProps {
  columns: LeadColumnMeta[];
  leadsByColumn: Map<string, LeadCard[]>;
  disabled?: boolean;
  onMoveLead: (leadId: string, columnId: string) => void;
}

export function LeadKanbanBoard({
  columns,
  leadsByColumn,
  disabled = false,
  onMoveLead,
}: LeadKanbanBoardProps) {
  const leadById = useMemo(() => {
    const map = new Map<string, LeadCard>();
    for (const list of leadsByColumn.values()) {
      for (const lead of list) map.set(lead.id, lead);
    }
    return map;
  }, [leadsByColumn]);

  const [items, setItems] = useState<Record<string, string[]>>(() =>
    Object.fromEntries(
      columns.map((column) => [
        column.id,
        (leadsByColumn.get(column.id) ?? []).map((lead) => lead.id),
      ]),
    ),
  );
  const [activeId, setActiveId] = useState<string | null>(null);

  useEffect(() => {
    setItems(
      Object.fromEntries(
        columns.map((column) => [
          column.id,
          (leadsByColumn.get(column.id) ?? []).map((lead) => lead.id),
        ]),
      ),
    );
  }, [columns, leadsByColumn]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 6 },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const activeLead = activeId ? (leadById.get(activeId) ?? null) : null;

  function handleDragStart(event: DragStartEvent) {
    if (disabled) return;
    setActiveId(String(event.active.id));
  }

  function handleDragOver(event: DragOverEvent) {
    if (disabled) return;
    const { active, over } = event;
    if (!over) return;

    const activeContainer = findContainer(items, String(active.id));
    const overContainer = findContainer(items, String(over.id));
    if (!activeContainer || !overContainer) return;
    if (activeContainer === overContainer) return;

    setItems((current) => {
      const activeItems = current[activeContainer] ?? [];
      const overItems = current[overContainer] ?? [];
      const activeIndex = activeItems.indexOf(String(active.id));
      if (activeIndex < 0) return current;

      const overColumnId = parseColumnId(String(over.id));
      const overIndex = overColumnId
        ? overItems.length
        : overItems.indexOf(String(over.id));

      let newIndex: number;
      if (overColumnId) {
        newIndex = overItems.length + 1;
      } else {
        const isBelowOverItem =
          over &&
          active.rect.current.translated &&
          active.rect.current.translated.top > over.rect.top + over.rect.height;
        const modifier = isBelowOverItem ? 1 : 0;
        newIndex = overIndex >= 0 ? overIndex + modifier : overItems.length + 1;
      }

      return {
        ...current,
        [activeContainer]: activeItems.filter((id) => id !== String(active.id)),
        [overContainer]: [
          ...overItems.slice(0, newIndex),
          String(active.id),
          ...overItems.slice(newIndex),
        ],
      };
    });
  }

  function handleDragEnd(event: DragEndEvent) {
    if (disabled) {
      setActiveId(null);
      return;
    }

    const { active, over } = event;
    const activeContainer = findContainer(items, String(active.id));
    setActiveId(null);

    if (!over || !activeContainer) return;

    const overContainer = findContainer(items, String(over.id));
    if (!overContainer) return;

    if (activeContainer === overContainer) {
      const columnItems = items[activeContainer] ?? [];
      const oldIndex = columnItems.indexOf(String(active.id));
      const newIndex = columnItems.indexOf(String(over.id));
      if (oldIndex >= 0 && newIndex >= 0 && oldIndex !== newIndex) {
        setItems((current) => ({
          ...current,
          [activeContainer]: arrayMove(
            current[activeContainer] ?? [],
            oldIndex,
            newIndex,
          ),
        }));
      }
      return;
    }

    onMoveLead(String(active.id), overContainer);
  }

  function handleDragCancel() {
    setActiveId(null);
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
      onDragCancel={handleDragCancel}
    >
      <div className="flex gap-3 overflow-x-auto pb-1">
        {columns.map((column) => (
          <LeadKanbanColumn
            key={column.id}
            column={column}
            leadIds={items[column.id] ?? []}
            leadById={leadById}
            disabled={disabled}
            isDropHighlight={
              Boolean(activeId) &&
              findContainer(items, activeId ?? "") === column.id
            }
          />
        ))}
      </div>

      <DragOverlay dropAnimation={{ duration: 180, easing: "ease" }}>
        {activeLead ? (
          <div className="w-[min(100%,16.5rem)] rotate-1 scale-[1.02] shadow-xl">
            <LeadBoardCard lead={activeLead} draggable={false} />
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}

interface LeadKanbanColumnProps {
  column: LeadColumnMeta;
  leadIds: string[];
  leadById: Map<string, LeadCard>;
  disabled?: boolean;
  isDropHighlight?: boolean;
}

function LeadKanbanColumn({
  column,
  leadIds,
  leadById,
  disabled = false,
  isDropHighlight = false,
}: LeadKanbanColumnProps) {
  const { setNodeRef, isOver } = useDroppable({
    id: columnDroppableId(column.id),
    disabled,
    data: { type: "column", columnId: column.id },
  });

  return (
    <section
      className={cn(
        "flex min-h-[28rem] w-[min(100%,18rem)] shrink-0 flex-col rounded-2xl border border-border/70 bg-muted/25 transition-[border-color,background-color,box-shadow]",
        (isOver || isDropHighlight) &&
          "border-primary/45 bg-primary/[0.07] shadow-[inset_0_0_0_1px_color-mix(in_srgb,var(--primary)_25%,transparent)]",
      )}
    >
      <header className="flex items-start justify-between gap-2 border-b border-border/60 px-3 py-3">
        <div className="min-w-0">
          <p className="truncate font-semibold text-sm">{column.label}</p>
          {column.description ? (
            <p className="mt-0.5 truncate text-xs text-muted-foreground">
              {column.description}
            </p>
          ) : null}
        </div>
        <Badge variant="secondary" className="tabular-nums">
          {leadIds.length}
        </Badge>
      </header>

      <SortableContext
        id={column.id}
        items={leadIds}
        strategy={verticalListSortingStrategy}
        disabled={disabled}
      >
        <div
          ref={setNodeRef}
          className="flex min-h-0 flex-1 flex-col gap-2 overflow-y-auto p-2.5"
        >
          {leadIds.length === 0 ? (
            <div className="flex flex-1 flex-col items-center justify-center gap-1 rounded-xl border border-dashed border-border/70 px-3 py-10 text-center">
              <p className="text-xs font-medium text-muted-foreground">
                Empty column
              </p>
              <p className="text-[11px] text-muted-foreground/80">
                Drop a lead here to move stage or owner
              </p>
            </div>
          ) : (
            leadIds.map((leadId) => {
              const lead = leadById.get(leadId);
              if (!lead) return null;
              return (
                <LeadKanbanCard key={lead.id} lead={lead} disabled={disabled} />
              );
            })
          )}
        </div>
      </SortableContext>
    </section>
  );
}

interface LeadKanbanCardProps {
  lead: LeadCard;
  disabled?: boolean;
}

function LeadKanbanCard({ lead, disabled = false }: LeadKanbanCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: lead.id,
    disabled,
    data: { type: "lead", lead },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "touch-none",
        isDragging && "opacity-30",
        disabled && "cursor-not-allowed opacity-70",
      )}
      {...attributes}
      {...listeners}
    >
      <LeadBoardCard lead={lead} draggable={false} />
    </div>
  );
}
