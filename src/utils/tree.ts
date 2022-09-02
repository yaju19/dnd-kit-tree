import { FlattenedMenuItem, MenuItem } from '@/domain/data'

function flatten(
  items: MenuItem[],
  parentId: FlattenedMenuItem['parentId'] = null,
  depth = 0
) {
  return items.reduce<FlattenedMenuItem[]>((acc, item, index) => {
    acc.push({ ...item, parentId, depth, index })

    if (Array.isArray(item.children) && item.children.length > 0) {
      // inject multiple items
      acc.push(...flatten(item.children, item.id, depth + 1))
    }

    return acc
  }, [])
}

export function flattenTree(tree: MenuItem[]): FlattenedMenuItem[] {
  return flatten(tree)
}

export function removeChildrenOf(
  flattenedMenus: FlattenedMenuItem[],
  ids: FlattenedMenuItem['id'][]
): FlattenedMenuItem[] {
  const excludeParentIds = [...ids]

  return flattenedMenus.filter(({ id, parentId, children }) => {
    if (parentId && excludeParentIds.includes(parentId)) {
      if (Array.isArray(children) && children.length) {
        excludeParentIds.push(id)
      }
      return false
    }

    return true
  })
}

export function buildTree(flattenedMenus: FlattenedMenuItem[]): MenuItem[] {
  const root: Omit<MenuItem, 'children'> & { children: MenuItem[] } = {
    id: 'root',
    title: 'root',
    type: 'section',
    children: [],
  }
  // console.log('flattened menus', flattenedMenus)
  const keyedMenus: Record<string, MenuItem> = { [root.id]: root }
  // console.log('keyed menus', keyedMenus)

  const items = flattenedMenus.map((item) => ({ ...item, children: [] }))

  for (const flattenedMenu of items) {
    const parentId = flattenedMenu.parentId ?? root.id
    // console.log('parent id', parentId)
    // need to find the parent menu because children of active menu might be above it(it says in the previous position at the moment)
    const parent =
      keyedMenus[parentId] ?? items.find(({ id }) => id === parentId)
    // console.log('parent', parent)

    keyedMenus[flattenedMenu.id] = flattenedMenuToMenu(flattenedMenu)
    const currentMenu = keyedMenus[flattenedMenu.id]

    if (!Array.isArray(parent?.children)) {
      parent.children = []
    }
    // console.log('parentId', parentId)
    parent.children.push(currentMenu)
  }

  return root.children
}

export function flattenedMenuToMenu(
  flattenedMenu: FlattenedMenuItem
): MenuItem {
  return {
    id: flattenedMenu.id,
    title: flattenedMenu.title,
    type: flattenedMenu.type,
    children: flattenedMenu.children,
  }
}

export function getChildCount(menus: MenuItem[], id: MenuItem['id']): number {
  const menu = findMenuDeep(menus, id)
  return menu && Array.isArray(menu.children) ? countChildren(menu.children) : 0
}

function countChildren(menus: MenuItem[]): number {
  return menus.reduce((acc, { children }) => {
    if (Array.isArray(children) && children.length) {
      // add this children and their children
      return acc + 1 + countChildren(children)
    }
    // add this children
    return acc + 1
  }, 0)
}

function findMenuDeep(
  menus: MenuItem[],
  menuId: MenuItem['id']
): MenuItem | null {
  const menu = menus.find((menu) => menu.id === menuId)
  if (menu) return menu

  for (const menu of menus) {
    if (!menu.children) continue
    const found = findMenuDeep(menu.children, menuId)

    if (found) return found
  }

  return null
}
