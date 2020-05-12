import React, {Component} from 'react';
import './App.css';
import { CountryDropdown, RegionDropdown } from 'react-country-region-selector';
import blackComputer from './blackcomputer.png'


export default class App extends Component {
  //state
  constructor(props){
    super(props);
    this.state = {
      companyName: '',
      firstName: '',
      lastName: '',
      email: '',
      country: '',
      region: '',
      address: '',
      city: '',
      postalCode: ''
    };
  }
 

  //functions
  selectCountry (val) {
    this.setState({ country: val });
  }
 
  selectRegion (val) {
    this.setState({ region: val });
  }



  render(){
    const {country, region} = this.state
    return (
      <div className="App">
        <div className="info">
          <h1>Congrats on signing with Grow!</h1>
          <h3>Grab your payment info and let's get started</h3>
          <p>Insights that will change your business are a just a few clicks away</p>
          <img src={blackComputer} alt="BI Dashboard"/>
        </div>


        
        <div className="form">
          <p className="label">TO GET STARTED ENTER YOUR BILLING INFORMATION BELOW</p>
          <div className="formcolumn">
            <div className="input">
              <p>Company Name</p>
              <input type="text"/>
            </div>

            <div className="input">
              <p>First Name</p>
              <input type="text"/>
            </div>

            <div className="input">
              <p>Last Name</p>
              <input type="text"/>
            </div>

            <div className="input">
              <p>Email</p>
              <input type="email"/>
            </div>

            <div className="input">
              <p>Country</p>
              <CountryDropdown
                value={country}
                onChange={(val) => this.selectCountry(val)} 
              />
            </div>

            <div className="input">
              <p>State/Province</p>
              <RegionDropdown
                country={country}
                value={region}
                onChange={(val) => this.selectRegion(val)} 
              />
            </div>

            <div className="input">
              <p>Address</p>
              <input type="text"/>
            </div>

            <div className="input">
              <p>City</p>
              <input type="text"/>
            </div>

            <div className="input">
              <p>Postal Code</p>
              <input type="text"/>
            </div>

            <button className="continuetopayment">Continue To Payment</button>
          </div>
        </div>
      </div>
    )
  }
}

//export default App;
