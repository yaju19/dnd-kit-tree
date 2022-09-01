import { useDroppable } from '@dnd-kit/core'
import { ReactNode } from 'react'
import { cx } from '@/utils/cx'

type DroppableUlProps = {
  id: string
  // childrenFn: () => JSX.Element
  children: ReactNode
  isDropDisabled?: boolean
}

export function DroppableUl(props: DroppableUlProps) {
  const { id, isDropDisabled, children } = props
  const droppableResult = useDroppable({
    id,
    disabled: isDropDisabled,
  })
  const { setNodeRef, isOver, active, rect } = droppableResult
  console.log(`> useDroppable:`, droppableResult)

  return (
    <ul
      className={cx(
        'space-y-2 rounded transition-colors',
        isOver && 'bg-purple-100'
      )}
      ref={setNodeRef}
    >
      {children}
    </ul>
  )
}
