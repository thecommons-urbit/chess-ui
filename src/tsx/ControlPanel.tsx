import React, { useState } from 'react'
import { Challenges } from './Challenges'
import { Games } from './Games'
import { Settings } from './Settings'

export function ControlPanel() {
  const [activeMenu, setActiveMenu] = useState('Games')

  function handleMenuSelectorClick(event: React.MouseEvent<HTMLDivElement, MouseEvent>) {
    const selectedMenu = event.target as HTMLElement
    setActiveMenu(selectedMenu.textContent)
  }

  return (
    <div className="control-panel">
      <div className="menu-selector" onClick={handleMenuSelectorClick}>
        <span className={activeMenu === 'Games' ? '' : 'inactive'}>
          Games
        </span>
        <span className={activeMenu === 'Challenges' ? '' : 'inactive'}>
          Challenges
        </span>
        <span className={activeMenu === 'Settings' ? '' : 'inactive'}>
          Settings
        </span>
      </div>
      <div className="menu-content">
        {activeMenu === 'Games' && <Games />}
        {activeMenu === 'Challenges' && <Challenges />}
        {activeMenu === 'Settings' && <Settings />}
      </div>
    </div>
  )
}
