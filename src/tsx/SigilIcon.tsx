import React from 'react'
import { clan } from 'urbit-ob'
import '@urbit/sigil-js'

interface SigilIconProps {
  point: string
}

export function SigilIcon ({ point }: SigilIconProps) {
  const size = 40
  const detail = 'none'
  const space = 'default'
  const background = '#1C1A1D'
  const foreground = '#F2EFE7'
  const shipClan = clan(point)

  // only render sigil for supported ship types
  if (shipClan === 'galaxy' || shipClan === 'star' || shipClan === 'planet') {
    return <urbit-sigil
      point={point}
      size={size}
      background={background}
      foreground={foreground}
      detail={detail}
      space={space}
    />
  }

  // fallback for moons and comets
  return (
    <div
      style={{
        width: size,
        height: size,
        backgroundColor: background,
        borderRadius: '0.25rem'
      }}
    >
    </div>
  )
}
