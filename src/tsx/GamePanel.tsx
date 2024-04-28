import React, { useState } from 'react'
import { Chess, ChessInstance } from 'chess.js'
import Popup from 'reactjs-popup'
import useChessStore from '../ts/state/chessStore'
import { pokeAction, offerDrawPoke, revokeDrawPoke, declineDrawPoke, acceptDrawPoke, claimSpecialDrawPoke, resignPoke, requestUndoPoke, revokeUndoPoke, declineUndoPoke, acceptUndoPoke } from '../ts/helpers/urbitChess'
import { CHESS, PieceCount } from '../ts/constants/chess'
import { Ship, Side, GameID, SAN, GameInfo, ActiveGameInfo } from '../ts/types/urbitChess'
import { Piece } from 'chessground/types'

import resignIcon from '../assets/buttons/resign.svg'
import drawIcon from '../assets/buttons/regular-draw.svg'
import acceptDrawIcon from '../assets/buttons/accept-draw.svg'
import cancelDrawIcon from '../assets/buttons/cancel-draw.svg'
import threefoldDrawIcon from '../assets/buttons/threefold-draw.svg'
import fiftyMoveDrawIcon from '../assets/buttons/fifty-move-draw.svg'

export function GamePanel () {
  const { urbit, displayGame, setDisplayGame, practiceBoard, setPracticeBoard, displayIndex, setDisplayIndex } = useChessStore()
  const hasActiveGame: boolean = !displayGame.archived
  const practiceHasMoved: boolean = (localStorage.getItem('practiceBoard') !== CHESS.defaultFEN)
  const opponent: Ship = (urbit.ship === displayGame.white.substring(1))
    ? displayGame.black
    : displayGame.white
  const canUndo: boolean = (displayGame.moves.length >= 2)
    ? true
    : (urbit.ship === displayGame.white.substring(1) && displayGame.moves.length >= 1)
  const lastFen: string = (displayGame.moves.length > 0)
    ? displayGame.moves[displayGame.moves.length - 1].fen
    : CHESS.defaultFEN
  const ourMove: boolean = urbit.ship === displayGame.white.substring(1) &&
    displayGame.moves.length % 2 === 0 ||
    urbit.ship === displayGame.black.substring(1) &&
    displayGame.moves.length % 2 !== 0

  //
  // HTML element helper functions
  //

  const resignOnClick = async () => {
    const gameID = displayGame.gameID
    await pokeAction(urbit, resignPoke(gameID))
  }

  const offerDrawOnClick = async () => {
    const gameID = displayGame.gameID
    await pokeAction(urbit, offerDrawPoke(gameID))
  }

  const acceptDrawOnClick = async () => {
    const gameID = displayGame.gameID
    await pokeAction(urbit, acceptDrawPoke(gameID))
  }

  const declineDrawOnClick = async () => {
    const gameID = displayGame.gameID
    await pokeAction(urbit, declineDrawPoke(gameID))
  }

  const revokeDrawOnClick = async () => {
    const gameID = displayGame.gameID
    await pokeAction(urbit, revokeDrawPoke(gameID))
  }

  const claimSpecialDrawOnClick = async () => {
    const gameID = displayGame.gameID
    await pokeAction(urbit, claimSpecialDrawPoke(gameID))
  }

  const requestUndoOnClick = async () => {
    const gameID = displayGame.gameID
    await pokeAction(urbit, requestUndoPoke(gameID))
  }

  const acceptUndoOnClick = async () => {
    const gameID = displayGame.gameID
    await pokeAction(urbit, acceptUndoPoke(gameID))
  }

  const declineUndoOnClick = async () => {
    const gameID = displayGame.gameID
    await pokeAction(urbit, declineUndoPoke(gameID))
  }

  const revokeUndoOnClick = async () => {
    const gameID = displayGame.gameID
    await pokeAction(urbit, revokeUndoPoke(gameID))
  }

  const moveOpacity = (index: number) => {
    if (index <= displayIndex) {
      return 1.0
    } else {
      return 0.3
    }
  }

  const materialDifference = (fen: string): { white: JSX.Element[], black: JSX.Element[] } => {
    const board = fen.split(' ')[0]
    const whitePieces: PieceCount = { q: 0, r: 0, b: 0, n: 0, p: 0 }
    const blackPieces: PieceCount = { q: 0, r: 0, b: 0, n: 0, p: 0 }

    // Count pieces on the current board
    for (const char of board) {
      if (char === '/') continue
      const num = parseInt(char, 10)
      if (!isNaN(num)) continue

      const piece = char.toLowerCase()
      const isWhite = char === char.toUpperCase()
      const count = isWhite ? whitePieces : blackPieces
      count[piece]++
    }

    let whiteDisplay: JSX.Element[] = []
    let blackDisplay: JSX.Element[] = []

    Object.keys(CHESS.initialPiecesCount).forEach((key: keyof PieceCount) => {
      const whiteTaken = CHESS.initialPiecesCount[key] - whitePieces[key]
      const blackTaken = CHESS.initialPiecesCount[key] - blackPieces[key]

      for (let i = 0; i < whiteTaken; i++) {
        whiteDisplay.push(<img className="material-diff-icon" key={`${key}-white-${i}`} src={CHESS.pieceIconsBlack[key]} alt={`White ${key}`} />)
      }
      for (let i = 0; i < blackTaken; i++) {
        blackDisplay.push(<img className="material-diff-icon" key={`${key}-black-${i}`} src={CHESS.pieceIconsWhite[key]} alt={`Black ${key}`} />)
      }
    })

    // Calculate material score
    const materialScore = Object.keys(whitePieces).reduce((diff, key) => {
      if (key === 'k') return diff
      const whitePieceCount = whitePieces[key as keyof PieceCount]
      const blackPieceCount = blackPieces[key as keyof PieceCount]
      const pieceValue = CHESS.pieceValues[key as keyof PieceCount]

      return diff + (whitePieceCount - blackPieceCount) * pieceValue
    }, 0)

    if (materialScore > 0) {
      whiteDisplay.push(<span key="score">+{materialScore}</span>)
    } else if (materialScore < 0) {
      blackDisplay.push(<span key="score">+{-materialScore}</span>)
    }

    return { white: whiteDisplay, black: blackDisplay }
  }

  //
  // HTML element generation functions
  //

  const moveList = () => {
    let displayMoves = (displayGame.moves !== null) ? displayGame.moves : []
    let components = []
    for (let wIndex: number = 0; wIndex < displayMoves.length; wIndex += 2) {
      const move: number = (wIndex / 2) + 1
      const bIndex: number = wIndex + 1
      const wMove: SAN = displayMoves[wIndex].san

      if (bIndex >= displayMoves.length) {
        components.push(
          <li key={ move } className='move-item' style={{ opacity: moveOpacity(wIndex) }}>
            <span onClick={ () => setDisplayIndex(wIndex) }>
              { wMove }
            </span>
          </li>
        )
      } else {
        components.push(
          <li key={ move } className='move-item' style={{ opacity: moveOpacity(wIndex) }}>
            <span onClick={ () => setDisplayIndex(wIndex) }>
              { wMove }
            </span>
            { '\xa0'.repeat(6 - wMove.length) }
            {/* setting opacity to 1.0 offsets a cumulative reduction in opacity on each bIndex ply when displayIndex < this move's wIndex */}
            <span onClick={ () => setDisplayIndex(bIndex) } style={{ opacity: (moveOpacity(wIndex) === 1.0) ? moveOpacity(bIndex) : 1.0 }}>
              { displayMoves[wIndex + 1].san }
            </span>
          </li>
        )
      }
    }

    return components
  }

  //
  // Render HTML
  //

  const renderDrawPopup = (game: ActiveGameInfo) => {
    return (
      <Popup open={game.gotDrawOffer}>
        <div>
          <p>{`${opponent} has offered a draw`}</p>
          <br/>
          <div className='draw-resolution row'>
            <button className="accept" role="button" onClick={acceptDrawOnClick}>Accept</button>
            <button className="reject" role="button" onClick={declineDrawOnClick}>Decline</button>
          </div>
        </div>
      </Popup>
    )
  }

  const renderUndoPopup = (game: ActiveGameInfo) => {
    return (
      <Popup open={game.gotUndoRequest}>
        <div>
          <p>{`${opponent} has requested to undo a move`}</p>
          <br/>
          <div className='draw-resolution row'>
            <button className="accept" role="button" onClick={acceptUndoOnClick}>Accept</button>
            <button className="reject" role="button" onClick={declineUndoOnClick}>Decline</button>
          </div>
        </div>
      </Popup>
    )
  }

  return (
    <div className='game-panel-container col' style={{ display: 'flex' }}>
      <div className="game-panel col">
        <div id="opp-captured" className='captured row'>
          {displayGame.white === `~${window.ship}`
            ? materialDifference(lastFen).black
            : materialDifference(lastFen).white
          }
        </div>
        <div id="our-captured" className='captured row'>
          {displayGame.white === `~${window.ship}`
            ? materialDifference(lastFen).white
            : materialDifference(lastFen).black
          }
        </div>
        <div id="opp-timer" className='timer row'>
          <p>00:00</p>
        </div>
        <div id="opp-player" className='player row'>
          <p>{opponent}</p>
        </div>
        <div className='moves-container'>
          <div className='moves col'>
            <ol>
              {moveList()}
            </ol>
          </div>
        </div>
        <div id="our-player" className='player row'>
          <p>~{window.ship}</p>
        </div>
        <div id="our-timer" className='timer row'>
          <p>00:00</p>
        </div>
        {/* buttons */}
        {/* resign button */}
        <img
          src={resignIcon}
          alt="Resign"
          onClick={resignOnClick}
          className='game-panel-button'
          style={{ opacity: hasActiveGame ? 1.0 : 0.5 }}
        />
        {/* offer/revoke/accept draw button */}
        {
          hasActiveGame &&
          (displayGame as ActiveGameInfo).gotDrawOffer
            ? <img
                src={acceptDrawIcon}
                alt="Accept Draw Offer"
                onClick={acceptDrawOnClick}
                className='game-panel-button'
                style={{ opacity: hasActiveGame && ourMove ? 1.0 : 0.5 }}
              />
            : (displayGame as ActiveGameInfo).sentDrawOffer
              ? <img
                  src={cancelDrawIcon}
                  alt="Revoke Draw Offer"
                  onClick={revokeDrawOnClick}
                  className='game-panel-button'
                  style={{ opacity: hasActiveGame && ourMove ? 1.0 : 0.5 }}
                />
              : (displayGame as ActiveGameInfo).fiftyMoveDrawAvailable
                ? <img
                    src={fiftyMoveDrawIcon}
                    alt="Claim Fifty-Move Draw"
                    onClick={claimSpecialDrawOnClick}
                    className='game-panel-button'
                    style={{ opacity: hasActiveGame && ourMove ? 1.0 : 0.5 }}
                  />
                : (displayGame as ActiveGameInfo).threefoldDrawAvailable
                  ? <img
                      src={threefoldDrawIcon}
                      alt="Claim Threefold Draw"
                      onClick={claimSpecialDrawOnClick}
                      className='game-panel-button'
                      style={{ opacity: hasActiveGame && ourMove ? 1.0 : 0.5 }}
                    />
                  : <img
                      src={drawIcon}
                      alt="Offer Draw"
                      onClick={offerDrawOnClick}
                      className='game-panel-button'
                      style={{ opacity: hasActiveGame && ourMove ? 1.0 : 0.5 }}
                    />
        }
        {/* request/revoke/accept undo button */}
        {(!hasActiveGame || (!(displayGame as ActiveGameInfo).gotUndoRequest && !(displayGame as ActiveGameInfo).sentUndoRequest))
          ? <button
            className='option'
            disabled={!hasActiveGame || !canUndo}
            onClick={requestUndoOnClick}>
            Request to Undo Move</button>
          : ((displayGame as ActiveGameInfo).gotUndoRequest)
            ? <button
              className='option'
              onClick={acceptUndoOnClick}>
              Accept Undo Request</button>
            : <button
              className='option'
              onClick={revokeUndoOnClick}>
              Revoke Undo Request</button>
        }
      </div>
      { hasActiveGame ? renderDrawPopup((displayGame as ActiveGameInfo)) : <div/> }
      { hasActiveGame ? renderUndoPopup((displayGame as ActiveGameInfo)) : <div/> }
    </div>
  )
}
