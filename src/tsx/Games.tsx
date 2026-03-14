import React, { useState } from 'react'
import { GameID } from '../ts/types/urbitChess'
import useChessStore from '../ts/state/chessStore'
import usePreferenceStore from '../ts/state/preferenceStore'
import { SigilIcon } from './SigilIcon'

export function Games () {
  const { urbit, activeGames, setDisplayGame, archivedGames, displayArchivedGame } = useChessStore()
  const { pieceTheme } = usePreferenceStore()
  const [showingActive, setShowingActive] = useState(true)

  const extractDate = (gameID: GameID) => {
    return (gameID.split('..')[0]).substring(1)
  }

  const openActive = () => {
    setShowingActive(true)
  }

  const openArchive = () => {
    setShowingActive(false)
  }

  return (
    <div className='games-container col'>
      <div id="active-archive-toggle">
        <p>
          <span onClick={openActive} style={{ opacity: (showingActive ? 1.0 : 0.5) }}>Active</span>&ensp;<span>{'\u2217'}</span>&ensp;<span onClick={openArchive} style={{ opacity: (showingActive ? 0.5 : 1.0) }}>Archive</span>
        </p>
      </div>
      {/* Active */}
      <ul id="active-games" className={`game-list ${pieceTheme}`} style={{ display: (showingActive ? 'flex' : 'none') }}>
        {
          Array.from(activeGames).map(([gameID, activeGame], key) => {
            const opponent = (urbit.ship === activeGame.white.substring(1))
              ? activeGame.black
              : activeGame.white

            if (opponent === `~${urbit.ship}`) {
              return
            }

            const description = activeGame.event
            return (
              <li
                key={key}
                className={`game active`}
                title={gameID}
                onClick={() => { setDisplayGame(activeGame) }}>
                <div className='row' style={{ alignItems: 'center', cursor: 'pointer' }}>
                  <SigilIcon point={opponent} />
                  <div className='col game-card'>
                    <p className='game-opponent'>{opponent}</p>
                    <p
                      title={!description ? '' : `~${extractDate(gameID)}`}
                      className='game-desc'
                    >
                      {description || `~${extractDate(gameID)}`}
                    </p>
                  </div>
                </div>
              </li>
            )
          })
        }
      </ul>
      {/* Archive */}
      <ul id="archive-games" className={`game-list ${pieceTheme}`} style={{ display: (showingActive ? 'none' : 'flex') }}>
        {
          Array.from(archivedGames).map(([gameID, archivedGame], key) => {
            const opponent = (urbit.ship === archivedGame.white.substring(1))
              ? archivedGame.black
              : archivedGame.white

            if (opponent === `~${urbit.ship}`) {
              return
            }

            const description = archivedGame.event
            return (
              <li
                key={key}
                className='game'
                title={gameID}
                onClick={() => { displayArchivedGame(gameID) }}>
                <div className='row' style={{ alignItems: 'center', cursor: 'pointer' }}>
                  <SigilIcon point={opponent} />
                  <div className='col game-card'>
                    <p className='game-opponent'>{opponent}</p>
                    <p
                      title={!description ? '' : `~${extractDate(gameID)}`}
                      className='game-desc'
                    >
                      {description || `~${extractDate(gameID)}`}
                    </p>
                  </div>
                </div>
              </li>
            )
          })
        }
      </ul>
    </div>
  )
}
