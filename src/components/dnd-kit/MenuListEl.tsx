import { DragOverlay } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { useMemo } from 'react'
import { createPortal } from 'react-dom'
import { FlattenedMenuItem, MenuItem } from '@/domain/data'
import { DropProjection } from '@/utils/dnd'
import { getChildCount } from '@/utils/tree'
import SortableMenuItem from './SortableMenuItem'

export type MenuListElProps = {
  flattenedMenus: FlattenedMenuItem[]
  projected: DropProjection | null
  activeMenuId: string | null
  indentWidth: number
  // to count children when dragging
  menus: MenuItem[]
}

const MenuListEl = (props: MenuListElProps): JSX.Element => {
  const { flattenedMenus, activeMenuId, projected, indentWidth, menus } = props

  const sortedIds = useMemo(
    () => flattenedMenus.map((menu) => menu.id),
    [flattenedMenus]
  )

  const activeMenuItem = activeMenuId
    ? flattenedMenus.find(({ id }) => id === activeMenuId)
    : undefined

  return (
    <SortableContext items={sortedIds} strategy={verticalListSortingStrategy}>
      <div className="space-y-2 rounded p-4">
        {flattenedMenus.map((menu) => {
          const isActive = menu.id === activeMenuId

          return (
            <SortableMenuItem
              key={menu.id}
              id={menu.id}
              // value={menu.id}
              depth={isActive && projected ? projected.depth : menu.depth}
              title={menu.title}
              menuType={menu.type}
              indentWidth={indentWidth}
            />
          )
        })}
      </div>
      {createPortal(
        <DragOverlay>
          {activeMenuId && activeMenuItem && (
            <SortableMenuItem
              isClone
              id={activeMenuId}
              depth={activeMenuItem.depth}
              title={activeMenuItem.title}
              menuType={activeMenuItem.type}
              indentWidth={indentWidth}
              // + 1 to include the active menu item
              childCount={getChildCount(menus, activeMenuId) + 1}
            />
          )}
        </DragOverlay>,
        document.body
      )}
    </SortableContext>
  )
}

export default MenuListEl
