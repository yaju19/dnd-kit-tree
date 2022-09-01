import { FlattenedMenuItem, MenuItem } from '@/domain/data'
import { reorder } from './arrayHelpers'

export type DropProjection = Pick<FlattenedMenuItem, 'depth' | 'parentId'>

export type GetDropProjectionParams = {
  activeMenuId: MenuItem['id']
  overId: MenuItem['id']
  flattenedMenus: FlattenedMenuItem[]
  dragOffset: number
  indentWidth: number
}

export function getDropProjection({
  activeMenuId,
  overId,
  flattenedMenus,
  dragOffset,
  indentWidth,
}: GetDropProjectionParams) {
  const activeMenuIndex = flattenedMenus.findIndex(
    ({ id }) => id === activeMenuId
  )
  const overMenuIndex = flattenedMenus.findIndex(({ id }) => id === overId)
  const activeMenu = flattenedMenus[activeMenuIndex]

  const projectedFlattenedMenus = reorder(flattenedMenus, {
    sourceIndex: activeMenuIndex,
    destinationIndex: overMenuIndex,
  })

  const prevMenu = projectedFlattenedMenus[overMenuIndex - 1]
  const nextMenu = projectedFlattenedMenus[overMenuIndex + 1]

  const dragDepth = getDragDepth(dragOffset, indentWidth)
  const projectedDepth = activeMenu.depth + dragDepth
  // console.log(`> dragDepth:`, { projectedDepth, dragDepth })

  const maxDepth = getMaxDepth(prevMenu?.depth)
  const minDepth = getMinDepth(nextMenu?.depth)

  let depth = projectedDepth
  if (projectedDepth > maxDepth) {
    depth = maxDepth
  } else if (projectedDepth < minDepth) {
    depth = minDepth
  }

  const parentId = getParentId({
    depth,
    prevMenu,
    projectedFlattenedMenus,
    overMenuIndex,
  })

  return { depth, parentId }
}

function getDragDepth(dragOffset: number, indentWidth: number): number {
  return Math.round(dragOffset / indentWidth)
}

function getMaxDepth(prevMenuDepth: number | undefined): number {
  return typeof prevMenuDepth !== 'undefined' ? prevMenuDepth + 1 : 0
}

function getMinDepth(nextMenuDepth: number | undefined): number {
  return typeof nextMenuDepth !== 'undefined' ? nextMenuDepth : 0
}

type GetParentIdParams = {
  depth: number
  prevMenu: FlattenedMenuItem
  projectedFlattenedMenus: FlattenedMenuItem[]
  overMenuIndex: number
}

function getParentId({
  depth,
  prevMenu,
  projectedFlattenedMenus,
  overMenuIndex,
}: GetParentIdParams): string | null {
  if (depth === 0 || !prevMenu) {
    return null
  }
  if (depth === prevMenu.depth) {
    return prevMenu.parentId
  }
  if (depth > prevMenu.depth) {
    return prevMenu.id
  }

  // TODO: unknown case, don't know what this does
  console.error(`> unhandled getParentId:`, { depth, prevMenu })

  const newParent = projectedFlattenedMenus
    .slice(0, overMenuIndex)
    .reverse()
    .find((item) => item.depth === depth)?.parentId

  return newParent ?? null
}
