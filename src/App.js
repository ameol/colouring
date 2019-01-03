import React, { Component } from 'react'
import Board from './Board'
import './index.css'

class App extends Component {
  constructor (props) {
    super(props)
    this.sizes = [6, 8, 10]
    this.state = {
      size : this.sizes[0],
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
    const size = document.getElementById('select_size').value
    const degree = document.getElementById('select_degree').value
    this.setState({
      size: size,
    })
  }
  render() {
    const { size, isFirst } = this.state
    return (
      <div className="app">
        <div>
          <div className="select_wrap">
            请选择行列数
            <select id="select_size">
              {
                this.sizes.map((item) => (
                  <option value={item} key={item}>{item}</option>
                ))
              }
            </select>
          </div>
          <div className="select_wrap">
            请选择困难程度
            <select id="select_degree">
              <option value={1}>简易</option>
              <option value={2}>中等</option>
              <option value={3}>困难</option>
            </select>
          </div>
          <button onClick={this.startGame}>重新开始</button>
          <Board size={size} ref={this.boardRef}/>
        </div>
      </div>
    )
  }
}

export default App
