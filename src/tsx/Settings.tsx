import React, { useState } from 'react'
import Popup from 'reactjs-popup'
import { pokeAction, changeSpecialDrawPreferencePoke } from '../ts/helpers/urbitChess'
import useChessStore from '../ts/state/chessStore'
import usePreferenceStore from '../ts/state/preferenceStore'
import { pieceThemes, boardThemes } from '../ts/constants/themes'
import { ActiveGameInfo } from '../ts/types/urbitChess'

export function Settings() {
  const { urbit, displayGame } = useChessStore()
  const { setPieceTheme, setBoardTheme } = usePreferenceStore()
  const hasGame: boolean = (displayGame !== null)
  const [creditsModalOpen, setCreditsModalOpen] = useState(false)

  const openCreditsModal = () => {
    setCreditsModalOpen(true)
  }

  const closeCreditsModal = () => {
    setCreditsModalOpen(false)
  }

  const handleCheckboxChange = async () => {
    const newAutoClaimPreference = !(displayGame as ActiveGameInfo).autoClaimSpecialDraws
    const gameID = displayGame.gameID
    pokeAction(urbit, changeSpecialDrawPreferencePoke(gameID, newAutoClaimPreference))
  }

  return (
    <div className='settings-container'>
      <div className="settings-content">
        <div id="visuals-settings" className="control-panel-container col">
          <h4 className="control-panel-header">Visuals</h4>
          <ul className="theme-list">
            {
              pieceThemes.map((theme: string, ind: number) => {
                let status: string = (theme === localStorage.getItem('pieceTheme'))
                  ? 'selected'
                  : 'unselected'

                const handleClick = () => {
                  setPieceTheme(`${theme}`)
                  localStorage.setItem('pieceTheme', theme)
                }

                return (
                  <li
                    key={ind}
                    className={`theme ${theme} ${status}`}
                    onClick={() => handleClick()}
                  >
                    <piece className="theme-icon black knight" />
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
                  : 'unselected'

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
                    <cg-board id={theme} class="board-icon theme-icon" />
                  </li>
                )
              })
            }
          </ul>
        </div>
        <div id="gameplay-settings" className="control-panel-container col">
          <h4 className="control-panel-header">Gameplay</h4>
          <label>
            <input
              type="checkbox"
              checked={(displayGame as ActiveGameInfo)?.autoClaimSpecialDraws || false}
              disabled={!hasGame}
              onChange={handleCheckboxChange}
            />
            <span>Auto-claim special draws in this game</span>
          </label>
        </div>
        <div id="data-settings" className="control-panel-container col">
          <h4 className="control-panel-header">Data</h4>
          <button>Export PGN</button>
        </div>
      </div>
      <div id="settings-footer" className="control-panel-container col">
        <span>
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault(); openCreditsModal();
            }}>
            Credits
          </a>
          &ensp;
          {'\u2217'}
          &ensp;
          <a
            href="https://github.com/thecommons-urbit/chess"
            target="_blank"
            rel="noopener noreferrer">
            GitHub
          </a>
        </span>
      </div>

      <Popup
        open={creditsModalOpen}
        onClose={closeCreditsModal}
      >
        <div className='credits-container col'>
          <h2>Contributors</h2>
          <div className="credits-list">
            <p>~bonbud-macryg</p>
            <p>~datder-sonnet</p>
            <p>~finmep-lanteb</p>
            <p>~nordus-mocwyl</p>
            <p>~rovmug-ticfyn</p>
            <p>~sigryn-habrex</p>
          </div>
        </div>
      </Popup>
    </div>
  )
}
