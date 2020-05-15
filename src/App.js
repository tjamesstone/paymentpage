import React, { Component } from "react";
import "./App.css";
import { CountryDropdown, RegionDropdown } from "react-country-region-selector";
import axios from "axios";
import "react-credit-cards/es/styles-compiled.css";
import Cards from "react-credit-cards";

export default class App extends Component {
  //state
  constructor(props) {
    super(props);
    this.state = {
      companyName: "",
      firstName: "",
      lastName: "",
      email: "",
      country: "",
      region: "",
      address: "",
      city: "",
      postalCode: "",
      accountingEmail: "",
      sfdcAccountId: "0011N00001AGlTNQA1",
      sfdcOppId: "",
      ordwayId: "C-00040",
      growAccountId: "",
      paymentLink: "",
      billingContactId: "",
      buttonClicked: false,
      paymentType: "",
      ordwayAPI: {
        proxyUrl: "https://cors-anywhere.herokuapp.com/",
        headers: {
          "X-User-Email": "operations@grow.com",
          "X-User-Token": "CydMaaYo7FF61sLsswb1",
          "X-User-Company": "Grow",
        },
      },
      cvc: "",
      expiry: "",
      focus: "",
      name: "",
      number: "",
      cardType: "",
      routingNumber: "",
    };
  }

  //functions
  componentDidMount() {
    //check if there is an Ordway Account, if there is then
    this.getOrdwayAccount();
    //If there isn't then we need to create one using the information we have from the SF Account so first
    //getSFDCAccountDetails(sfdcAccountId);
    //then we need to create the ordway account
    //this.createOrdwayAccount();
    //make sure there is an Ordway Billing Account in SF, if there isn't, create one and give it the Ordway ID

    //check if there is a grow account, if there is then make sure the Ordway ID on there matches, if it doesnt, we need to set it so it does
    this.getGrowAccount();
    //if there isn't a grow account, then we need to create one here and give it the ORdway Id

    //once the customer presses Submit, we need to update any new business opps to the stage of "Propsoal Accepeted" and then alert the rep
    //if this link is being used not for a new deal, then fire off a notification that a new payment method has been added.
  }

  //API Functions

