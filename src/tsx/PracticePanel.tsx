import React, { useState } from 'react'
import { Chess, ChessInstance } from 'chess.js'
import useChessStore from '../ts/state/chessStore'
import { CHESS } from '../ts/constants/chess'
import { Side, GameID, SAN, GameInfo, ActiveGameInfo } from '../ts/types/urbitChess'

export function PracticePanel () {
  const { displayGame } = useChessStore()
  const hasGame: boolean = (displayGame !== null)
  return (
    <div className='game-panel-container col'>
      <div className="game-panel col">
        <p>Waiting for practice game to start...</p>
      </div>
    </div>
  )
}
