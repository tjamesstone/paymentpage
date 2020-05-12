import React, {Component} from 'react';
import './App.css';
import { CountryDropdown, RegionDropdown } from 'react-country-region-selector';
import blackComputer from './blackcomputer.png'
import axios from 'axios';


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
      postalCode: '',
      sfdcAccountId: '',
      ordwayId: 'C-00040',
      paymentLink: ''
    };
  }
 

  //functions
  componentDidMount(){
    this.fetchOrdwayRedirectUrl();
  }

  selectCountry (val) {
    this.setState({ country: val });
  }
 
  selectRegion (val) {
    this.setState({ region: val });
  }

  handleChange(key, e){
    this.setState({
        [key]: e.target.value
    })
    console.log(this.state)
}

fetchOrdwayRedirectUrl = ordwayId => {
  let proxyurl = "https://cors-anywhere.herokuapp.com/";
  let url = 'https://app.ordwaylabs.com/api/v1/customers/' + this.state.ordwayId + '/verbose'
  let headers = {'X-User-Email': 'operations@grow.com', 'X-User-Token': 'CydMaaYo7FF61sLsswb1', 'X-User-Company':'Grow'}
  
  axios.get(proxyurl + url, {headers}).then( res =>{
    console.log(res.data.pay_now_url)
    let ordwayPaymentLink = res.data.pay_now_url
    this.setState({paymentLink: ordwayPaymentLink})
    console.log(this.state)
  })
  .catch(function(error){
    console.log(error)
  })
}



  render(){
    const {country, region} = this.state
    return (
      <div className="App">
        <div className="info">
          <h1>Congrats on signing with Grow!</h1>
          <h3>Grab your payment info and let's get started</h3>
          <p>Insights that will change your business are a just a few clicks away</p>
          <img className="blackcomputer" src={blackComputer} alt="BI Dashboard"/>
        </div>


        
        <div className="form">
          <p className="label">TO GET STARTED ENTER YOUR BILLING INFORMATION BELOW</p>
          <div className="formcolumn">
            <div className="input">
              <p>Company Name</p>
              <input 
              type="text"
              onChange={(e) => this.handleChange('companyName', e)}
              value={this.state.companyName}
              />
              
            </div>

            <div className="input">
              <p>First Name</p>
              <input 
              type="text"
              onChange={(e) => this.handleChange('firstName', e)}
              value={this.state.firstName}
              />            
              </div>

            <div className="input">
              <p>Last Name</p>
              <input 
              type="text"
              onChange={(e) => this.handleChange('lastName', e)}
              value={this.state.lastName}
              /> 
            </div>

            <div className="input">
              <p>Email</p>
              <input 
              type="text"
              onChange={(e) => this.handleChange('email', e)}
              value={this.state.email}
              /> 
            </div>

            <div className="input">
              <p>Country</p>
              <CountryDropdown
                className="CountryDropdown"
                value={country}
                onChange={(val) => this.selectCountry(val)} 
              />
            </div>

            <div className="input">
              <p>State/Province</p>
              <RegionDropdown
                country={country}
                className="RegionDropdown"
                value={region}
                onChange={(val) => this.selectRegion(val)} 
              />
            </div>

            <div className="input">
              <p>Address</p>
              <input 
              type="text"
              onChange={(e) => this.handleChange('address', e)}
              value={this.state.address}
              /> 
            </div>

            <div className="input">
              <p>City</p>
              <input 
              type="text"
              onChange={(e) => this.handleChange('city', e)}
              value={this.state.city}
              /> 
            </div>

            <div className="input">
              <p>Postal Code</p>
              <input 
              type="text"
              onChange={(e) => this.handleChange('postalCode', e)}
              value={this.state.postalCode}
              /> 
            </div>

            <button className="continuetopayment">Continue To Payment</button>
          </div>
        </div>
      </div>
    )
  }
}

//export default App;
