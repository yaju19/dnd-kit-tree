import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { CSSProperties } from 'react'
import MenuItemEl, { MenuItemElProps } from './MenuItemEl'

export type SortableMenuItemProps = Omit<
  MenuItemElProps,
  'draggingStyle' | 'dragHandleProps' | 'dragHandleRef' | 'ref'
> & {
  id: string
}

const SortableMenuItem = (props: SortableMenuItemProps): JSX.Element => {
  const { id, depth, ...restProps } = props

  const {
    attributes,
    isDragging,
    isSorting,
    listeners,
    transform,
    transition,
    setDraggableNodeRef,
    setDroppableNodeRef,
  } = useSortable({ id })

  const style: CSSProperties = {
    transform: CSS.Translate.toString(transform),
    transition,
  }

  return (
    <MenuItemEl
      ref={setDroppableNodeRef}
      dragHandleRef={setDraggableNodeRef}
      draggingStyle={style}
      depth={depth}
      isIndicator={isDragging}
      disableInteraction={isSorting}
      dragHandleProps={{ ...attributes, ...listeners }}
      {...restProps}
    />
  )
}

export default SortableMenuItem
