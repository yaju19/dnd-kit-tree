// import { customAlphabet, urlAlphabet } from 'nanoid'

// const nanoid = customAlphabet(urlAlphabet.replace(/_/, ''))

export type MenuItemType = 'module' | 'link'
export type MenuItem = {
  id: string
  title: string
  type: MenuItemType
  children?: MenuItem[]
}

export type FlattenedMenuItem = MenuItem & {
  parentId: string | null
  depth: number
  index: number
}

export const menus: MenuItem[] = [
  {
    id: 'id-logo',
    title: 'Logo',
    type: 'module',
  },
  {
    id: 'id-activities',
    title: 'Activities',
    type: 'link',
    children: [
      {
        id: 'id-men',
        title: 'Men',
        type: 'link',
      },
      {
        id: 'id-women',
        title: 'Women',
        type: 'link',
      },
    ],
  },
  {
    id: 'id-kids',
    title: 'Kids',
    type: 'link',
  },
  {
    id: 'id-about',
    title: 'About',
    type: 'link',
  },
  {
    id: 'id-cart',
    title: 'Cart',
    type: 'module',
  },
  {
    id: 'id-language-switcher',
    title: 'Language Switcher',
    type: 'module',
  },
  {
    id: 'id-currency-switcher',
    title: 'Currency Switcher',
    type: 'module',
  },
]

// export type MenuState = {
//   ids: MenuItem['id'][]
//   items: Record<MenuItem['id'], MenuItem>
// }

// export const menuData: MenuState = {
//   ids: menus.map((menu) => menu.id),
//   items: Object.fromEntries(menus.map((menu) => [menu.id, menu])),
// }
