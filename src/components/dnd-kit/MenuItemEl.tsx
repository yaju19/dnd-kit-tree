import { DragHandleIcon } from '@chakra-ui/icons'
import {
  DocumentIcon,
  FolderIcon,
  ServerStackIcon,
} from '@heroicons/react/24/outline'
import { CSSProperties, forwardRef, Ref } from 'react'
import { MenuItem } from '@/domain/data'
import { cx } from '@/utils/cx'

export type MenuItemElProps = {
  menuType: MenuItem['type']
  title: string
  depth: number
  indentWidth: number
  draggingStyle?: CSSProperties
  dragHandleProps: Record<string | number | symbol, unknown> | undefined
  dragHandleRef?: Ref<HTMLDivElement>
  disableInteraction?: boolean
  isClone?: boolean
  isIndicator?: boolean
  childCount?: number
}

// const levelColor = [
//   // no line for the first level
//   undefined,
//   'bg-purple-500',
//   'bg-purple-400',
//   'bg-purple-300',
//   'bg-purple-200',
// ]
// const defaultLevelColor = 'bg-purple-200'

const MenuItemEl = forwardRef<HTMLDivElement, MenuItemElProps>(
  (props, ref): JSX.Element => {
    const {
      title,
      menuType,
      depth,
      indentWidth,
      draggingStyle,
      isIndicator,
      dragHandleProps,
      dragHandleRef,
      disableInteraction,
      isClone,
      childCount,
    } = props

    const wrapperStyle = !isClone
      ? { paddingLeft: indentWidth * depth }
      : undefined

    return (
      <div
        ref={ref}
        // style={wrapperStyle}
        style={{
          ...draggingStyle,
          ...wrapperStyle,
        }}
        className={cx(
          'relative',
          disableInteraction && 'pointer-events-none',
          isClone && 'inline-block'
        )}
      >
        <div
          className={cx(
            'relative transition-all',
            !isClone && !isIndicator && 'bg-gray-200',
            isClone && 'bg-white shadow-xl',
            !isIndicator && 'rounded py-2 px-4',
            isIndicator &&
              'h-2 rounded-sm border border-purple-500 bg-purple-400 p-0'
          )}
        >
          {isIndicator && (
            <div className="absolute top-1/2 left-0 h-3 w-3 -translate-y-1/2 -translate-x-1/2 rounded-full border border-purple-500 bg-white" />
          )}
          <div
            className={cx(
              'flex items-center gap-4',
              isIndicator && 'h-0 opacity-0'
            )}
          >
            <div
              className="flex items-center text-sm"
              {...dragHandleProps}
              ref={dragHandleRef}
            >
              <DragHandleIcon />
            </div>
            <MenuIcon type={menuType} />
            <div
              className={cx('grow whitespace-nowrap', isClone && 'select-none')}
            >
              {title}
            </div>
          </div>
          {isClone && <ChildCount count={childCount} />}
        </div>
      </div>
    )
  }
)
MenuItemEl.displayName = 'MenuItemEl'

function MenuIcon({ type }: Pick<MenuItem, 'type'>) {
  if (type === 'block')
    return (
      <DocumentIcon className="h-6 w-6 text-blue-600" aria-label="block icon" />
    )
  if (type === 'sub-section')
    return (
      <FolderIcon className="h-6 w-6 text-red-600" aria-label="Link icon" />
    )
  if (type === 'section')
    return (
      <ServerStackIcon
        className="h-6 w-6 text-green-700"
        aria-label="Link icon"
      />
    )
  return null
}

function ChildCount({ count }: { count: number | undefined }) {
  if (typeof count !== 'number' || count <= 1) return null

  return (
    <span className="absolute -right-2 -top-2 grid h-5 w-5 place-content-center rounded-full bg-purple-500 text-xs font-bold text-white">
      {count}
    </span>
  )
}

export default MenuItemEl
