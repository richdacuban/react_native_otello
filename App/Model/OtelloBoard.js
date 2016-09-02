import {reaction, computed, action, observable, untracked, autorun} from 'mobx';
import autobind from 'autobind-decorator'

import Cell, {CELL_STATUS} from './Cell.js'

const SIZE = 18

const OP = {
  MINUS: 0,
  PLUS: 1
}

@autobind
class OtelloBoard {
  @observable cells = [];
  id = Math.random()

  constructor() {
    for (i = 0; i< SIZE*SIZE; i++) {
      this.cells.push(new Cell())
    }
    this.initialValues()
  }

  initialValues() {
    let middle = SIZE / 2 - 1;
    this.cells[ SIZE * middle + middle].status = CELL_STATUS.BLACK
    this.cells[ SIZE * middle + middle + 1].status = CELL_STATUS.WHITE
    this.cells[ SIZE * (middle + 1)+ middle].status = CELL_STATUS.WHITE
    this.cells[ SIZE * (middle + 1)+ middle + 1].status = CELL_STATUS.BLACK
  }

  // count remaining
  @computed get whiteCount() {
    let count = 0
    this.cells.map(cell => {
      if (cell.status === CELL_STATUS.WHITE) {
        count++
      }
    })
    return count
  }

  @computed get blackCount() {
    let count = 0
    this.cells.map(cell => {
      if (cell.status === CELL_STATUS.BLACK) {
        count++
      }
    })
    return count
  }

  @computed get emptyCount() {
    return SIZE*SIZE - this.whiteCount - this.blackCount
  }

  // Game logic
  @action updateBoard(i) {
    this.cells[i].bump()
    let status = this.cells[i].status
    this.checkHorizontal(i, status)
    this.checkVertical(i, status)
    /* this.checkDiagonalTopLeft(i, status)*/
    /* this.checkDiagonalTopRight(i, status)*/
    /* this.checkDiagonalBottomLeft(i, status)*/
    /* this.checkDiagonalBottomRight(i, status)*/
    /* this.checkDiagonal(i, status)*/
  }

  getCellPosition(i) {
    let row = parseInt(i/SIZE)
    let col = i % SIZE
    return {row, col}
  }

  // Vertical
  checkVertical(i, status) {
    this.checkVerticalTop(i, status)
    this.checkVerticalBottom(i, status)
  }

  checkVerticalTop(pos, status) {
    let {row, col} = this.getCellPosition(pos)
    let max = -1
    let min = row
    for (i = min + 1; i < SIZE; i++){
      let num = i * SIZE + + col
      if (this.cells[num].status === status) {
        max = i
        break
      }
    }
    this.updateCol(min, max, col, status)
  }

  checkVerticalBottom(pos, status) {
    let {row, col} = this.getCellPosition(pos)
    let max = row
    let min = -1
    for (i = max - 1; i >= 0; i--){
      let num = i * SIZE + + col
      if (this.cells[num].status === status) {
        min = i
        break
      }
    }
    this.updateCol(min, max, col, status)
  }

  updateCol( min, max, col, status) {
    if (min > -1 && max > -1) {
      for (i = min; i < max; i++){
        this.cells[ i * SIZE + col].status = status
      }
    }
  }

  // Horizontal
  checkHorizontal(i, status) {
    this.checkHorizontalRight(i, status)
    this.checkHorizontalLeft(i, status)
  }

  checkHorizontalRight(pos, status) {
    let {row, col} = this.getCellPosition(pos)
    let max = -1
    let min = col
    for (i = min + 1; i < SIZE; i++){
      let num = row * SIZE + i
      if (this.cells[num].status === status) {
        max = i
        break
      }
    }
    this.updateRow(min, max, row, status)
  }

  checkHorizontalLeft(pos, status) {
    let {row, col} = this.getCellPosition(pos)
    let max = col
    let min = -1
    for (i = max - 1; i >= 0; i--){
      let num = row * SIZE + i
      if (this.cells[num].status === status) {
        min = i
        break
      }
    }
    this.updateRow(min, max, row, status)
  }

  updateRow( min, max, row, status) {
    if (min > -1 && max > -1) {
      for (i = min; i < max; i++){
        this.cells[ row * SIZE + i].status = status
      }
    }
  }

  // Diagonal
  checkDiagonal(i, status) {
    this.checkDiagonalTopLeft(i, status)
    this.checkDiagonalTopRight(i, status)
    this.checkDiagonalBottomLeft(i, status)
    this.checkDiagonalBottomRight(i, status)
  }

  checkDiagonalTopLeft(i, status) {
    this.diagonalForLoop(i, OP.MINUS, OP.MINUS, status)
  }

  checkDiagonalTopRight(i, status) {
    this.diagonalForLoop(i, OP.MINUS, OP.PLUS, status)
  }

  checkDiagonalBottomLeft(i, status) {
    this.diagonalForLoop(i, OP.PLUS, OP.MINUS, status)
  }

  checkDiagonalBottomRight(i, status) {
    this.diagonalForLoop(i, OP.PLUS, OP.PLUS, status)
  }


  diagonalForLoop(i, rowOp, colOp, status) {
    let {row, col} = this.getCellPosition(i)
    let pos, newRow, newCol
    for (i = 0; i < SIZE; i++){
      let newRow = rowOp === OP.PLUS ? row + i: row - i
      let newCol = colOp === OP.PLUS ? col + i: col - i
      if ( newRow >= 0 && newCol < SIZE) {
        pos = newRow * SIZE + newCol
        if (pos >= 0 && pos < SIZE*SIZE) {
          this.cells[pos].status = status
        }
      }
    }
  }
}

module.exports = {OtelloBoard, SIZE};
