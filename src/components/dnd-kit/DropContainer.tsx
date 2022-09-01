import {
  closestCenter,
  DndContext,
  DragEndEvent,
  DragMoveEvent,
  DragOverEvent,
  DragStartEvent,
  MeasuringStrategy,
} from '@dnd-kit/core'
import { Dispatch, SetStateAction, useMemo, useState } from 'react'
import { FlattenedMenuItem, MenuItem } from '@/domain/data'
import { reorder } from '@/utils/arrayHelpers'
import { getDropProjection } from '@/utils/dnd'
import { buildTree, flattenTree, removeChildrenOf } from '@/utils/tree'
import MenuListEl from './MenuListEl'

export type DropContainerProps = {
  menus: MenuItem[]
  setMenus: Dispatch<SetStateAction<MenuItem[]>>
}

const measuring = {
  droppable: {
    strategy: MeasuringStrategy.Always,
  },
}

const INDENT_WIDTH = 48

const DropContainer = (props: DropContainerProps): JSX.Element => {
  const { menus, setMenus } = props

  const [activeMenuId, setActiveMenuId] = useState<string | null>(null)
  const [overId, setOverId] = useState<string | null>(null)
  const [offsetLeft, setOffsetLeft] = useState(0)

  const resetState = () => {
    setActiveMenuId(null)
    setOverId(null)
    setOffsetLeft(0)
  }

  const flattenedMenus = useMemo(() => {
    const flattenedTree = flattenTree(menus)

    // Hide children of the active menu to prevent dragging below its own children
    if (activeMenuId) {
      return removeChildrenOf(flattenedTree, [activeMenuId])
    }

    return flattenedTree
  }, [activeMenuId, menus])

  const projected =
    activeMenuId && overId
      ? getDropProjection({
          activeMenuId,
          overId,
          dragOffset: offsetLeft,
          flattenedMenus,
          indentWidth: INDENT_WIDTH,
        })
      : null

  const handleDragStart = (event: DragStartEvent) => {
    const activeId = event.active.id

    setActiveMenuId(activeId)
    setOverId(activeId)
  }

  const handleDragMove = (event: DragMoveEvent) => {
    // console.log(`> MOVE:`, event)
    // Save delta in x axis to determine projected depth
    setOffsetLeft(event.delta.x)
  }

  const handleDragOver = (event: DragOverEvent) => {
    // console.log(`> OVER:`, event.over)
    setOverId(event.over?.id ?? null)
  }

  const handleDragEnd = ({ active, over }: DragEndEvent) => {
    resetState()

    if (projected && over) {
      const { depth, parentId } = projected

      // need to clone and re-flatten the flattenedMenus is not a complete tree,
      // the children of the active menu was removed before.
      const clonedFlattenMenus: FlattenedMenuItem[] = JSON.parse(
        JSON.stringify(flattenTree(menus))
      )
      const overMenuIndex = clonedFlattenMenus.findIndex(
        ({ id }) => id === over.id
      )
      const activeMenuIndex = clonedFlattenMenus.findIndex(
        ({ id }) => id === active.id
      )

      const activeMenu = clonedFlattenMenus[activeMenuIndex]
      const updatedFlattenedMenus = reorder(clonedFlattenMenus, {
        sourceIndex: activeMenuIndex,
        destinationIndex: overMenuIndex,
      })
      // update property of the active menu
      const newActiveMenuIndex = overMenuIndex
      updatedFlattenedMenus[newActiveMenuIndex] = {
        ...activeMenu,
        depth,
        parentId,
      }

      const newMenus = buildTree(updatedFlattenedMenus)

      setMenus(newMenus)
    }
  }
  return (
    <DndContext
      measuring={measuring}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragMove={handleDragMove}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      <MenuListEl
        menus={menus}
        flattenedMenus={flattenedMenus}
        projected={projected}
        activeMenuId={activeMenuId}
        indentWidth={INDENT_WIDTH}
      />
    </DndContext>
  )
}

export default DropContainer
