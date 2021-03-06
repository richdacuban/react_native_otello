import {
  StyleSheet,
  Dimensions
} from 'react-native'

import { SIZE } from '../../Model/GameLogic.js'

const WindowSize = Dimensions.get('window')
const BoardWidth = WindowSize.width
const CellSize = Math.floor(BoardWidth / SIZE)
const PieceSize = Math.floor(CellSize * 0.8)
const PieceMargin = (CellSize - PieceSize) / 2
const PieceRadius = PieceSize / 2

export default {
  grid: {
    backgroundColor: 'green',
    width: CellSize,
    height: CellSize,
    zIndex: 0,
    borderWidth: StyleSheet.hairlineWidth
  },
  white: {
    backgroundColor: 'white'
  },
  transparent: {
    backgroundColor: 'transparent',
    borderColor: 'transparent'
  },
  black: {
    backgroundColor: 'black'
  },
  piece: {
    width: PieceSize,
    height: PieceSize,
    margin: PieceMargin,
    borderWidth: 2,
    zIndex: 1,
    borderRadius: PieceRadius
  }
}
