import React, { Component } from 'react';
import Dropdown from 'react-dropdown';
import { firebaseApp, optrakUserRef } from '../firebase';
import 'react-dropdown/style.css';
import { Link, BrowserRouter, Route } from 'react-router-dom';
import { DropdownButton, MenuItem, Form, FormGroup, FormControl, ControlLabel, Button } from 'react-bootstrap';
import Web3 from 'web3';

const web3 = new Web3(Web3.givenProvider || "http://localhost:8545");

//creates our smart contract instance using the current user's address from metamask or Mist browser or whatever they're using
//contract address is used in this instantiation, will have to change whenever the contract is deployed to somewhere else
const contract = web3.eth.getAccounts().then(e => {
    const optrakContract = new web3.eth.Contract([{"constant":true,"inputs":[{"name":"sharer","type":"string"},{"name":"metaName","type":"string"},{"name":"sharee","type":"string"}],"name":"getMetaDataAccess","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[],"name":"renounceOwnership","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"provider","type":"string"},{"name":"index","type":"uint256"}],"name":"getMetaName","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"provider","type":"string"},{"name":"metaName","type":"string"}],"name":"getMetaData","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"provider","type":"string"},{"name":"pubkey","type":"string"},{"name":"provStatus","type":"bool"}],"name":"addProvider","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"owner","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"provider","type":"string"},{"name":"metaName","type":"string"},{"name":"content","type":"string"},{"name":"overwrite","type":"bool"}],"name":"addMetaData","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"provider","type":"string"},{"name":"pubkey","type":"string"}],"name":"getProviderInfo","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"provider","type":"string"}],"name":"getProviderPubkey","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"provider","type":"string"}],"name":"getProviderMetaCount","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"sharer","type":"string"},{"name":"metaName","type":"string"},{"name":"sharee","type":"string"},{"name":"access","type":"bool"}],"name":"updateMetaDataAccess","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"anonymous":false,"inputs":[{"indexed":true,"name":"previousOwner","type":"address"}],"name":"OwnershipRenounced","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"previousOwner","type":"address"},{"indexed":true,"name":"newOwner","type":"address"}],"name":"OwnershipTransferred","type":"event"}], "0x6c83973f10b5871e77ca74ff658cec905895b272", {
        from: e[0],
        data: '0x6080604052336000806101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff160217905550611cf2806100536000396000f3006080604052600436106100ba576000357c0100000000000000000000000000000000000000000000000000000000900463ffffffff168063276422c6146100bf578063715018a6146101cc57806372416e01146101e35780637f51b99e146102cf5780638bd62a2d146103f75780638da5cb5b146104ca5780639fef492c14610521578063bbb78abb1461063a578063c2ca843c14610701578063e647f706146107e3578063f2fde38b14610860578063f337d51b146108a3575b600080fd5b3480156100cb57600080fd5b506101b2600480360381019080803590602001908201803590602001908080601f0160208091040260200160405190810160405280939291908181526020018383808284378201915050505050509192919290803590602001908201803590602001908080601f0160208091040260200160405190810160405280939291908181526020018383808284378201915050505050509192919290803590602001908201803590602001908080601f01602080910402602001604051908101604052809392919081815260200183838082843782019150505050505091929192905050506109bc565b604051808215151515815260200191505060405180910390f35b3480156101d857600080fd5b506101e1610b12565b005b3480156101ef57600080fd5b50610254600480360381019080803590602001908201803590602001908080601f016020809104026020016040519081016040528093929190818152602001838380828437820191505050505050919291929080359060200190929190505050610c14565b6040518080602001828103825283818151815260200191508051906020019080838360005b83811015610294578082015181840152602081019050610279565b50505050905090810190601f1680156102c15780820380516001836020036101000a031916815260200191505b509250505060405180910390f35b3480156102db57600080fd5b5061037c600480360381019080803590602001908201803590602001908080601f0160208091040260200160405190810160405280939291908181526020018383808284378201915050505050509192919290803590602001908201803590602001908080601f0160208091040260200160405190810160405280939291908181526020018383808284378201915050505050509192919290505050610d33565b6040518080602001828103825283818151815260200191508051906020019080838360005b838110156103bc5780820151818401526020810190506103a1565b50505050905090810190601f1680156103e95780820380516001836020036101000a031916815260200191505b509250505060405180910390f35b34801561040357600080fd5b506104b0600480360381019080803590602001908201803590602001908080601f0160208091040260200160405190810160405280939291908181526020018383808284378201915050505050509192919290803590602001908201803590602001908080601f0160208091040260200160405190810160405280939291908181526020018383808284378201915050505050509192919290803515159060200190929190505050610eaa565b604051808215151515815260200191505060405180910390f35b3480156104d657600080fd5b506104df611111565b604051808273ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200191505060405180910390f35b34801561052d57600080fd5b50610620600480360381019080803590602001908201803590602001908080601f0160208091040260200160405190810160405280939291908181526020018383808284378201915050505050509192919290803590602001908201803590602001908080601f0160208091040260200160405190810160405280939291908181526020018383808284378201915050505050509192919290803590602001908201803590602001908080601f0160208091040260200160405190810160405280939291908181526020018383808284378201915050505050509192919290803515159060200190929190505050611136565b604051808215151515815260200191505060405180910390f35b34801561064657600080fd5b506106e7600480360381019080803590602001908201803590602001908080601f0160208091040260200160405190810160405280939291908181526020018383808284378201915050505050509192919290803590602001908201803590602001908080601f016020809104026020016040519081016040528093929190818152602001838380828437820191505050505050919291929050505061167d565b604051808215151515815260200191505060405180910390f35b34801561070d57600080fd5b50610768600480360381019080803590602001908201803590602001908080601f0160208091040260200160405190810160405280939291908181526020018383808284378201915050505050509192919290505050611769565b6040518080602001828103825283818151815260200191508051906020019080838360005b838110156107a857808201518184015260208101905061078d565b50505050905090810190601f1680156107d55780820380516001836020036101000a031916815260200191505b509250505060405180910390f35b3480156107ef57600080fd5b5061084a600480360381019080803590602001908201803590602001908080601f0160208091040260200160405190810160405280939291908181526020018383808284378201915050505050509192919290505050611876565b6040518082815260200191505060405180910390f35b34801561086c57600080fd5b506108a1600480360381019080803573ffffffffffffffffffffffffffffffffffffffff1690602001909291905050506118eb565b005b3480156108af57600080fd5b506109a2600480360381019080803590602001908201803590602001908080601f0160208091040260200160405190810160405280939291908181526020018383808284378201915050505050509192919290803590602001908201803590602001908080601f0160208091040260200160405190810160405280939291908181526020018383808284378201915050505050509192919290803590602001908201803590602001908080601f0160208091040260200160405190810160405280939291908181526020018383808284378201915050505050509192919290803515159060200190929190505050611a40565b604051808215151515815260200191505060405180910390f35b60006006846040518082805190602001908083835b6020831015156109f657805182526020820191506020810190506020830392506109d1565b6001836020036101000a0380198251168184511680821785525050505050509050019150509081526020016040518091039020836040518082805190602001908083835b602083101515610a5f5780518252602082019150602081019050602083039250610a3a565b6001836020036101000a0380198251168184511680821785525050505050509050019150509081526020016040518091039020826040518082805190602001908083835b602083101515610ac85780518252602082019150602081019050602083039250610aa3565b6001836020036101000a038019825116818451168082178552505050505050905001915050908152602001604051809103902060009054906101000a900460ff1690509392505050565b6000809054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff16141515610b6d57600080fd5b6000809054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff167ff8df31144d9c2f0f6b59d69b8b98abd5459d07f2742c4df920b25aae33c6482060405160405180910390a260008060006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff160217905550565b60606005836040518082805190602001908083835b602083101515610c4e5780518252602082019150602081019050602083039250610c29565b6001836020036101000a038019825116818451168082178552505050505050905001915050908152602001604051809103902060008381526020019081526020016000208054600181600116156101000203166002900480601f016020809104026020016040519081016040528092919081815260200182805460018160011615610100020316600290048015610d265780601f10610cfb57610100808354040283529160200191610d26565b820191906000526020600020905b815481529060010190602001808311610d0957829003601f168201915b5050505050905092915050565b60606003836040518082805190602001908083835b602083101515610d6d5780518252602082019150602081019050602083039250610d48565b6001836020036101000a0380198251168184511680821785525050505050509050019150509081526020016040518091039020826040518082805190602001908083835b602083101515610dd65780518252602082019150602081019050602083039250610db1565b6001836020036101000a03801982511681845116808217855250505050505090500191505090815260200160405180910390208054600181600116156101000203166002900480601f016020809104026020016040519081016040528092919081815260200182805460018160011615610100020316600290048015610e9d5780601f10610e7257610100808354040283529160200191610e9d565b820191906000526020600020905b815481529060010190602001808311610e8057829003601f168201915b5050505050905092915050565b60008060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff16141515610f0757600080fd5b60006001856040518082805190602001908083835b602083101515610f415780518252602082019150602081019050602083039250610f1c565b6001836020036101000a038019825116818451168082178552505050505050905001915050908152602001604051809103902080546001816001161561010002031660029004905011151561110557826001856040518082805190602001908083835b602083101515610fc95780518252602082019150602081019050602083039250610fa4565b6001836020036101000a0380198251168184511680821785525050505050509050019150509081526020016040518091039020908051906020019061100f929190611c21565b50816002856040518082805190602001908083835b6020831015156110495780518252602082019150602081019050602083039250611024565b6001836020036101000a0380198251168184511680821785525050505050509050019150509081526020016040518091039020846040518082805190602001908083835b6020831015156110b2578051825260208201915060208101905060208303925061108d565b6001836020036101000a038019825116818451168082178552505050505050905001915050908152602001604051809103902060006101000a81548160ff0219169083151502179055506001905061110a565b600090505b9392505050565b6000809054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b600060606000809054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff1614151561119557600080fd5b6003866040518082805190602001908083835b6020831015156111cd57805182526020820191506020810190506020830392506111a8565b6001836020036101000a0380198251168184511680821785525050505050509050019150509081526020016040518091039020856040518082805190602001908083835b6020831015156112365780518252602082019150602081019050602083039250611211565b6001836020036101000a03801982511681845116808217855250505050505090500191505090815260200160405180910390208054600181600116156101000203166002900480601f0160208091040260200160405190810160405280929190818152602001828054600181600116156101000203166002900480156112fd5780601f106112d2576101008083540402835291602001916112fd565b820191906000526020600020905b8154815290600101906020018083116112e057829003601f168201915b5050505050905060008151141561157157846005876040518082805190602001908083835b6020831015156113475780518252602082019150602081019050602083039250611322565b6001836020036101000a038019825116818451168082178552505050505050905001915050908152602001604051809103902060006004896040518082805190602001908083835b6020831015156113b4578051825260208201915060208101905060208303925061138f565b6001836020036101000a03801982511681845116808217855250505050505090500191505090815260200160405180910390205481526020019081526020016000209080519060200190611409929190611c21565b50836003876040518082805190602001908083835b602083101515611443578051825260208201915060208101905060208303925061141e565b6001836020036101000a0380198251168184511680821785525050505050509050019150509081526020016040518091039020866040518082805190602001908083835b6020831015156114ac5780518252602082019150602081019050602083039250611487565b6001836020036101000a038019825116818451168082178552505050505050905001915050908152602001604051809103902090805190602001906114f2929190611c21565b506004866040518082805190602001908083835b60208310151561152b5780518252602082019150602081019050602083039250611506565b6001836020036101000a0380198251168184511680821785525050505050509050019150509081526020016040518091039020600081546001019190508190555061166f565b821561166557836003876040518082805190602001908083835b6020831015156115b0578051825260208201915060208101905060208303925061158b565b6001836020036101000a0380198251168184511680821785525050505050509050019150509081526020016040518091039020866040518082805190602001908083835b60208310151561161957805182526020820191506020810190506020830392506115f4565b6001836020036101000a0380198251168184511680821785525050505050509050019150509081526020016040518091039020908051906020019061165f929190611c21565b5061166e565b60009150611674565b5b600191505b50949350505050565b60006002836040518082805190602001908083835b6020831015156116b75780518252602082019150602081019050602083039250611692565b6001836020036101000a0380198251168184511680821785525050505050509050019150509081526020016040518091039020826040518082805190602001908083835b60208310151561172057805182526020820191506020810190506020830392506116fb565b6001836020036101000a038019825116818451168082178552505050505050905001915050908152602001604051809103902060009054906101000a900460ff16905092915050565b60606001826040518082805190602001908083835b6020831015156117a3578051825260208201915060208101905060208303925061177e565b6001836020036101000a03801982511681845116808217855250505050505090500191505090815260200160405180910390208054600181600116156101000203166002900480601f01602080910402602001604051908101604052809291908181526020018280546001816001161561010002031660029004801561186a5780601f1061183f5761010080835404028352916020019161186a565b820191906000526020600020905b81548152906001019060200180831161184d57829003601f168201915b50505050509050919050565b60006004826040518082805190602001908083835b6020831015156118b0578051825260208201915060208101905060208303925061188b565b6001836020036101000a0380198251168184511680821785525050505050509050019150509081526020016040518091039020549050919050565b6000809054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff1614151561194657600080fd5b600073ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff161415151561198257600080fd5b8073ffffffffffffffffffffffffffffffffffffffff166000809054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff167f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e060405160405180910390a3806000806101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555050565b600060606000809054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff16141515611a9f57600080fd5b611aa98686610d33565b9050600081511415611abe5760009150611c18565b826006876040518082805190602001908083835b602083101515611af75780518252602082019150602081019050602083039250611ad2565b6001836020036101000a0380198251168184511680821785525050505050509050019150509081526020016040518091039020866040518082805190602001908083835b602083101515611b605780518252602082019150602081019050602083039250611b3b565b6001836020036101000a0380198251168184511680821785525050505050509050019150509081526020016040518091039020856040518082805190602001908083835b602083101515611bc95780518252602082019150602081019050602083039250611ba4565b6001836020036101000a038019825116818451168082178552505050505050905001915050908152602001604051809103902060006101000a81548160ff021916908315150217905550600191505b50949350505050565b828054600181600116156101000203166002900490600052602060002090601f016020900481019282601f10611c6257805160ff1916838001178555611c90565b82800160010185558215611c90579182015b82811115611c8f578251825591602001919060010190611c74565b5b509050611c9d9190611ca1565b5090565b611cc391905b80821115611cbf576000816000905550600101611ca7565b5090565b905600a165627a7a72305820ae9f1c5ed547c77f26e101b06ff08f29cc11459028fbfaecece5d74ada31e1b70029',
        gas: '5000000',
    }); //creates instance of the contract as part of the promise


    return optrakContract; //returns instance of contract as the result of promise
}
);





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
            w3Active: false,
            error: {
                message: ''
            }
        };
        this._onSelect = this._onSelect.bind(this);

    }

    checkFields() {
        //Checks different fields of the signup form to verify they have all been entered correctly
        if (this.state.email.length == 0) {
            this.setState({ error: { message: 'Please enter your email' } });
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
            //verifies that necessary fields are filled out
            contract.then(optrakContract => {
                this.setState({pubkey: optrakContract.options.from});
                //the .from address is the current user, thus we log their public key during account creation
                const {email, password} = this.state;
                //current email and password are assumed to be correct at this point due to previous checks in checkFields()
                firebaseApp.auth().createUserWithEmailAndPassword(email, password).then(() => {
                    //firebase is used to create a new fuser with an email and password, making for very easy authentication
                    console.log(this.state.pubkey);
                    optrakContract.methods.addProvider(this.state.name, this.state.pubkey, this.state.provStatus).send().on('receipt', async(receipt) => {
                        //optrak instance is called upon here to add the current provider
                        //upon the transaction finishing and receiving a receipt, the following commands fire
                        console.log(receipt);
                        optrakUserRef.push(this.state); //pushes the current user to optrak user database (might not be necessary)
                        firebaseApp.auth().onAuthStateChanged(user => {
                            if(user) {
                                user.sendEmailVerification();
                                user.updateProfile({displayName: this.state.name});
                                //Sends email verification necessary for login and sets the user's displayName to the entered name
                            }
                        })
                        firebaseApp.auth().signOut(); //signs out the user before redirecting them
                        this.props.history.push('./signin');
                    }).catch(error => {
                        if(error) {
                            console.log(error);
                            this.setState({error});
                        firebaseApp.auth().onAuthStateChanged(user => {
                            if(user) {
                                user.delete().then(firebaseApp.auth().signOut());
                                window.location.reload();
                                //if the transaction failed then the created user will be deleted and signed out and the page will be 
                                //refreshed, allowing the user to try again
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

    verifyWeb3 = async () => {
        let accounts = await web3.eth.getAccounts();
        let length = accounts.length;
        console.log(length);
        this.setState({w3Active: (length !== 0)});
    }




    signUp = async () => {
        console.log("this.state", this.state);

        await this.addProvider();
    }
    _onSelect(option) {
        console.log('You selected ', option)
        if (option == "Patient") {
            this.setState({ provStatus: false });
            this.setState({ btnTitle: option });
        }
        else {
            this.setState({ provStatus: true });
            this.setState({ btnTitle: option });
        }

    }

    componentWillMount(){
        this.verifyWeb3();
    }

    render() {
        console.log(this.state.w3Active);
        const displayObject = (this.state.w3Active) ?
        (
            <form inline="true">
                <h3>Register for OpTrak</h3>
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
                        onClick={() => 
                            {
                                this.verifyWeb3();
                                if (this.state.w3Active){
                                    this.signUp();
                                }
                            }
                        }

                    >
                        Complete Registration
                </button>
                </div>
                <div>{this.state.error.message}</div>
                <div><Link to={'/signin'}> Sign in instead </Link> </div>
            </form>
        ):
        (
            <div>
                Provide a web3 provider, then refresh the page
            </div>
        );
            
        
        return (
            <div>
            {displayObject}
            </div>
        );
    }
}

export default SignUp;

export {contract};