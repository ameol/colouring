import React, { Component } from 'react'
import './index.css'

class Board extends Component {
  constructor (props) {
    super(props)
    this.state = {
      blackBlocks: [],
      whiteBlocks: [],
    }
  }
  static DefaultProps = {
    size: 4,
  }
  componentDidMount() {
    document.addEventListener('contextmenu', this._handleContextMenu)
    document.addEventListener('click', this._handleClick)
  }

  componentWillUnmount() {
    document.removeEventListener('contextmenu', this._handleContextMenu)
    document.removeEventListener('click', this._handleClick)
  }
  hasData() {
    const { blackBlocks, whiteBlocks } = this.state
    return blackBlocks.length > 0 || whiteBlocks.length > 0
  }
  clearData() {
    this.setState({
      blackBlocks: [],
      whiteBlocks: [],
    })
  }
  _setNewBlock = (event, type) => {
    const $board = document.getElementById('board')
    const { clientX, clientY } = event
    const x = Math.floor((clientX - $board.offsetLeft) / 40)
    const y = Math.floor((clientY - $board.offsetTop) /40)
    const { size } = this.props
    // 没在范围内
    if (clientX < $board.offsetLeft || clientY < $board.offsetTop || x >= size || y>= size) {
      return false
    }
    const currentBlocks = this.state[type]
    const otherType = type === 'blackBlocks' ? 'whiteBlocks' : 'blackBlocks'
    const otherBlocks = [...this.state[otherType]]
    const val = `${x},${y}`
    const index = otherBlocks.indexOf(val)
    let obj
    if (index > -1) {
      otherBlocks.splice(index, 1)
      obj = {
        [`${otherType}`]: otherBlocks
      }
    } else {
      obj = {
        [`${type}`]: [...currentBlocks, val],
      }
    }
    this.setState(obj, () => {
      if (this._isWin()) {
        setTimeout(() => {
          alert('win')
        }, 100)
      }
    })
  }
  _isWin() {
    const { blackBlocks, whiteBlocks } = this.state
    const { size } = this.props
    const rightCount = (size * size) / 2
    if (rightCount !== blackBlocks.length || rightCount !== whiteBlocks.length) {
      return false
    }
    for (let i = 0; i < size; i++){
      const fixedXBlackBlocks = blackBlocks.filter((item) => (item.startsWith(`${i},`)))
      const fixedXWhiteBlocks = whiteBlocks.filter((item) => (item.startsWith(`${i},`)))
      if (fixedXBlackBlocks.length !== fixedXWhiteBlocks.length) {
        return false
      }
      const fixedYBlackBlocks = blackBlocks.filter((item) => (item.endsWith(`,${i}`)))
      const fixedYWhiteBlocks = whiteBlocks.filter((item) => (item.endsWith(`,${i}`)))
      if (fixedYBlackBlocks.length !== fixedYWhiteBlocks.length) {
        return false
      }
    }
    return true
  }
  _handleContextMenu = (event) => {
    event.preventDefault()
    this._setNewBlock(event, 'whiteBlocks')
  }

  _handleClick = (event) => {
    this._setNewBlock(event, 'blackBlocks')
  }

  render() {
    const { blackBlocks, whiteBlocks } = this.state
    const { size } = this.props
    const board = Array.from({ length: size })
    return (
      <table className="board" id="board">
        <tbody>
        {
          board.map((row, i) => (
            <tr key={`row${i}`}>
              {
                board.map((col, j) => (
                  <td key={`col${j}`} className={~blackBlocks.indexOf(`${j},${i}`) ? 'black_block' : (~whiteBlocks.indexOf(`${j},${i}`) ? 'white_block' : '')}></td>
                ))
              }
            </tr>
          ))
        }
        </tbody>
      </table>
    )
  }
}

export default Board
