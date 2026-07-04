"use client"

import { useEffect, useMemo, useState, useTransition } from "react"
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
  useDraggable,
  useDroppable,
  type DragEndEvent,
  type DragStartEvent,
} from "@dnd-kit/core"
import { cn } from "@/lib/utils"

export type KanbanColumn<S extends string> = {
  id: S
  label: string
  accent: string
}

export type KanbanBoardProps<T extends { id: string; status: S }, S extends string> = {
  items: T[]
  columns: KanbanColumn<S>[]
  onMove: (id: string, status: S) => Promise<void>
  renderCard: (item: T) => React.ReactNode
  emptyLabel?: string
}

export function KanbanBoard<T extends { id: string; status: S }, S extends string>({
  items,
  columns,
  onMove,
  renderCard,
  emptyLabel = "Bu sütunda öğe yok",
}: KanbanBoardProps<T, S>) {
  const [localItems, setLocalItems] = useState(items)
  const [activeId, setActiveId] = useState<string | null>(null)
  const [, startTransition] = useTransition()

  useEffect(() => {
    setLocalItems(items)
  }, [items])

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 6 } }))

  const grouped = useMemo(() => {
    const map = new Map<S, T[]>()
    for (const c of columns) map.set(c.id, [])
    for (const it of localItems) {
      const arr = map.get(it.status)
      if (arr) arr.push(it)
    }
    return map
  }, [localItems, columns])

  const activeItem = activeId ? localItems.find((i) => i.id === activeId) : null

  function handleDragStart(e: DragStartEvent) {
    setActiveId(String(e.active.id))
  }

  function handleDragEnd(e: DragEndEvent) {
    setActiveId(null)
    const id = String(e.active.id)
    const overId = e.over?.id ? String(e.over.id) : null
    if (!overId) return

    const targetStatus = columns.find((c) => c.id === overId)?.id
    if (!targetStatus) return

    const current = localItems.find((i) => i.id === id)
    if (!current || current.status === targetStatus) return

    // Optimistic update
    setLocalItems((prev) => prev.map((i) => (i.id === id ? { ...i, status: targetStatus } : i)))

    startTransition(async () => {
      try {
        await onMove(id, targetStatus)
      } catch {
        // Revert on error
        setLocalItems((prev) => prev.map((i) => (i.id === id ? { ...i, status: current.status } : i)))
      }
    })
  }

  return (
    <DndContext id="kanban-dnd" sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      <div className="flex gap-3 overflow-x-auto pb-2">
        {columns.map((col) => (
          <KanbanColumnView
            key={col.id}
            column={col}
            items={grouped.get(col.id) || []}
            renderCard={renderCard}
            emptyLabel={emptyLabel}
          />
        ))}
      </div>
      <DragOverlay>
        {activeItem ? (
          <div className="rotate-1 opacity-90">{renderCard(activeItem)}</div>
        ) : null}
      </DragOverlay>
    </DndContext>
  )
}

function KanbanColumnView<T extends { id: string }, S extends string>({
  column,
  items,
  renderCard,
  emptyLabel,
}: {
  column: KanbanColumn<S>
  items: T[]
  renderCard: (item: T) => React.ReactNode
  emptyLabel: string
}) {
  const { setNodeRef, isOver } = useDroppable({ id: column.id })

  return (
    <div className="flex w-72 shrink-0 flex-col rounded-lg bg-muted/40">
      <div className={cn("flex items-center justify-between gap-2 border-b border-border/60 px-3 py-2")}>
        <div className="flex items-center gap-2">
          <span className={cn("size-2 rounded-full", column.accent)} />
          <span className="text-sm font-semibold">{column.label}</span>
        </div>
        <span className="rounded-full bg-background px-2 py-0.5 text-xs font-medium text-muted-foreground">
          {items.length}
        </span>
      </div>
      <div
        ref={setNodeRef}
        className={cn(
          "flex min-h-24 flex-col gap-2 p-2 transition-colors",
          isOver && "bg-primary/5 ring-1 ring-inset ring-primary/30"
        )}
      >
        {items.length === 0 ? (
          <p className="px-2 py-6 text-center text-xs text-muted-foreground/70">{emptyLabel}</p>
        ) : (
          items.map((item) => (
            <KanbanCard key={item.id} id={item.id}>
              {renderCard(item)}
            </KanbanCard>
          ))
        )}
      </div>
    </div>
  )
}

function KanbanCard({ id, children }: { id: string; children: React.ReactNode }) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({ id })
  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      className={cn(
        "cursor-grab touch-none active:cursor-grabbing",
        isDragging && "opacity-40"
      )}
    >
      {children}
    </div>
  )
}
