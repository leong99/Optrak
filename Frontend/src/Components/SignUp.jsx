import React, { Component } from 'react';
import Dropdown from 'react-dropdown';
import { firebaseApp, optrakUserRef } from '../firebase';
import 'react-dropdown/style.css';
import { Link, BrowserRouter, Route } from 'react-router-dom';
import { DropdownButton, MenuItem, Form, FormGroup, FormControl, ControlLabel, Button } from 'react-bootstrap';
import Web3 from 'web3';

const web3 = new Web3(Web3.givenProvider || "http://localhost:8545");
const contract = web3.eth.getAccounts().then(e => {
    const optrakContract = new web3.eth.Contract([{ "constant": true, "inputs": [{ "name": "sharer", "type": "string" }, { "name": "metaName", "type": "string" }, { "name": "sharee", "type": "string" }], "name": "getMetaDataAccess", "outputs": [{ "name": "", "type": "bool" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [], "name": "renounceOwnership", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [{ "name": "provider", "type": "string" }, { "name": "index", "type": "uint256" }], "name": "getMetaName", "outputs": [{ "name": "", "type": "string" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [{ "name": "provider", "type": "string" }, { "name": "metaName", "type": "string" }], "name": "getMetaData", "outputs": [{ "name": "", "type": "string" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [{ "name": "provider", "type": "string" }, { "name": "pubkey", "type": "string" }, { "name": "provStatus", "type": "bool" }], "name": "addProvider", "outputs": [{ "name": "", "type": "bool" }], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [], "name": "owner", "outputs": [{ "name": "", "type": "address" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [{ "name": "provider", "type": "string" }, { "name": "metaName", "type": "string" }, { "name": "content", "type": "string" }, { "name": "overwrite", "type": "bool" }], "name": "addMetaData", "outputs": [{ "name": "", "type": "bool" }], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [{ "name": "provider", "type": "string" }], "name": "getProviderPubkey", "outputs": [{ "name": "", "type": "string" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [{ "name": "provider", "type": "string" }], "name": "getProviderMetaCount", "outputs": [{ "name": "", "type": "uint256" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [{ "name": "newOwner", "type": "address" }], "name": "transferOwnership", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [{ "name": "sharer", "type": "string" }, { "name": "metaName", "type": "string" }, { "name": "sharee", "type": "string" }, { "name": "access", "type": "bool" }], "name": "updateMetaDataAccess", "outputs": [{ "name": "", "type": "bool" }], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "anonymous": false, "inputs": [{ "indexed": true, "name": "previousOwner", "type": "address" }], "name": "OwnershipRenounced", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "name": "previousOwner", "type": "address" }, { "indexed": true, "name": "newOwner", "type": "address" }], "name": "OwnershipTransferred", "type": "event" }], "0xd41e5da3c25047256fe8603b745f82d891ffaab6", {
        from: e[0],
        data: '0x6080604052336000806101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff160217905550611b34806100536000396000f3006080604052600436106100af576000357c0100000000000000000000000000000000000000000000000000000000900463ffffffff168063276422c6146100b4578063715018a6146101c157806372416e01146101d85780637f51b99e146102c45780638bd62a2d146103ec5780638da5cb5b146104bf5780639fef492c14610516578063c2ca843c1461062f578063e647f70614610711578063f2fde38b1461078e578063f337d51b146107d1575b600080fd5b3480156100c057600080fd5b506101a7600480360381019080803590602001908201803590602001908080601f0160208091040260200160405190810160405280939291908181526020018383808284378201915050505050509192919290803590602001908201803590602001908080601f0160208091040260200160405190810160405280939291908181526020018383808284378201915050505050509192919290803590602001908201803590602001908080601f01602080910402602001604051908101604052809392919081815260200183838082843782019150505050505091929192905050506108ea565b604051808215151515815260200191505060405180910390f35b3480156101cd57600080fd5b506101d6610a40565b005b3480156101e457600080fd5b50610249600480360381019080803590602001908201803590602001908080601f016020809104026020016040519081016040528093929190818152602001838380828437820191505050505050919291929080359060200190929190505050610b42565b6040518080602001828103825283818151815260200191508051906020019080838360005b8381101561028957808201518184015260208101905061026e565b50505050905090810190601f1680156102b65780820380516001836020036101000a031916815260200191505b509250505060405180910390f35b3480156102d057600080fd5b50610371600480360381019080803590602001908201803590602001908080601f0160208091040260200160405190810160405280939291908181526020018383808284378201915050505050509192919290803590602001908201803590602001908080601f0160208091040260200160405190810160405280939291908181526020018383808284378201915050505050509192919290505050610c61565b6040518080602001828103825283818151815260200191508051906020019080838360005b838110156103b1578082015181840152602081019050610396565b50505050905090810190601f1680156103de5780820380516001836020036101000a031916815260200191505b509250505060405180910390f35b3480156103f857600080fd5b506104a5600480360381019080803590602001908201803590602001908080601f0160208091040260200160405190810160405280939291908181526020018383808284378201915050505050509192919290803590602001908201803590602001908080601f0160208091040260200160405190810160405280939291908181526020018383808284378201915050505050509192919290803515159060200190929190505050610dd8565b604051808215151515815260200191505060405180910390f35b3480156104cb57600080fd5b506104d461103f565b604051808273ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200191505060405180910390f35b34801561052257600080fd5b50610615600480360381019080803590602001908201803590602001908080601f0160208091040260200160405190810160405280939291908181526020018383808284378201915050505050509192919290803590602001908201803590602001908080601f0160208091040260200160405190810160405280939291908181526020018383808284378201915050505050509192919290803590602001908201803590602001908080601f0160208091040260200160405190810160405280939291908181526020018383808284378201915050505050509192919290803515159060200190929190505050611064565b604051808215151515815260200191505060405180910390f35b34801561063b57600080fd5b50610696600480360381019080803590602001908201803590602001908080601f01602080910402602001604051908101604052809392919081815260200183838082843782019150505050505091929192905050506115ab565b6040518080602001828103825283818151815260200191508051906020019080838360005b838110156106d65780820151818401526020810190506106bb565b50505050905090810190601f1680156107035780820380516001836020036101000a031916815260200191505b509250505060405180910390f35b34801561071d57600080fd5b50610778600480360381019080803590602001908201803590602001908080601f01602080910402602001604051908101604052809392919081815260200183838082843782019150505050505091929192905050506116b8565b6040518082815260200191505060405180910390f35b34801561079a57600080fd5b506107cf600480360381019080803573ffffffffffffffffffffffffffffffffffffffff16906020019092919050505061172d565b005b3480156107dd57600080fd5b506108d0600480360381019080803590602001908201803590602001908080601f0160208091040260200160405190810160405280939291908181526020018383808284378201915050505050509192919290803590602001908201803590602001908080601f0160208091040260200160405190810160405280939291908181526020018383808284378201915050505050509192919290803590602001908201803590602001908080601f0160208091040260200160405190810160405280939291908181526020018383808284378201915050505050509192919290803515159060200190929190505050611882565b604051808215151515815260200191505060405180910390f35b60006006846040518082805190602001908083835b60208310151561092457805182526020820191506020810190506020830392506108ff565b6001836020036101000a0380198251168184511680821785525050505050509050019150509081526020016040518091039020836040518082805190602001908083835b60208310151561098d5780518252602082019150602081019050602083039250610968565b6001836020036101000a0380198251168184511680821785525050505050509050019150509081526020016040518091039020826040518082805190602001908083835b6020831015156109f657805182526020820191506020810190506020830392506109d1565b6001836020036101000a038019825116818451168082178552505050505050905001915050908152602001604051809103902060009054906101000a900460ff1690509392505050565b6000809054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff16141515610a9b57600080fd5b6000809054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff167ff8df31144d9c2f0f6b59d69b8b98abd5459d07f2742c4df920b25aae33c6482060405160405180910390a260008060006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff160217905550565b60606005836040518082805190602001908083835b602083101515610b7c5780518252602082019150602081019050602083039250610b57565b6001836020036101000a038019825116818451168082178552505050505050905001915050908152602001604051809103902060008381526020019081526020016000208054600181600116156101000203166002900480601f016020809104026020016040519081016040528092919081815260200182805460018160011615610100020316600290048015610c545780601f10610c2957610100808354040283529160200191610c54565b820191906000526020600020905b815481529060010190602001808311610c3757829003601f168201915b5050505050905092915050565b60606003836040518082805190602001908083835b602083101515610c9b5780518252602082019150602081019050602083039250610c76565b6001836020036101000a0380198251168184511680821785525050505050509050019150509081526020016040518091039020826040518082805190602001908083835b602083101515610d045780518252602082019150602081019050602083039250610cdf565b6001836020036101000a03801982511681845116808217855250505050505090500191505090815260200160405180910390208054600181600116156101000203166002900480601f016020809104026020016040519081016040528092919081815260200182805460018160011615610100020316600290048015610dcb5780601f10610da057610100808354040283529160200191610dcb565b820191906000526020600020905b815481529060010190602001808311610dae57829003601f168201915b5050505050905092915050565b60008060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff16141515610e3557600080fd5b60006001856040518082805190602001908083835b602083101515610e6f5780518252602082019150602081019050602083039250610e4a565b6001836020036101000a038019825116818451168082178552505050505050905001915050908152602001604051809103902080546001816001161561010002031660029004905011151561103357826001856040518082805190602001908083835b602083101515610ef75780518252602082019150602081019050602083039250610ed2565b6001836020036101000a03801982511681845116808217855250505050505090500191505090815260200160405180910390209080519060200190610f3d929190611a63565b50816002856040518082805190602001908083835b602083101515610f775780518252602082019150602081019050602083039250610f52565b6001836020036101000a0380198251168184511680821785525050505050509050019150509081526020016040518091039020846040518082805190602001908083835b602083101515610fe05780518252602082019150602081019050602083039250610fbb565b6001836020036101000a038019825116818451168082178552505050505050905001915050908152602001604051809103902060006101000a81548160ff02191690831515021790555060019050611038565b600090505b9392505050565b6000809054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b600060606000809054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff161415156110c357600080fd5b6003866040518082805190602001908083835b6020831015156110fb57805182526020820191506020810190506020830392506110d6565b6001836020036101000a0380198251168184511680821785525050505050509050019150509081526020016040518091039020856040518082805190602001908083835b602083101515611164578051825260208201915060208101905060208303925061113f565b6001836020036101000a03801982511681845116808217855250505050505090500191505090815260200160405180910390208054600181600116156101000203166002900480601f01602080910402602001604051908101604052809291908181526020018280546001816001161561010002031660029004801561122b5780601f106112005761010080835404028352916020019161122b565b820191906000526020600020905b81548152906001019060200180831161120e57829003601f168201915b5050505050905060008151141561149f57846005876040518082805190602001908083835b6020831015156112755780518252602082019150602081019050602083039250611250565b6001836020036101000a038019825116818451168082178552505050505050905001915050908152602001604051809103902060006004896040518082805190602001908083835b6020831015156112e257805182526020820191506020810190506020830392506112bd565b6001836020036101000a03801982511681845116808217855250505050505090500191505090815260200160405180910390205481526020019081526020016000209080519060200190611337929190611a63565b50836003876040518082805190602001908083835b602083101515611371578051825260208201915060208101905060208303925061134c565b6001836020036101000a0380198251168184511680821785525050505050509050019150509081526020016040518091039020866040518082805190602001908083835b6020831015156113da57805182526020820191506020810190506020830392506113b5565b6001836020036101000a03801982511681845116808217855250505050505090500191505090815260200160405180910390209080519060200190611420929190611a63565b506004866040518082805190602001908083835b6020831015156114595780518252602082019150602081019050602083039250611434565b6001836020036101000a0380198251168184511680821785525050505050509050019150509081526020016040518091039020600081546001019190508190555061159d565b821561159357836003876040518082805190602001908083835b6020831015156114de57805182526020820191506020810190506020830392506114b9565b6001836020036101000a0380198251168184511680821785525050505050509050019150509081526020016040518091039020866040518082805190602001908083835b6020831015156115475780518252602082019150602081019050602083039250611522565b6001836020036101000a0380198251168184511680821785525050505050509050019150509081526020016040518091039020908051906020019061158d929190611a63565b5061159c565b600091506115a2565b5b600191505b50949350505050565b60606001826040518082805190602001908083835b6020831015156115e557805182526020820191506020810190506020830392506115c0565b6001836020036101000a03801982511681845116808217855250505050505090500191505090815260200160405180910390208054600181600116156101000203166002900480601f0160208091040260200160405190810160405280929190818152602001828054600181600116156101000203166002900480156116ac5780601f10611681576101008083540402835291602001916116ac565b820191906000526020600020905b81548152906001019060200180831161168f57829003601f168201915b50505050509050919050565b60006004826040518082805190602001908083835b6020831015156116f257805182526020820191506020810190506020830392506116cd565b6001836020036101000a0380198251168184511680821785525050505050509050019150509081526020016040518091039020549050919050565b6000809054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff1614151561178857600080fd5b600073ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff16141515156117c457600080fd5b8073ffffffffffffffffffffffffffffffffffffffff166000809054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff167f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e060405160405180910390a3806000806101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555050565b600060606000809054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff161415156118e157600080fd5b6118eb8686610c61565b90506000815114156119005760009150611a5a565b826006876040518082805190602001908083835b6020831015156119395780518252602082019150602081019050602083039250611914565b6001836020036101000a0380198251168184511680821785525050505050509050019150509081526020016040518091039020866040518082805190602001908083835b6020831015156119a2578051825260208201915060208101905060208303925061197d565b6001836020036101000a0380198251168184511680821785525050505050509050019150509081526020016040518091039020856040518082805190602001908083835b602083101515611a0b57805182526020820191506020810190506020830392506119e6565b6001836020036101000a038019825116818451168082178552505050505050905001915050908152602001604051809103902060006101000a81548160ff021916908315150217905550600191505b50949350505050565b828054600181600116156101000203166002900490600052602060002090601f016020900481019282601f10611aa457805160ff1916838001178555611ad2565b82800160010185558215611ad2579182015b82811115611ad1578251825591602001919060010190611ab6565b5b509050611adf9190611ae3565b5090565b611b0591905b80821115611b01576000816000905550600101611ae9565b5090565b905600a165627a7a723058203575fbe08a7274dc1f5ef56184ebe6748c3a6ba313b0e467f56a46a583ea94ea0029',
        gas: '5000000',
    }); //creates instance of the contract as part of the promise


    return optrakContract; //returns instance of contract as the result of promise
}
);



const options = [
    'Provider', 'Patient'
];
const defaultOption = options[0];


class SignUp extends Component {

    constructor(props) {
        super(props);
        this.state = {
            password: '',
            pubkey: '',
            name: '',
            provStatus: false,
            email: '',
            btnTitle: 'User Type',
            error: {
                message: ''
            }
        };
        this._onSelect = this._onSelect.bind(this);

    }

    checkFields() {
        if (this.state.email.length == 0) {
            this.setState({ error: { message: 'Please enter your public key' } });
            return false;
        }
        else if (this.state.password.length < 6) {
            this.setState({ error: { message: 'Please enter a longer password' } });
            return false;
        }
        else if (this.state.btnTitle == 'User Type') {
            this.setState({ error: { message: 'Please select a user type' } });
            return false;
        }
        else if (this.state.name == '') {
            this.setState({ error: { message: 'Please enter your provider or patient name' } });
            return false;
        }
        else {
            return true;
        }

    }

    addProvider = async () => {
        if(this.checkFields()) {
            contract.then(optrakContract => {
                this.setState({pubkey: optrakContract.options.from});
                const {email, password} = this.state;
                firebaseApp.auth().createUserWithEmailAndPassword(email, password).then(() => {
                    console.log(this.state.pubkey);
                    optrakContract.methods.addProvider(this.state.name, this.state.pubkey, this.state.provStatus).send().on('receipt', async(receipt) => {
                        console.log(receipt);
                        optrakUserRef.push(this.state);
                        firebaseApp.auth().onAuthStateChanged(user => {
                            if(user) {
                                user.sendEmailVerification();
                                user.updateProfile({displayName: this.state.name});
                            }
                        })
                        firebaseApp.auth().signOut();
                        this.props.history.push('./signin');
                    }).catch(error => {
                        if(error) {
                            console.log(error);
                            this.setState({error});
                        firebaseApp.auth().onAuthStateChanged(user => {
                            if(user) {
                                user.delete().then(firebaseApp.auth().signOut());
                                window.location.reload();
                            }
                            else {
                                return null;
                            }
                        })
                        }
                        
                    })
                }).catch(error => {
                    this.setState({error});
                }) 
            })
            
        }
    
    }

    




    signUp = async () => {
        console.log("this.state", this.state);

        await this.addProvider();
    }
    _onSelect(option) {
        console.log('You selected ', option)
        if (option.eventKey == "Patient") {
            this.setState({ provStatus: false });
            this.setState({ btnTitle: option });
        }
        else {
            this.setState({ provStatus: true });
            this.setState({ btnTitle: option });
        }

    }

    render() {
        return (
            <form inline="true">
                <h2>Register for OpTrak</h2>
                <div className="form-group">
                    <DropdownButton
                        bsStyle={'primary'}
                        title={this.state.btnTitle}
                        id={`dropdown-basic-1`}
                    >
                        <MenuItem eventKey="Patient" onSelect={this._onSelect}>
                            Patient
                </MenuItem>
                        <MenuItem eventKey="Provider" onSelect={this._onSelect}>
                            Provider
                </MenuItem>
                    </DropdownButton>

                    <input className="form-control" type="text" placeholder="Email Address" onChange={event => this.setState({ email: event.target.value })} />
                    <input
                        className="form-control"
                        type="password"
                        placeholder="Password"
                        onChange={event => this.setState({ password: event.target.value })} />
                    <input
                        className="form-control"
                        type="text"
                        placeholder="Provider or Patient Name"
                        onChange={event => this.setState({ name: event.target.value })} />
                    <button className="btn btn-primary"
                        type="button"
                        onClick={() => this.signUp()}
                    >
                        Complete Registration
                </button>
                </div>
                <div>{this.state.error.message}</div>
                <div><Link to={'/signin'}> Sign in instead </Link> </div>
            </form>
        );
    }
}

export default SignUp;