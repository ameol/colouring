import React, { Component } from 'react'
import Board from './Board'
import './index.css'

class App extends Component {
  constructor (props) {
    super(props)
    this.state = {
      size : 4,
      isFirst: true
    }
    this.boardRef = React.createRef()
  }
  startGame = () => {
    if (this.boardRef.current.hasData()) {
      if (window.confirm('确定清除数据重新开始吗？')) {
        this.boardRef.current.clearData()
      } else {
        return
      }
    }
    const max = 10
    const min = 4
    const random = Math.floor((Math.random() * (max - min) + min) /2 ) * 2
    this.setState({
      size: random,
      isFirst: false,
    })
  }
  render() {
    const { size, isFirst } = this.state
    return (
      <div className="app">
        <div>
          <button onClick={this.startGame}>{isFirst ? '开始游戏' : '重新开始'}</button>
          <Board size={size} ref={this.boardRef}/>
        </div>
      </div>
    )
  }
}

export default App
