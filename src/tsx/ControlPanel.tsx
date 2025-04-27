import React, { useState } from 'react'
import { Challenges } from './Challenges'
import { Games } from './Games'
import { Settings } from './Settings'
import usePreferenceStore from '../ts/state/preferenceStore'

type MenuOptions = 'games' | 'challenges' | 'settings'

const menuComponents: Record<MenuOptions, React.FC> = {
  games: Games,
  challenges: Challenges,
  settings: Settings
}

export function ControlPanel () {
  const { pieceTheme, boardTheme, setPieceTheme, setBoardTheme } = usePreferenceStore()
  const [selectedMenu, setSelectedMenu] = useState<MenuOptions>('games')

  const initThemes = () => {
    let storedPieceTheme = localStorage.getItem('pieceTheme')
    let storedBoardTheme = localStorage.getItem('boardTheme')

    if (storedPieceTheme !== null) {
      setPieceTheme(storedPieceTheme)
    } else {
      localStorage.setItem('pieceTheme', pieceTheme)
    }

    if (storedBoardTheme !== null) {
      setBoardTheme(storedBoardTheme)
    } else {
      localStorage.setItem('boardTheme', boardTheme)
    }
  }

  React.useEffect(
    () => { initThemes() },
    [])

  return (
    <div className="menu-container">
      <div className="menu-tabs">
        {Object.keys(menuComponents).map((key) => (
          <span
            key={key}
            style={{ cursor: 'pointer', opacity: selectedMenu === key ? 1 : 0.5 }}
            onClick={() => setSelectedMenu(key as MenuOptions)}
          >
            {key.charAt(0).toUpperCase() + key.slice(1)}
          </span>
        ))}
      </div>

      <div>
        {React.createElement(menuComponents[selectedMenu])}
      </div>
    </div>
  )
}
