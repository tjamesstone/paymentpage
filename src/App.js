import React, {Component} from 'react';
import './App.css';


export default class App extends Component {
  //state
  state = {

  }

  //functions



  render(){
    return (
      <div className="App">
        <div className="info">
          <h1>Congrats on signing with Grow! We need to grab a few more bits of information to get started.</h1>
          <h3>Grab your payment info and let's get started</h3>
          <p>Insights that will change your business are a just a few clicks away</p>
        </div>
        <div className="form">
          <p className="label">TO GET STARTED ENTER YOUR BILLING INFORMATION BELOW</p>
        </div>
      </div>
    )
  }
}

//export default App;
