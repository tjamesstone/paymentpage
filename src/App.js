import React, {Component} from 'react';
import './App.css';
import { CountryDropdown, RegionDropdown } from 'react-country-region-selector';
import axios from 'axios';
import 'react-credit-cards/es/styles-compiled.css';
import Cards from 'react-credit-cards';





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
      buttonClicked: false,
      paymentType: '',
      ordwayAPI: {
        proxyUrl: "https://cors-anywhere.herokuapp.com/",
        headers: {'X-User-Email': 'operations@grow.com', 'X-User-Token': 'CydMaaYo7FF61sLsswb1', 'X-User-Company':'Grow'},
      },
      cvc: '',
      expiry: '',
      focus: '',
      name: '',
      number: '',
    };
  }
 

  //functions
componentDidMount(){
    //getSFDCAccountDetails(sfdcAccountId);
    //create billing account? 
    this.fetchOrdwayRedirectUrl();
  }

//API Functions

getSFDCAccountDetails = sfdcAccountId => {

  }

fetchOrdwayRedirectUrl = ordwayId => {
    let {proxyUrl, headers} = this.state.ordwayAPI
    let url = 'https://app.ordwaylabs.com/api/v1/customers/' + this.state.ordwayId + '/verbose'
    
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
  let {proxyUrl, headers} = this.state.ordwayAPI
  let url = "https://app.ordwaylabs.com/api/v1/customers/" + this.state.ordwayId + "/contacts"
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
  this.goBack();
  }

  setPrimaryBillingContact = () => {
    let {proxyUrl, headers} = this.state.ordwayAPI
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

createOrdwayAccount = (companyName, sfdcAccountId) => {
    let {proxyUrl, headers} = this.state.ordwayAPI
    let url = "https://app.ordwaylabs.com/api/v1/customers";
    let body = {
      "name": companyName,
      "payment_terms": "Due on receipt",
      "status": "Active",
      "balance": "0.0",
      "tax_exempt": false,
      "auto_pay": true,
      "custom_fields": {
        "salesforce_id": sfdcAccountId
      },
      "payment_type": "Electronic",
      "currency": "USD",
      "payment_gateway_id": "",
      "delivery_preferences": {
        "print": true,
        "email": true
      }
    };

    axios.post(proxyUrl+url, body, {headers}).then( res => {
      console.log(res.data)
    })
    .catch(function(error){
      console.log('axios failed to create customer account here is the errror:' + error)
    })
  }

selectCountry (val) {
    this.setState({ country: val });
    if(val === "United States"){
      this.setState({paymentType: "Bank Account"})
    } else{
      this.setState({paymentType: "Credit Card"})
    }
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
goBack = () => {
  this.setState({buttonClicked: !this.state.buttonClicked})
  console.log(this.state)
}

//Card Functions
handleInputFocus = (e) => {
  this.setState({ focus: e.target.name });
}

handleInputChange = (e) => {
  const { name, value } = e.target;
  
  this.setState({ [name]: value });
}






  render(){
    const {paymentType, country, region, buttonClicked} = this.state
    let option1;
    let option2;
    if(country === "United States"){
      option1 = <option value={"Bank Account"}>Bank Account</option>;
      option2 = <option value={"Credit Card"}>Credit Card</option>;
    } else {
      option1 = <option value={"Credit Card"}>Credit Card</option>;
    }

    let paymentForm;
    if(paymentType === "Credit Card"){
      paymentForm = 
      <div className="creditcardfrom">
        <p>Credit Card Form Here</p>
      </div>
    } else if(paymentType === "Bank Account"){
      paymentForm = 
      <div className="achform">
        <p>ACH Form Here </p>
      </div>
    }

      return (
        <div className="App">
          
          <div className="form">
          <p className="label">TO GET STARTED ENTER YOUR BILLING INFORMATION BELOW</p>
            <div className="formcolumn">
            <p className="label">Company Info</p>
              <div className="input">
                <p>Company Name</p>
                <input 
                className="infoinput"
                type="text"
                onChange={(e) => this.handleChange('companyName', e)}
                value={this.state.companyName}
                />
                
              </div>

              <div className="input">
                <p>Accounting Department Email</p>
                <input 
                className="infoinput"
                type="text"
                onChange={(e) => this.handleChange('email', e)}
                value={this.state.email}
                /> 
              </div>
              <p className="label">Bill To Address</p>
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
                className="infoinput"
                type="text"
                onChange={(e) => this.handleChange('address', e)}
                value={this.state.address}
                /> 
              </div>
  
              <div className="input">
                <p>City</p>
                <input                 
                className="infoinput"
                type="text"
                onChange={(e) => this.handleChange('city', e)}
                value={this.state.city}
                /> 
              </div>
  
              <div className="input">
                <p>Postal Code</p>
                <input                 
                className="infoinput"
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
  
  
          
          <div className="form">
            <p className="label">TO GET STARTED ENTER YOUR BILLING INFORMATION BELOW</p>
            <div className="formcolumn">
            <p className="label">Bill To Contact</p>
  
              <div className="input">
                <p>First Name</p>
                <input 
                className="infoinput"
                type="text"
                onChange={(e) => this.handleChange('firstName', e)}
                value={this.state.firstName}
                />            
                </div>
  
              <div className="input">
                <p>Last Name</p>
                <input                 
                className="infoinput"
                type="text"
                onChange={(e) => this.handleChange('lastName', e)}
                value={this.state.lastName}
                /> 
              </div>
  
              <div className="input">
                <p>Email</p>
                <input                 
                className="infoinput"
                type="text"
                onChange={(e) => this.handleChange('email', e)}
                value={this.state.email}
                /> 
              </div>
  
              
  
              <button 
              onClick={this.createBillingContactInOrdwayAndUpdateBillingAddress}
              className="continuetopayment">Continue To Payment</button>
            </div>
            <div id="PaymentForm">
                    <Cards
                      cvc={this.state.cvc}
                      expiry={this.state.expiry}
                      focused={this.state.focus}
                      name={this.state.name}
                      number={this.state.number}
                    />
                    <form className="CreditCardForm">
                      <input
                        type="tel"
                        name="number"
                        placeholder="Card Number"
                        onChange={this.handleInputChange}
                        onFocus={this.handleInputFocus}
                      />
                      <input
                        type="text"
                        name="name"
                        placeholder="Name"
                        onChange={this.handleInputChange}
                        onFocus={this.handleInputFocus}
                      />
                      <input 
                        type="tel" 
                        name="expiry" 
                        placeholder="Valid Thru"
                        onChange={this.handleInputChange}
                        onFocus={this.handleInputFocus}
                        />
                        <input type="tel" name="cvc" placeholder="CVC" onChange={this.handleInputChange}
                        onFocus={this.handleInputFocus}></input>
                    </form>
                  </div>
           
          </div>
          
        </div>
      )
  }
}

//export default App;
