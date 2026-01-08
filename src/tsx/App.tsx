import React from 'react'
import { Beforeunload } from 'react-beforeunload'
import Urbit from '@urbit/http-api'
import useChessStore from '../ts/state/chessStore'
import { Side, ChallengeUpdate, ActiveGameInfo, ArchivedGameInfo } from '../ts/types/urbitChess'
import { scryFriends, pokeAction, sendChallengePoke } from '../ts/helpers/urbitChess'
import { Chessboard } from './Chessboard'
import { ControlPanel } from './ControlPanel'
import { GamePanel } from './GamePanel'
import { PracticePanel } from './PracticePanel'

export function App () {
  const { urbit, setUrbit, receiveChallengeUpdate, receiveActiveGame, receiveArchivedGame, displayGame, setFriends } = useChessStore()

  //
  // Helper functions
  //

  const init = async () => {
    const newUrbit = new Urbit('', '')
    newUrbit.ship = window.ship
    setUrbit(newUrbit)
    await newUrbit.subscribe({
      app: 'chess',
      path: '/challenges',
      err: () => {},
      event: (data: ChallengeUpdate) => receiveChallengeUpdate(data),
      quit: () => {}
    })
    await newUrbit.subscribe({
      app: 'chess',
      path: '/active-games',
      err: () => {},
      event: (data: ActiveGameInfo) => receiveActiveGame(data),
      quit: () => {}
    })
    await newUrbit.subscribe({
      app: 'chess',
      path: '/archived-games',
      err: () => {},
      event: (data: ArchivedGameInfo) => receiveArchivedGame(data),
      quit: () => {}
    })

    setFriends(await scryFriends('chess', '/friends'))

    console.log('sending challenge to ourselves')
    pokeAction(newUrbit, sendChallengePoke(`~${window.ship}`, Side.Black, 'Practice board', true))
  }

  const teardown = () => {
    urbit.delete()
  }

  //
  // React hooks
  //

  React.useEffect(
    () => { init() },
    [])

  //
  // Render app components
  //

  return (
    <Beforeunload onBeforeunload={teardown}>
      <div className='app-container'>
        {
          (displayGame == null)
            ? <PracticePanel />
            : <GamePanel />
        }
        <Chessboard />
        <ControlPanel />
      </div>
    </Beforeunload>
  )
}

export default App
