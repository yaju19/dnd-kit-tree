import { useState } from 'react'
import { MenuItem, menus } from '@/domain/data'
import DropContainer from './components/dnd-kit/DropContainer'

function App() {
  const [menu, setMenu] = useState<MenuItem[]>(menus)

  return (
    <div className="m-8 rounded border border-gray-300 bg-white p-6">
      <h2 className="mb-4 text-lg font-bold">Menu Items</h2>
      <div className="rounded border border-gray-300 p-4">
        <DropContainer menus={menu} setMenus={setMenu} />
      </div>
    </div>
  )
}

export default App
