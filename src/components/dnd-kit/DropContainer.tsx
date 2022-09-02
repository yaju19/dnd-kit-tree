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
    // console.log('event', event.delta)
    // console.log(`> MOVE:`, event)
    // Save delta in x axis to determine projected depth
    setOffsetLeft(event.delta.x)
  }

  const handleDragOver = (event: DragOverEvent) => {
    // console.log(`> OVER:`, event.over)
    setOverId(event.over?.id ?? null)
  }

  const handleDragEnd = ({ active, over, ...rest }: DragEndEvent) => {
    resetState()
    console.log('event', active, over, rest)
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

      if (activeMenu.type === 'block') {
        // block cannot be a child of root
        if (!parentId) return
        const parentMenuIndex = clonedFlattenMenus.findIndex(
          ({ id }) => id === parentId
        )
        // if a block with a children cannot have parent as block
        const parentMenu = clonedFlattenMenus[parentMenuIndex]
        if (parentMenu.type === 'block') {
          const grandParentId = parentMenu.parentId
          // grandparent of a block cannot be a block
          if (grandParentId) {
            const grandParenIndex = clonedFlattenMenus.findIndex(
              ({ id }) => id === grandParentId
            )
            const grandParentMenu = clonedFlattenMenus[grandParenIndex]
            if (grandParentMenu.type === 'block') return
          }
          // a block with a children cannot have another block as a parent
          if (activeMenu.children?.length) return
        }
        const siblings = parentMenu.children
        // block cannot be a child of a section whose child is subsection
        if (siblings?.some((item) => item.type === 'sub-section')) return
      }

      if (activeMenu.type === 'sub-section') {
        // sub-section cannot be a child of root
        if (!parentId) return

        const parentMenuIndex = clonedFlattenMenus.findIndex(
          ({ id }) => id === parentId
        )
        const parentMenu = clonedFlattenMenus[parentMenuIndex]
        // sub section cannot be a child of block
        if (parentMenu.type === 'block') return
        // section cannot be the child of sub-section
        if (parentMenu.type === 'sub-section') return
        // sub section cannot be a child of a section whose child is block
        const siblings = parentMenu.children
        if (siblings?.some((item) => item.type === 'block')) return
      }

      if (activeMenu.type === 'section') {
        if (parentId) {
          const parentMenuIndex = clonedFlattenMenus.findIndex(
            ({ id }) => id === parentId
          )
          const parentMenu = clonedFlattenMenus[parentMenuIndex]
          // section cannot be the child of a block
          // section cannot be a child of section
          // section cannot be a child of sub-section
          if (
            parentMenu.type === 'sub-section' ||
            parentMenu.type === 'block' ||
            parentMenu.type === 'section'
          )
            return
        }
      }

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
