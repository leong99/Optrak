import React, {Component, Button} from 'react';
import Dropdown from 'react-dropdown';
import {firebaseApp} from '../firebase';
import 'react-dropdown/style.css';
import Web3 from 'web3';

const web3 = new Web3(Web3.givenProvider || "http://localhost:8545");
web3.eth.getAccounts().then(console.log);
web3.eth.getAccounts().then(e => {
    let anAcc = e[0];
    console.log
});


//console.log(accounts);
const optrakContract = new web3.eth.Contract([{"constant":true,"inputs":[{"name":"sharer","type":"string"},{"name":"metaName","type":"string"},{"name":"sharee","type":"string"}],"name":"getMetaDataAccess","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"provider","type":"string"},{"name":"pubkey","type":"string"}],"name":"addProvider","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[],"name":"renounceOwnership","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"provider","type":"string"},{"name":"index","type":"uint256"}],"name":"getMetaName","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"provider","type":"string"},{"name":"metaName","type":"string"}],"name":"getMetaData","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"owner","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"provider","type":"string"},{"name":"metaName","type":"string"},{"name":"content","type":"string"},{"name":"overwrite","type":"bool"}],"name":"addMetaData","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"provider","type":"string"}],"name":"getProviderPubkey","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"provider","type":"string"}],"name":"getProviderMetaCount","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"sharer","type":"string"},{"name":"metaName","type":"string"},{"name":"sharee","type":"string"},{"name":"access","type":"bool"}],"name":"updateMetaDataAccess","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"anonymous":false,"inputs":[{"indexed":true,"name":"previousOwner","type":"address"}],"name":"OwnershipRenounced","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"previousOwner","type":"address"},{"indexed":true,"name":"newOwner","type":"address"}],"name":"OwnershipTransferred","type":"event"}], "0x75dc83c6082c99acaf390da609cea97b6d2bc208");
//console.log(accounts[0]);
 

console.log(optrakContract.options); 

//console.log(optrakContract.methods.addProvider("John", "Juk").send());
//console.log(optrakContract.methods.getProviderPubkey("John").call());



 

const options = [
    'Provider', 'Patient'
];
const defaultOption = options[0];

class SignUp extends Component {

    constructor(props) {
        super(props);
        this.state = {
            pubkey: '' ,
            name: '',
            status: '',
            email: ''
        };
        this._onSelect = this._onSelect.bind(this);
    }
    signUp() {
        console.log("this.state", this.state);
    }
    _onSelect (option) {
        console.log('You selected ', option.label)
        this.setState({status: option.value})
      }

    render() {
        return (
        <div className="form-inline">
            <h2>Register for OpTrak</h2>
            <div className="form-group">
                
                <input className="form-control" type="text" placeholder="Email Address" onChange ={event => this.setState({email: event.target.value})}/>
                <input
                 className="form-control" 
                 type="password" 
                 placeholder="Public Key"
                 onChange={event => this.setState({pubkey: event.target.value})}/>
                <input 
                className="form-control" 
                type="text" 
                placeholder="Provider or Patient Name"
                onChange={event => this.setState({name: event.target.value})}/>
                <button className="btn btn-primary" 
                type="button"
                onClick={() => this.signUp()}
                > 
                Complete Registration
                </button>
            </div>
        </div>
        );
    }
}

export default SignUp;