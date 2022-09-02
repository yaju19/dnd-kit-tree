// import { customAlphabet, urlAlphabet } from 'nanoid'

// const nanoid = customAlphabet(urlAlphabet.replace(/_/, ''))

export type MenuItemType = 'section' | 'sub-section' | 'block'
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
    id: 'id-section-a',
    title: 'Section A',
    type: 'section',
    children: [
      {
        id: 'id-dialouge-card',
        title: 'Dialouge Card Block',
        type: 'block',
      },
      {
        id: 'id-text-block',
        title: 'Text Block',
        type: 'block',
      },
    ],
  },
  {
    id: 'id-section-b',
    title: 'Section B',
    type: 'section',
    children: [
      {
        id: 'id-sub_section-1',
        title: 'Sub Section 1',
        type: 'sub-section',
      },
      {
        id: 'id-sub_section-2',
        title: 'Sub Section 2',
        type: 'sub-section',
      },
    ],
  },
  {
    id: 'id-section-c',
    title: 'Section C',
    type: 'section',
    children: [
      {
        id: 'id-image-slider',
        title: 'Image Slider Block',
        type: 'block',
      },
      {
        id: 'id-mcq-block',
        title: 'MCQ Block',
        type: 'block',
      },
    ],
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