  getGrowAccount = () => {
    let headers = {
      apikey: "8f6116ba-06d1-46a1-9519-f887c5d6fca7",
      "Content-Type": "application/json",
    };
    let url =
      "https://app.gogrow.com/api/account/" +
      this.state.sfdcAccountId +
      "/salesforce";

    axios
      .get(this.state.ordwayAPI.proxyUrl + url, { headers })
      .then((res) => {
        this.setState({ growAccountId: res.data.id });
        console.log("Grow Account Id:" + res.data.id);
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  createGrowAccount = () => {
    //Do we want to provision the Grow Account here?
  };

  provisionGrowAccount = () => {
    //I don't know exactly how we want to do this. Since we are grabbing info from the Opp and the Account, we can just provision here
    //Or we could provision from an Apex Class in SF once the opp is marked as closed won (you tell me)
  };

  getOrdwayAccount = () => {
    let { proxyUrl, headers } = this.state.ordwayAPI;
    let url =
      "https://app.ordwaylabs.com/api/v1/customers/" +
      this.state.ordwayId +
      "/verbose";
    let billingContactId;
    axios
      .get(proxyUrl + url, { headers })
      .then((res) => {
        this.setState({
          companyName: res.data.name,
          paymentLink: res.data.update_payment_method_url,
          billingContactId: res.data.billing_contact_id,
        });
        billingContactId = res.data.billing_contact_id;
        this.getOrdwayBillingContact(billingContactId);
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  getOrdwayBillingContact = (billingContactId) => {
    let { proxyUrl, headers } = this.state.ordwayAPI;
    let { ordwayId } = this.state;
    let url =
      "https://app.ordwaylabs.com/api/v1/customers/" +
      ordwayId +
      "/contacts/" +
      billingContactId;
    axios
      .get(proxyUrl + url, { headers })
      .then((res) => {
        console.log(res.data);
        let {
          first_name,
          last_name,
          email,
          state,
          country,
          city,
          address1,
          zip,
          accounting_email,
        } = res.data;
        this.setState({
          firstName: first_name,
          lastName: last_name,
          email: email,
          country: country,
          region: state,
          city: city,
          address: address1,
          postalCode: zip,
          accountingEmail: accounting_email,
        });
        res.data.country === "United States"
          ? this.setState({ paymentType: "Bank Account" })
          : this.setState({ paymentType: "Credit Card" });
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  createOrdwayAccount = () => {
    let { proxyUrl, headers } = this.state.ordwayAPI;
    let url = "https://app.ordwaylabs.com/api/v1/customers";
    let body = {
      name: "companyName",
      payment_terms: "Due on receipt",
      status: "Active",
      balance: "0.0",
      tax_exempt: false,
      auto_pay: true,
      custom_fields: {
        salesforce_id: "sfdcAccountId",
      },
      payment_type: "Electronic",
      currency: "USD",
      payment_gateway_id: "",
      delivery_preferences: {
        print: true,
        email: true,
      },
    };

    axios
      .post(proxyUrl + url, body, { headers })
      .then((res) => {
        console.log(res.data);
      })
      .catch(function (error) {
        console.log(
          "axios failed to create customer account here is the errror:" + error
        );
      });
  };

  updateBillingInfo = () => {
    let {
      companyName,
      firstName,
      lastName,
      email,
      country,
      region,
      city,
      address,
      postalCode,
      accountingEmail,
      ordwayId,
      billingContactId,
    } = this.state;
    let { proxyUrl, headers } = this.state.ordwayAPI;
    let billingContactURL =
      "https://app.ordwaylabs.com/api/v1/customers/" +
      ordwayId +
      "/contacts/" +
      billingContactId;
    let ordwayAccountURL =
      "https://app.ordwaylabs.com/api/v1/customers/" + ordwayId;
    let createBillingContactURL =
      "https://app.ordwaylabs.com/api/v1/customers/" + ordwayId + "/contacts/";
    let billingContactAddBody = {
      customer_id: ordwayId,
      display_name: firstName + lastName,
      first_name: firstName,
      last_name: lastName,
      email: email,
      state: region,
      country: country,
      city: city,
      address1: address,
      zip: postalCode,
      accounting_email: accountingEmail,
    };
    let billingContactUpdateBody = {
      display_name: firstName + " " + lastName,
      first_name: firstName,
      last_name: lastName,
      email: email,
      state: region,
      country: country,
      city: city,
      address1: address,
      zip: postalCode,
      accounting_email: accountingEmail,
    };
    let ordwayAccountUpdateBody = {
      billing_contact_id: billingContactId,
      name: companyName,
      shipping_contact_id: billingContactId,
    };

    //Update Ordway Account
    axios
      .put(proxyUrl + ordwayAccountURL, ordwayAccountUpdateBody, { headers })
      .then((res) => {
        res.status === 200
          ? console.log("Update to Ordway Account complete")
          : console.log("Didn't update Ordway Account right");
        console.log(res.data);
        if (billingContactId === "") {
          //Add Billing Contact
          axios
            .put(proxyUrl + createBillingContactURL, billingContactAddBody, {
              headers,
            })
            .then((res) => {
              res.status === 200
                ? console.log("Billing Contact sucessfully added")
                : console.log("Didn't add billing contact right");
              console.log("Ordway Contact Data:");
              console.log(res.data);
            })
            .catch(function (error) {
              console.log("Didnt add primary billing contact:" + error);
            });
        } else if (billingContactId !== "") {
          //Update Billing Contact
          axios
            .put(proxyUrl + billingContactURL, billingContactUpdateBody, {
              headers,
            })
            .then((res) => {
              res.status === 200
                ? console.log("Update to Billing Contact complete")
                : console.log("Didn't update billing account right");
              console.log("Ordway Account Data:");
              console.log(res.data);
            })
            .catch(function (error) {
              console.log("Didnt set primary billing contact:" + error);
            });
        }
      })
      .catch(function (error) {
        console.log("Didnt set primary billing contact:" + error);
      });
  };

  addPaymentInfo = () => {
    let {
      paymentType,
      cardType,
      name,
      number,
      expiry,
      routingNumber,
      country,
      ordwayId,
    } = this.state;
    let { proxyUrl, headers } = this.state.ordwayAPI;
    let addPaymentURL =
      "https://app.ordwaylabs.com/api/v1/customers/" +
      ordwayId +
      "/payment_methods";
    let creditCardBody = {
      customer_id: ordwayId,
      payment_type: paymentType,
      type: cardType,
      account_number: number,
      account_holder_name: name,
      country: country,
      expiry: expiry,
      default: true,
    };
    let bankAccountBody = {
      customer_id: ordwayId,
      payment_type: paymentType,
      account_number: number,
      account_holder_name: name,
      country: country,
      status: "Unverified",
      routing_number: routingNumber,
      default: true,
    };

    if (paymentType === "Credit Card") {
      axios
        .post(proxyUrl + addPaymentURL, creditCardBody, { headers })
        .then((res) => {
          res.status === 200
            ? console.log("Credit Card Added")
            : console.log("Didn't add credit card right");
          console.log("Ordway Payment Data:");
          console.log(res.data);
        })
        .catch(function (error) {
          console.log("Didnt add Credit Card:" + error);
        });
    } else if (paymentType === "Bank Account") {
      axios
        .post(proxyUrl + addPaymentURL, bankAccountBody, { headers })
        .then((res) => {
          res.status === 200
            ? console.log("Bank Account Added")
            : console.log("Didn't add bank account right");
          console.log("Ordway Payment Data:");
          console.log(res.data);
        })
        .catch(function (error) {
          console.log("Didnt add Bank Account:" + error);
        });
    }
  };

  getSFDCAccountDetails = (sfdcAccountId) => {};

  updateSFDCOppDetails = () => {};

  //Country/Region Validation Functions
  selectCountry(val) {
    this.setState({ country: val });
    val === "United States"
      ? this.setState({ paymentType: "Bank Account" })
      : this.setState({ paymentType: "Credit Card" });
  }

  selectRegion = (val) => this.setState({ region: val });

  //Handle Change
  handleChange = (key, e) => this.setState({ [key]: e.target.value });

  //Payment Info Functions
  handleInputFocus = (e) => this.setState({ focus: e.target.name });
  handleInputChange = (e) => {
    const { name, value } = e.target;
    this.setState({ [name]: value });
  };

  render() {
    const { country, region, paymentType } = this.state;

    let option1;
    let option2;

    if (country === "United States") {
      option1 = <option value={"Bank Account"}>Bank Account</option>;
      option2 = <option value={"Credit Card"}>Credit Card</option>;
    } else {
      option1 = <option value={"Credit Card"}>Credit Card</option>;
    }

    let paymentForm;
    let paymentSelectionYesOrNo;
    let paymentTypeSelection = (
      <div className="paymentselectorcontainor">
        <label className="paymenttypelabel" htmlFor="paymentType">
          PaymentType
        </label>
        <select
          value={this.state.value}
          onChange={(e) => this.handleChange("paymentType", e)}
          className="paymenttype"
          name="PaymentType"
          id="paymentType"
        >
          {option1}
          {option2}
        </select>
      </div>
    );

    let noPaymentTypeSelection;

    if (country === "United States") {
      paymentSelectionYesOrNo = paymentTypeSelection;
    } else {
      paymentSelectionYesOrNo = noPaymentTypeSelection;
    }

    let creditCardForm = (
      <div className="PaymentForm" id="PaymentForm">
        <Cards
          cvc={this.state.cvc}
          expiry={this.state.expiry}
          focused={this.state.focus}
          name={this.state.name}
          number={this.state.number}
        />
        <form className="CreditCardForm">
          <input
            className="creditcardinput"
            type="tel"
            name="number"
            placeholder="Card Number"
            onChange={this.handleInputChange}
            onFocus={this.handleInputFocus}
          />
          <input
            className="creditcardinput"
            type="text"
            name="name"
            placeholder="Name"
            onChange={this.handleInputChange}
            onFocus={this.handleInputFocus}
          />
          <input
            className="creditcardinput"
            type="tel"
            name="expiry"
            placeholder="Valid Thru"
            onChange={this.handleInputChange}
            onFocus={this.handleInputFocus}
            maxLength="5"
          />
          <input
            className="creditcardinput"
            type="tel"
            name="cvc"
            placeholder="CVC"
            maxLength="4"
            onChange={this.handleInputChange}
            onFocus={this.handleInputFocus}
          ></input>
        </form>
      </div>
    );
    let achForm = (
      <div className="PaymentForm" id="PaymentForm">
        <div className="paymenttypeselector"></div>
        <form className="CreditCardForm">
          <input
            className="achinput"
            type="number"
            name="number"
            placeholder="Account Number"
            onChange={this.handleInputChange}
            onFocus={this.handleInputFocus}
          />
          <input
            className="achinput"
            type="text"
            name="name"
            placeholder="Account Holder Name"
            onChange={this.handleInputChange}
            onFocus={this.handleInputFocus}
          />
          <input
            className="achinput"
            type="number"
            name="routingNumber"
            placeholder="Routing Number"
            onChange={this.handleInputChange}
            onFocus={this.handleInputFocus}
          />
          <input
            className="achinput"
            type="number"
            name="routingNumber"
            placeholder="Confirm Routing Number"
            onChange={this.handleInputChange}
            onFocus={this.handleInputFocus}
          ></input>
        </form>
      </div>
    );
    if (paymentType === "Bank Account") {
      paymentForm = achForm;
    } else if (paymentType === "Credit Card") {
      paymentForm = creditCardForm;
    }

    return (
      <div className="App">
        <div className="forms">
          <div className="form">
            <p className="label">COMPANY INFO</p>
            <div className="formcolumn">
              <div className="input">
                <p>Company Name</p>
                <input
                  className="infoinput"
                  type="text"
                  onChange={(e) => this.handleChange("companyName", e)}
                  value={this.state.companyName}
                />
              </div>

              <div className="input">
                <p>Accounting Department Email</p>
                <input
                  className="infoinput"
                  type="text"
                  onChange={(e) => this.handleChange("accountingEmail", e)}
                  value={this.state.accountingEmail}
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
                  className="infoinput"
                  type="text"
                  onChange={(e) => this.handleChange("address", e)}
                  value={this.state.address}
                />
              </div>

              <div className="input">
                <p>City</p>
                <input
                  className="infoinput"
                  type="text"
                  onChange={(e) => this.handleChange("city", e)}
                  value={this.state.city}
                />
              </div>

              <div className="input">
                <p>Postal Code</p>
                <input
                  className="infoinput"
                  type="text"
                  onChange={(e) => this.handleChange("postalCode", e)}
                  value={this.state.postalCode}
                />
              </div>
            </div>
          </div>

          <div className="form">
            <p className="label">BILL TO CONTACT INFO</p>
            <div className="formcolumn">
              <div className="input">
                <p>First Name</p>
                <input
                  className="infoinput"
                  type="text"
                  onChange={(e) => this.handleChange("firstName", e)}
                  value={this.state.firstName}
                />
              </div>

              <div className="input">
                <p>Last Name</p>
                <input
                  className="infoinput"
                  type="text"
                  onChange={(e) => this.handleChange("lastName", e)}
                  value={this.state.lastName}
                />
              </div>

              <div className="input">
                <p>Email</p>
                <input
                  className="infoinput"
                  type="text"
                  onChange={(e) => this.handleChange("email", e)}
                  value={this.state.email}
                />
              </div>
            </div>
            <p className="label">PAYMENT INFO</p>

            <div className="formcolumn">
              {paymentSelectionYesOrNo}
              {paymentForm}
            </div>
          </div>
        </div>
        <button onClick={this.updateBillingInfo} className="continuetopayment">
          Submit
        </button>
      </div>
    );
  }
}
