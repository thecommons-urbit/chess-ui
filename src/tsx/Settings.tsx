import React, { useState } from 'react'
import { pokeAction, changeSpecialDrawPreferencePoke } from '../ts/helpers/urbitChess'
import useChessStore from '../ts/state/chessStore'
import usePreferenceStore from '../ts/state/preferenceStore'
import { pieceThemes, boardThemes } from '../ts/constants/themes'
import { ActiveGameInfo } from '../ts/types/urbitChess'

export function Settings () {
  const [activeSubMenu, setActiveSubMenu] = useState('Visuals')
  const { urbit, displayGame, activeGames } = useChessStore()
  const { setPieceTheme, setBoardTheme } = usePreferenceStore()
  const hasGame: boolean = (displayGame !== null)

  const handleCheckboxChange = async () => {
    const newAutoClaimPreference = !(displayGame as ActiveGameInfo).autoClaimSpecialDraws
    const gameID = displayGame.gameID
    await pokeAction(urbit, changeSpecialDrawPreferencePoke(gameID, newAutoClaimPreference))
  }

  function handleSubMenuSelectorClick(event: React.MouseEvent<HTMLDivElement, MouseEvent>) {
    const selectedMenu = event.target as HTMLElement
    setActiveSubMenu(selectedMenu.textContent)
  }

  return (
    <div className='settings-container'>
      <div className='settings-header' onClick={handleSubMenuSelectorClick}>
        <span className={activeSubMenu === 'Visuals' ? '' : 'inactive'}>
          Visuals
        </span>
        <span>*</span>
        <span className={activeSubMenu === 'Gameplay' ? '' : 'inactive'}>
          Gameplay
        </span>
        <span>*</span>
        <span className={activeSubMenu === 'Data' ? '' : 'inactive'}>
          Data
        </span>
      </div>
      <div className="settings-submenu-container">
        {activeSubMenu === 'Visuals' &&
          <div className="visuals-menu col">
            <ul className="theme-list">
              {
                pieceThemes.map((theme: string, ind: number) => {
                  let status: string = (theme === localStorage.getItem('pieceTheme'))
                    ? 'selected'
                    : 'unselected inactive'

                  const handleClick = () => {
                    setPieceTheme(`${theme}`)
                    localStorage.setItem('pieceTheme', theme)
                  }

                  return (
                    <li
                      key={ind}
                      className={`theme ${theme} ${status} `}
                      onClick={() => handleClick()}
                    >
                      <piece className="theme-icon black knight"/>
                    </li>
                  )
                })
              }
            </ul>
            <ul className="theme-list">
              {
                boardThemes.map((theme: string, ind: number) => {
                  let status = (theme === localStorage.getItem('boardTheme'))
                    ? 'selected'
                    : 'unselected inactive'

                  const handleClick = () => {
                    setBoardTheme(`${theme}`)
                    localStorage.setItem('boardTheme', theme)
                  }

                  return (
                    <li
                      key={ind}
                      className={`theme ${theme} ${status}`}
                      onClick={() => handleClick()}
                    >
                      <cg-board id={theme} class="board-icon theme-icon"/>
                    </li>
                  )
                })
              }
            </ul>
          </div>
        }
        {activeSubMenu === 'Gameplay' &&
          <div id="gameplay-settings" className="col">
          {hasGame && (
            <label>
              <input
                type="checkbox"
                checked={(displayGame as ActiveGameInfo).autoClaimSpecialDraws}
                onChange={handleCheckboxChange}
              />
              Auto-Claim Special Draws
            </label>
          )}
          </div>
        }
        {activeSubMenu === 'Data' &&
          <div id="data-settings" className="col">
            <button>Export PGN</button>
          </div>
        }
      </div>
      <div id="settings-footer" className="col">
        <p><a href="">Credits</a> * <a href="https://github.com/ashelkovnykov/urbit-chess">GitHub</a></p>
      </div>
    </div>
  )
}
