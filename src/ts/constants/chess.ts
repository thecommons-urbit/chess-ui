import { KNIGHT, BISHOP, ROOK, QUEEN } from 'chess.js'
import * as cg from 'chessground/types'
import { PromotionRole } from '../types/urbitChess'
import wP from '$cburnett/wP.svg'
import wN from '$cburnett/wN.svg'
import wB from '$cburnett/wB.svg'
import wR from '$cburnett/wR.svg'
import wQ from '$cburnett/wQ.svg'
import bP from '$cburnett/bP.svg'
import bN from '$cburnett/bN.svg'
import bB from '$cburnett/bB.svg'
import bR from '$cburnett/bR.svg'
import bQ from '$cburnett/bQ.svg'

type Role = typeof QUEEN | typeof ROOK | typeof KNIGHT | typeof BISHOP
type RoleDictionary = {
  cgRole: cg.Role,
  chessRole: Role,
  urbitRole: PromotionRole
}

const DEFAULT_FEN: string = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1'

const PROMOTION_ROLES: RoleDictionary[] = [
  { cgRole: 'queen', chessRole: QUEEN, urbitRole: PromotionRole.Queen },
  { cgRole: 'rook', chessRole: ROOK, urbitRole: PromotionRole.Rook },
  { cgRole: 'knight', chessRole: KNIGHT, urbitRole: PromotionRole.Knight },
  { cgRole: 'bishop', chessRole: BISHOP, urbitRole: PromotionRole.Bishop }
]

export interface PieceCount {
  [key: string]: number;
}

interface PieceValues {
  [key: string]: number;
}

const INITIAL_PIECES_COUNT: PieceCount = {
  'p': 8,
  'n': 2,
  'b': 2,
  'r': 2,
  'q': 1,
  'k': 1
}

const PIECE_VALUES: PieceValues = {
  'p': 1,
  'n': 3,
  'b': 3,
  'r': 5,
  'q': 9
}

interface PieceIcons {
  [key: string]: string;
}

const PIECE_ICONS_WHITE: PieceIcons = {
  'p': wP,
  'n': wN,
  'b': wB,
  'r': wR,
  'q': wQ,
}

const PIECE_ICONS_BLACK: PieceIcons = {
  'p': bP,
  'n': bN,
  'b': bB,
  'r': bR,
  'q': bQ,
}

export const CHESS = {
  defaultFEN: DEFAULT_FEN,
  promotionRoles: PROMOTION_ROLES,
  initialPiecesCount: INITIAL_PIECES_COUNT,
  pieceValues: PIECE_VALUES,
  pieceIconsWhite: PIECE_ICONS_WHITE,
  pieceIconsBlack: PIECE_ICONS_BLACK
}
