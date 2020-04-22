'use strict';
import React  from 'react';
import ReactDOM from 'react-dom'
// import '../../common'
import largeNumber from 'webpack-large-num-hz'
import logo from './images/logo.png'
import './search.less'

class Search extends React.Component{

  constructor(){
    super(...arguments)
    this.state = {
      Text:null
    }
  }

  loadComponent(){
    import('./test').then((Text)=>{
      this.setState({
        Text:Text.default
      })
    })
  }

  render(){
    const { Text } = this.state

    console.log(largeNumber('999','1'))

    return <div className="search-text">
      {
        Text ? <Text/> : null
      }
      搜索文字<img src={logo} onClick={this.loadComponent.bind(this)}/>
    </div>;
  }
}

ReactDOM.render(
  <Search/>,
  document.getElementById('root')
)