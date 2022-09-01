import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { ReactNode } from 'react'

type DraggableLiChildrenProvided = {
  isDragging: boolean
  draggingOver: string | undefined
  dragHandleProps: Record<string, unknown>
}

type DraggableLiProps = {
  id: string
  children: (provided: DraggableLiChildrenProvided) => ReactNode
}

export function DraggableLi(props: DraggableLiProps) {
  const { id, children } = props
  const draggableResult = useSortable({ id })

  const {
    setNodeRef,
    listeners,
    attributes,
    transform,
    transition,
    isDragging,
  } = draggableResult

  const style = transform
    ? {
        // transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
        transform: CSS.Transform.toString(transform),
        transition,
        zIndex: isDragging ? 100 : undefined,
      }
    : undefined

  console.log(`> draggable-${id}:`, { ...draggableResult, style })

  return (
    /* position: "relative" is essential to make z-index work */
    <li ref={setNodeRef} className="relative" style={style}>
      {children({
        isDragging,
        draggingOver: draggableResult.over?.id,
        dragHandleProps: { ...listeners, ...attributes },
      })}
    </li>
  )
}
