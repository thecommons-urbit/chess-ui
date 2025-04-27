import React, { useState } from 'react'
import Popup from 'reactjs-popup'
import { isValidPatp } from 'urbit-ob'
import { pokeAction, sendChallengePoke, acceptChallengePoke, declineChallengePoke } from '../ts/helpers/urbitChess'
import useChessStore from '../ts/state/chessStore'
import { Challenge, Side, Ship } from '../ts/types/urbitChess'
import { getTally } from '../ts/helpers/chess'
import '@urbit/sigil-js'

const selectedSideButtonClasses = 'side radio-selected'
const unselectedSideButtonClasses = 'side radio-unselected'

export function Challenges() {
  // data
  const [who, setWho] = useState('')
  const [description, setDescription] = useState('')
  const [side, setSide] = useState(Side.Random)
  const [practiceSetting, setPracticeSetting] = useState(false)
  const [newOpp, setNewOpp] = useState('')
  const { urbit, incomingChallenges, outgoingChallenges, friends } = useChessStore()
  // interface
  const [modalOpen, setModalOpen] = useState(false)
  const [challengingFriend, setChallengingFriend] = useState(false)
  const [showingFriends, setFriendsList] = useState(false)
  const [showingIncoming, setIncomingList] = useState(true)
  const [showingOutgoing, setOutgoingList] = useState(false)
  const [badChallengeAttempts, setBadChallengeAttempts] = useState(0)

  const openModal = () => {
    setModalOpen(true)
  }

  const closeModal = () => {
    setModalOpen(false)
    setNewOpp('')
  }

  const incrementBadChallengeAttempts = () => {
    setBadChallengeAttempts(badChallengeAttempts + 1)
  }

  const resetChallengeInterface = () => {
    setWho('')
    setDescription('')
    setPracticeSetting(false)
    setSide(Side.Random)
    setChallengingFriend(false)
    setBadChallengeAttempts(0)

    closeModal()
  }

  const acceptChallenge = async (who: Ship) => {
    pokeAction(urbit, acceptChallengePoke(who))
  }

  const declineChallenge = async (who: Ship) => {
    pokeAction(urbit, declineChallengePoke(who))
  }

  const sendChallenge = async () => {
    const onError = () => {
      incrementBadChallengeAttempts()
    }

    const onSuccess = () => {
      resetChallengeInterface()
    }

    pokeAction(urbit, sendChallengePoke(who, side, description, practiceSetting), onError, onSuccess)
  }

  const openFriends = async () => {
    setFriendsList(true)
    setIncomingList(false)
    setOutgoingList(false)
  }

  const openIncoming = () => {
    setIncomingList(true)
    setOutgoingList(false)
    setFriendsList(false)
  }

  const openOutgoing = () => {
    setOutgoingList(true)
    setIncomingList(false)
    setFriendsList(false)
  }

  return (
    <div className='challenges-container col'>
      <div id="challenges-header" className="control-panel-container col">
        <button className='option' onClick={openModal}>New Challenge</button>
        <p>
          <span onClick={openIncoming} style={{ opacity: (showingIncoming ? 1.0 : 0.5) }}>
            Incoming
          </span>
          &ensp;
          <span>
            {'\u2217'}
          </span>
          &ensp;
          <span onClick={openOutgoing} style={{ opacity: (showingOutgoing ? 1.0 : 0.5) }}>
            Outgoing
          </span>
          &ensp;
          <span>
            {'\u2217'}
          </span>
          &ensp;
          <span onClick={openFriends} style={{ opacity: (showingFriends ? 1.0 : 0.5) }}>
            Friends
          </span>
        </p>
      </div>
      {/* incoming challenges list */}
      <ul id="incoming-challenges" className='game-list' style={{ display: (showingIncoming ? 'flex' : ' none') }}>
        {
          Array.from(incomingChallenges).map(([challenger, challenge], key) => {
            const colorClass = (key % 2) ? 'odd' : 'even'
            const description = challenge.event
            const isPractice = challenge.isPractice
            const sigilConfig = {
              point: `${challenger}`,
              size: 40,
              background: '#1C1A1D',
              foreground: '#F2EFE7',
              detail: 'none',
              space: 'default'
            }

            return (
              <li className={`game challenge ${colorClass}`} key={key}>
                <div className='challenge-box'>
                  <div className='row' style={{ alignItems: 'center' }}>
                    <urbit-sigil {...sigilConfig} />
                    <div className='col'>
                      <p className='challenger-name'>{challenger}</p>
                      <p
                        title={description}
                        className='challenger-desc'
                      >
                        {isPractice && <i>Practice:&nbsp;</i>}
                        {description}
                      </p>
                    </div>
                  </div>
                  <div className='col'>
                    <button className="accept" onClick={() => acceptChallenge(challenger)}>Accept</button>
                    <button className="reject" onClick={() => declineChallenge(challenger)}>Decline</button>
                  </div>
                </div>
              </li>
            )
          })
        }
      </ul>
      {/* outgoing challenges list */}
      <ul id="outgoing-challenges" className='game-list' style={{ display: (showingOutgoing ? 'flex' : ' none') }}>
        {
          Array.from(outgoingChallenges).map(([challenged, challenge], key) => {
            const description = challenge.event
            const isPractice = challenge.isPractice
            const sigilConfig = {
              point: `${challenged}`,
              size: 40,
              background: '#1C1A1D',
              foreground: '#F2EFE7',
              detail: 'none',
              space: 'default'
            }

            return (
              <li className='game' key={key}>
                <div className='challenge-box'>
                  <div className='row' style={{ alignItems: 'center' }}>
                    <urbit-sigil {...sigilConfig} />
                    <div className='col'>
                      <p className='challenger-name'>{challenged}</p>
                      <p
                        title={description}
                        className='challenger-desc'
                      >
                        {isPractice && <i>Practice:&nbsp;</i>}
                        {description}
                      </p>
                    </div>
                  </div>
                </div>
              </li>
            )
          })
        }
      </ul>
      {/* friends list */}
      <ul id="friends" className='game-list' style={{ display: (showingFriends ? 'flex' : ' none') }}>
        {
          Array.from(friends).map((friend: Ship, key: number) => {
            const colorClass = (key % 2) ? 'odd' : 'even'
            return (
              <li className={`game challenge ${colorClass}`} key={key}>
                <div className='challenge-box'>
                  <div className='row'>
                    <div className='col'>
                      <p className='friend'>~{friend}</p>
                      <p className="score">{(getTally(`~${friend}`))}</p>
                    </div>
                  </div>
                  <div className='col'>
                    <button className='quick-game' onClick={() => { setChallengingFriend(true); setWho('~' + friend); setNewOpp('~' + friend); openModal() }}>Challenge</button>
                  </div>
                </div>
              </li>
            )
          })
        }
      </ul>
      {/* New Challenge popup */}
      {/* XX getTally runs on each chance to the description field */}
      <Popup open={modalOpen} onClose={resetChallengeInterface}>
        <div className='new-challenge-container col'>
          <p className='new-challenge-header'>New Challenge</p>
          <div className='challenge-input-container row'>
            <p>Opponent:</p>
            <input
              className={(badChallengeAttempts > 0) ? 'rejected' : ''}
              type="text"
              placeholder={'~sampel-palnet'}
              value={who}
              onChange={(e) => {
                setWho(e.target.value)
                setNewOpp(e.target.value)
              }}
              key={badChallengeAttempts}
              disabled={challengingFriend} />
          </div>
          <div
            className="new-opp-tally-container"
            style={
              newOpp === ''
                ? { display: 'none' }
                : !isValidPatp(newOpp)
                  ? { display: 'none' }
                  : newOpp === `~${urbit.ship}`
                    ? { display: 'none' }
                    : { display: 'block' }
            }
          >
            <p className="new-opp-tally">
              {(getTally(newOpp))}
            </p>
          </div>
          <div className='challenge-input-container row'>
            <p>Description:</p>
            <input
              type="text"
              placeholder={'(optional)'}
              onChange={(e) => setDescription(e.target.value)} />
          </div>
          <div className='challenge-practice-container row'>
            <p>Practice Game:</p>
            <input
              type="checkbox"
              onChange={(e) => setPracticeSetting(e.target.checked)} />
          </div>
          <div className='challenge-side-container row'>
            <button
              className={(side === Side.White) ? selectedSideButtonClasses : unselectedSideButtonClasses}
              title='White'
              style={{
                backgroundImage: 'url(https://raw.githubusercontent.com/lichess-org/lila/5a9672eacb870d4d012ae09d95aa4a7fdd5c8dbf/public/piece/cburnett/wK.svg)'
              }}
              onClick={() => setSide(Side.White)} />
            <button
              className={(side === Side.Random) ? selectedSideButtonClasses : unselectedSideButtonClasses}
              title='Random'
              style={{
                backgroundImage: 'url(https://raw.githubusercontent.com/lichess-org/lila/5a9672eacb870d4d012ae09d95aa4a7fdd5c8dbf/public/images/wbK.svg)'
              }}
              onClick={() => setSide(Side.Random)} />
            <button
              className={(side === Side.Black) ? selectedSideButtonClasses : unselectedSideButtonClasses}
              title='Black'
              style={{
                backgroundImage: 'url(https://raw.githubusercontent.com/lichess-org/lila/5a9672eacb870d4d012ae09d95aa4a7fdd5c8dbf/public/piece/cburnett/bK.svg)'
              }}
              onClick={() => setSide(Side.Black)} />
          </div>
          <button onClick={sendChallenge}>Send Challenge</button>
        </div>
      </Popup>
    </div>
  )
}
