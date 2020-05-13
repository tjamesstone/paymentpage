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
      paymentLink: '',
      billingContactId: '',
      buttonClicked: false
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
}
goBack = () => {
  this.setState({buttonClicked: false})
}

fetchOrdwayRedirectUrl = ordwayId => {
  let proxyUrl = "https://cors-anywhere.herokuapp.com/";
  let url = 'https://app.ordwaylabs.com/api/v1/customers/' + this.state.ordwayId + '/verbose'
  let headers = {'X-User-Email': 'operations@grow.com', 'X-User-Token': 'CydMaaYo7FF61sLsswb1', 'X-User-Company':'Grow'}
  
  axios.get(proxyUrl + url, {headers}).then( res =>{
    console.log(res.data.pay_now_url)
    let ordwayPaymentLink = res.data.pay_now_url
    this.setState({paymentLink: ordwayPaymentLink})
    console.log(this.state)
  })
  .catch(function(error){
    console.log(error)
  })
}

createBillingContactInOrdwayAndUpdateBillingAddress= () => {
  //this.setState({buttonClicked: true})
//make sure all fields are filled out


//post billing contact info to ordway
let proxyUrl = "https://cors-anywhere.herokuapp.com/";
let url = "https://app.ordwaylabs.com/api/v1/customers/" + this.state.ordwayId + "/contacts"
let headers = {'X-User-Email': 'operations@grow.com', 'X-User-Token': 'CydMaaYo7FF61sLsswb1', 'X-User-Company':'Grow'}
let body = {
  "customer_id": this.state.ordwayId,
  "first_name": this.state.firstName,
  "last_name": this.state.lastName,
  "email": this.state.email,
  "address1": this.state.address,
  "city": this.state.city,
  "state": this.state.region,
  "zip": this.state.postalCode,
  "country": this.state.country
}

axios.post(proxyUrl+url, body, {headers}).then( res => {
  this.setState({billingContactId: res.data.id})
  if(this.state.billingContactId === res.data.id){this.setPrimaryBillingContact();}
})
.catch(function(error){
  console.log('axios post failed here is the errror:' + error)
})
//redirect to enter payment
//window.location = this.state.paymentLink
}

setPrimaryBillingContact = () => {
let headers = {'X-User-Email': 'operations@grow.com', 'X-User-Token': 'CydMaaYo7FF61sLsswb1', 'X-User-Company':'Grow'}
let proxyUrl = "https://cors-anywhere.herokuapp.com/";
let updateAccountUrl = 'https://app.ordwaylabs.com/api/v1/customers/' + this.state.ordwayId;
let billingContactId = this.state.billingContactId;
let updateAccountBody = {"billing_contact_id": billingContactId}

axios.put(proxyUrl+updateAccountUrl, updateAccountBody, {headers}).then(res=>{
  this.state.billingContactId === res.data.billing_contact_id ? console.log('Billing Contact successfully set') : console.log('Billing Contact did not successfully set')
})
.catch(function(error){
  console.log('Didnt set primary billing contact')
})
}




  render(){
    const {country, region, buttonClicked} = this.state

    if(buttonClicked === false){
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
  
              <button 
              onClick={this.createBillingContactInOrdwayAndUpdateBillingAddress}
              className="continuetopayment">Continue To Payment</button>
            </div>
          </div>
        </div>
      )
    } else if(buttonClicked === true){
      return(
        <div className="App">
          <div className="iframecontainer">
            <iframe scrolling="yes" title="Payment Page" src={this.state.paymentLink}></iframe>

            <button onClick={this.goBack} >Back</button>
          </div>
        </div>
      )
    }

    
  }
}

//export default App;
