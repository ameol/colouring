import React, { Component } from 'react'
import './index.css'
import { isContinuity } from './utils'

const ContinuityError = ({ data }) => {
  return (
    data && data.length?
      <div className="error_three" style={{
        left: data[0] * 40,
        top: data[1] * 40,
        width: data[2] - data[0] === 0 ? 40 : (data[2] - data[0]) * 40 + 40,
        height: data[3] - data[1] === 0 ? 40 : (data[3] - data[1]) * 40 + 40,
      }}></div> : null
  )
}

class Board extends Component {
  constructor (props) {
    super(props)
    this.state = {
      blackBlocks: [],
      whiteBlocks: [],
      continuityError: null,
      notEqualError: null,
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
      continuityError: null,
      notEqualError: null,
    })
  }
  _handleContextMenu = (event) => {
    event.preventDefault()
    this._setNewBlock(event, 'whiteBlocks')
  }

  _handleClick = (event) => {
    this._setNewBlock(event, 'blackBlocks')
  }

  _setNewBlock = (event, type) => {
    const $board = document.getElementById('board_wrap')
    const { clientX, clientY } = event
    const x = Math.floor((clientX - $board.offsetLeft) / 40)
    const y = Math.floor((clientY - $board.offsetTop) /40)
    const { size } = this.props
    // 没在范围内
    if (clientX < $board.offsetLeft || clientY < $board.offsetTop || x >= size || y>= size) {
      return false
    }
    const currentBlocks = this.state[type]
    const val = `${x},${y}`
    // 限制同按键点击同区域
    if(~currentBlocks.indexOf(val)) {
      return false
    }
    const otherType = type === 'blackBlocks' ? 'whiteBlocks' : 'blackBlocks'
    const otherBlocks = [...this.state[otherType]]
    const index = otherBlocks.indexOf(val)
    let obj
    if (index > -1) {
      otherBlocks.splice(index, 1)
      obj = {
        [`${otherType}`]: otherBlocks
      }
    } else {
      if (!this.state.continuityError || !this.state.continuityError.length) {
        obj = {
          [`${type}`]: [...currentBlocks, val],
        }
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
    let flag = true

    for (let i = 0; i < size; i++){
      const fixedXBlackBlocks = blackBlocks.filter((item) => item.startsWith(`${i},`))
      const fixedXWhiteBlocks = whiteBlocks.filter((item) => item.startsWith(`${i},`))

      const fixedYBlackBlocks = blackBlocks.filter((item) => item.endsWith(`,${i}`))
      const fixedYWhiteBlocks = whiteBlocks.filter((item) => item.endsWith(`,${i}`))
      console.log(i)
      if(this._hasContinuity(fixedXBlackBlocks, 'x') || this._hasContinuity(fixedXWhiteBlocks, 'x') ||
         this._hasContinuity(fixedYBlackBlocks, 'y') || this._hasContinuity(fixedYWhiteBlocks, 'y')) {
        return false
      } else if(!this._judgeCount(fixedXBlackBlocks, fixedXWhiteBlocks) || !this._judgeCount(fixedYBlackBlocks, fixedYWhiteBlocks)) {
        return false
      }
    }


    if (rightCount !== blackBlocks.length || rightCount !== whiteBlocks.length || !flag) {
      return false
    }
    return true
  }

  _judgeCount (blackBlocks, whiteBlocks) {
    const { size } = this.props
    const bLen = blackBlocks.length
    const wLen = whiteBlocks.length
    
    if (bLen !== wLen && bLen + wLen === size) {
      this.setState({
        notEqualError: whiteBlocks
      })
      return false
    } else if (bLen + wLen !== size) {
      this.setState({
        notEqualError: []
      })
      return true
    }
    this.setState({
      notEqualError: []
    })
    return true
  }

  //判断是否连续
  _hasContinuity (blocks, type) {
    if (blocks.length < 3) {
      this.setState({
        continuityError: null
      })
      return false
    }
    const side = type === 'x' ? 1 : 0
    blocks.sort((p, n) => {
      const pp = p.split(',')
      const nn = n.split(',')
      return Number(pp[side]) > Number(nn[side])
    })
    let arr = blocks.map((item) => {
      return Number(item.split(',')[side])
    })
    const tempList = isContinuity(arr, 3)[0] //超过三个连续的集合(只第一个提示)
    console.log(arr, type,tempList && tempList.length)
    if (tempList && tempList.length) {
      const a = Number(blocks[0].split(',')[type === 'x' ? 0 : 1])
      const starts = side ? [a, tempList[0]] : [tempList[0], a]
      const ends = side ? [a, tempList[tempList.length - 1]] : [tempList[tempList.length - 1], a]
      const errorList = [...starts, ...ends]
      this.setState({
        continuityError: errorList
      })
      return true
    } else {
      this.setState({
        continuityError: null
      })
      console.log(1111)
      return false
    }
  }
  
  render() {
    const { blackBlocks, whiteBlocks, continuityError, notEqualError } = this.state
    const { size } = this.props
    const board = Array.from({ length: size })
    return (
      <div id="board_wrap" className="board_wrap">
        <table className="board" id="board">
          <tbody>
          {
            board.map((row, i) => (
              <tr key={`row${i}`}>
                {
                  board.map((col, j) => (
                    <td key={`col${j}`} className={~blackBlocks.indexOf(`${j},${i}`) ? 'black_block' : (~whiteBlocks.indexOf(`${j},${i}`) ? 'white_block' : '')}>
                    {
                      notEqualError ? (~notEqualError.indexOf(`${j},${i}`) ? '*' : null) : null
                    }
                    </td>
                  ))
                }
              </tr>
            ))
          }
          </tbody>
        </table>
        <ContinuityError data={continuityError} />
      </div>
    )
  }
}

export default Board
