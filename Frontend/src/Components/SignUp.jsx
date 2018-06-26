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
    const optrakContract = new web3.eth.Contract([{"constant":true,"inputs":[{"name":"provider1","type":"string"},{"name":"provider2","type":"string"},{"name":"patientName","type":"string"}],"name":"getPatientAccess","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"patient","type":"string"},{"name":"pubkey","type":"string"},{"name":"uid","type":"string"}],"name":"addPatient","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"sharer","type":"string"},{"name":"metaName","type":"string"},{"name":"sharee","type":"string"}],"name":"getMetaDataAccess","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"sharer","type":"string"},{"name":"metaName","type":"string"},{"name":"sharee","type":"string"},{"name":"uid","type":"string"},{"name":"access","type":"bool"}],"name":"updateMetaDataAccess","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"provider","type":"string"},{"name":"pubkey","type":"string"}],"name":"addProvider","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[],"name":"renounceOwnership","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"provider","type":"string"},{"name":"index","type":"uint256"}],"name":"getMetaName","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"provider","type":"string"},{"name":"metaName","type":"string"}],"name":"getMetaData","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"owner","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"patientName","type":"string"},{"name":"uid","type":"string"}],"name":"getPatientProvider","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"provider","type":"string"},{"name":"metaName","type":"string"},{"name":"content","type":"string"},{"name":"overwrite","type":"bool"}],"name":"addMetaData","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"provider","type":"string"}],"name":"getProviderPubkey","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"provider","type":"string"}],"name":"getProviderMetaCount","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"anonymous":false,"inputs":[{"indexed":false,"name":"patientId","type":"string"},{"indexed":false,"name":"patientName","type":"string"},{"indexed":false,"name":"timeStamp","type":"uint256"}],"name":"PatientAdded","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"patientId","type":"string"},{"indexed":false,"name":"patientName","type":"string"},{"indexed":false,"name":"sharer","type":"string"},{"indexed":false,"name":"sharee","type":"string"},{"indexed":false,"name":"timeStamp","type":"uint256"}],"name":"InformationShared","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"previousOwner","type":"address"}],"name":"OwnershipRenounced","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"previousOwner","type":"address"},{"indexed":true,"name":"newOwner","type":"address"}],"name":"OwnershipTransferred","type":"event"}], "0x9223d120341eb4a794a99a9ad0e1f18d29f196cf", {
        from: e[0],
        data: '0x6080604052336000806101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055506127b9806100536000396000f3006080604052600436106100d0576000357c0100000000000000000000000000000000000000000000000000000000900463ffffffff168063034b08fb146100d55780630c380fc9146101e2578063276422c6146102ef5780635c9f69a4146103fc578063705258341461055b578063715018a61461062257806372416e01146106395780637f51b99e146107255780638da5cb5b1461084d57806399d855c8146108a45780639fef492c146109cc578063c2ca843c14610ae5578063e647f70614610bc7578063f2fde38b14610c44575b600080fd5b3480156100e157600080fd5b506101c8600480360381019080803590602001908201803590602001908080601f0160208091040260200160405190810160405280939291908181526020018383808284378201915050505050509192919290803590602001908201803590602001908080601f0160208091040260200160405190810160405280939291908181526020018383808284378201915050505050509192919290803590602001908201803590602001908080601f0160208091040260200160405190810160405280939291908181526020018383808284378201915050505050509192919290505050610c87565b604051808215151515815260200191505060405180910390f35b3480156101ee57600080fd5b506102d5600480360381019080803590602001908201803590602001908080601f0160208091040260200160405190810160405280939291908181526020018383808284378201915050505050509192919290803590602001908201803590602001908080601f0160208091040260200160405190810160405280939291908181526020018383808284378201915050505050509192919290803590602001908201803590602001908080601f0160208091040260200160405190810160405280939291908181526020018383808284378201915050505050509192919290505050610ddd565b604051808215151515815260200191505060405180910390f35b3480156102fb57600080fd5b506103e2600480360381019080803590602001908201803590602001908080601f0160208091040260200160405190810160405280939291908181526020018383808284378201915050505050509192919290803590602001908201803590602001908080601f0160208091040260200160405190810160405280939291908181526020018383808284378201915050505050509192919290803590602001908201803590602001908080601f016020809104026020016040519081016040528093929190818152602001838380828437820191505050505050919291929050505061113b565b604051808215151515815260200191505060405180910390f35b34801561040857600080fd5b50610541600480360381019080803590602001908201803590602001908080601f0160208091040260200160405190810160405280939291908181526020018383808284378201915050505050509192919290803590602001908201803590602001908080601f0160208091040260200160405190810160405280939291908181526020018383808284378201915050505050509192919290803590602001908201803590602001908080601f0160208091040260200160405190810160405280939291908181526020018383808284378201915050505050509192919290803590602001908201803590602001908080601f0160208091040260200160405190810160405280939291908181526020018383808284378201915050505050509192919290803515159060200190929190505050611291565b604051808215151515815260200191505060405180910390f35b34801561056757600080fd5b50610608600480360381019080803590602001908201803590602001908080601f0160208091040260200160405190810160405280939291908181526020018383808284378201915050505050509192919290803590602001908201803590602001908080601f016020809104026020016040519081016040528093929190818152602001838380828437820191505050505050919291929050505061181c565b604051808215151515815260200191505060405180910390f35b34801561062e57600080fd5b50610637611996565b005b34801561064557600080fd5b506106aa600480360381019080803590602001908201803590602001908080601f016020809104026020016040519081016040528093929190818152602001838380828437820191505050505050919291929080359060200190929190505050611a98565b6040518080602001828103825283818151815260200191508051906020019080838360005b838110156106ea5780820151818401526020810190506106cf565b50505050905090810190601f1680156107175780820380516001836020036101000a031916815260200191505b509250505060405180910390f35b34801561073157600080fd5b506107d2600480360381019080803590602001908201803590602001908080601f0160208091040260200160405190810160405280939291908181526020018383808284378201915050505050509192919290803590602001908201803590602001908080601f0160208091040260200160405190810160405280939291908181526020018383808284378201915050505050509192919290505050611bb7565b6040518080602001828103825283818151815260200191508051906020019080838360005b838110156108125780820151818401526020810190506107f7565b50505050905090810190601f16801561083f5780820380516001836020036101000a031916815260200191505b509250505060405180910390f35b34801561085957600080fd5b50610862611d2e565b604051808273ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200191505060405180910390f35b3480156108b057600080fd5b50610951600480360381019080803590602001908201803590602001908080601f0160208091040260200160405190810160405280939291908181526020018383808284378201915050505050509192919290803590602001908201803590602001908080601f0160208091040260200160405190810160405280939291908181526020018383808284378201915050505050509192919290505050611d53565b6040518080602001828103825283818151815260200191508051906020019080838360005b83811015610991578082015181840152602081019050610976565b50505050905090810190601f1680156109be5780820380516001836020036101000a031916815260200191505b509250505060405180910390f35b3480156109d857600080fd5b50610acb600480360381019080803590602001908201803590602001908080601f0160208091040260200160405190810160405280939291908181526020018383808284378201915050505050509192919290803590602001908201803590602001908080601f0160208091040260200160405190810160405280939291908181526020018383808284378201915050505050509192919290803590602001908201803590602001908080601f0160208091040260200160405190810160405280939291908181526020018383808284378201915050505050509192919290803515159060200190929190505050611eca565b604051808215151515815260200191505060405180910390f35b348015610af157600080fd5b50610b4c600480360381019080803590602001908201803590602001908080601f0160208091040260200160405190810160405280939291908181526020018383808284378201915050505050509192919290505050612411565b6040518080602001828103825283818151815260200191508051906020019080838360005b83811015610b8c578082015181840152602081019050610b71565b50505050905090810190601f168015610bb95780820380516001836020036101000a031916815260200191505b509250505060405180910390f35b348015610bd357600080fd5b50610c2e600480360381019080803590602001908201803590602001908080601f016020809104026020016040519081016040528093929190818152602001838380828437820191505050505050919291929050505061251e565b6040518082815260200191505060405180910390f35b348015610c5057600080fd5b50610c85600480360381019080803573ffffffffffffffffffffffffffffffffffffffff169060200190929190505050612593565b005b60006006846040518082805190602001908083835b602083101515610cc15780518252602082019150602081019050602083039250610c9c565b6001836020036101000a0380198251168184511680821785525050505050509050019150509081526020016040518091039020826040518082805190602001908083835b602083101515610d2a5780518252602082019150602081019050602083039250610d05565b6001836020036101000a0380198251168184511680821785525050505050509050019150509081526020016040518091039020836040518082805190602001908083835b602083101515610d935780518252602082019150602081019050602083039250610d6e565b6001836020036101000a038019825116818451168082178552505050505050905001915050908152602001604051809103902060009054906101000a900460ff1690509392505050565b60008060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff16141515610e3a57600080fd5b60006002856040518082805190602001908083835b602083101515610e745780518252602082019150602081019050602083039250610e4f565b6001836020036101000a0380198251168184511680821785525050505050509050019150509081526020016040518091039020836040518082805190602001908083835b602083101515610edd5780518252602082019150602081019050602083039250610eb8565b6001836020036101000a038019825116818451168082178552505050505050905001915050908152602001604051809103902080546001816001161561010002031660029004905011151561112f57826002856040518082805190602001908083835b602083101515610f655780518252602082019150602081019050602083039250610f40565b6001836020036101000a0380198251168184511680821785525050505050509050019150509081526020016040518091039020836040518082805190602001908083835b602083101515610fce5780518252602082019150602081019050602083039250610fa9565b6001836020036101000a038019825116818451168082178552505050505050905001915050908152602001604051809103902090805190602001906110149291906126e8565b507f2d7ab14be0f6cfdd712fedd0b401a6e589e00f955c7bd4986aa528f411d22987828542604051808060200180602001848152602001838103835286818151815260200191508051906020019080838360005b83811015611083578082015181840152602081019050611068565b50505050905090810190601f1680156110b05780820380516001836020036101000a031916815260200191505b50838103825285818151815260200191508051906020019080838360005b838110156110e95780820151818401526020810190506110ce565b50505050905090810190601f1680156111165780820380516001836020036101000a031916815260200191505b509550505050505060405180910390a160019050611134565b600090505b9392505050565b60006006846040518082805190602001908083835b6020831015156111755780518252602082019150602081019050602083039250611150565b6001836020036101000a0380198251168184511680821785525050505050509050019150509081526020016040518091039020836040518082805190602001908083835b6020831015156111de57805182526020820191506020810190506020830392506111b9565b6001836020036101000a0380198251168184511680821785525050505050509050019150509081526020016040518091039020826040518082805190602001908083835b6020831015156112475780518252602082019150602081019050602083039250611222565b6001836020036101000a038019825116818451168082178552505050505050905001915050908152602001604051809103902060009054906101000a900460ff1690509392505050565b600060606000809054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff161415156112f057600080fd5b6112fa8787611bb7565b905060008151141561130f5760009150611812565b6002866040518082805190602001908083835b6020831015156113475780518252602082019150602081019050602083039250611322565b6001836020036101000a0380198251168184511680821785525050505050509050019150509081526020016040518091039020846040518082805190602001908083835b6020831015156113b0578051825260208201915060208101905060208303925061138b565b6001836020036101000a0380198251168184511680821785525050505050509050019150509081526020016040518091039020604051808280546001816001161561010002031660029004801561143e5780601f1061141c57610100808354040283529182019161143e565b820191906000526020600020905b81548152906001019060200180831161142a575b505091505060405180910390206000191661145888612411565b6040518082805190602001908083835b60208310151561148d5780518252602082019150602081019050602083039250611468565b6001836020036101000a038019825116818451168082178552505050505050905001915050604051809103902060001916141561180d57826006886040518082805190602001908083835b6020831015156114fd57805182526020820191506020810190506020830392506114d8565b6001836020036101000a0380198251168184511680821785525050505050509050019150509081526020016040518091039020876040518082805190602001908083835b6020831015156115665780518252602082019150602081019050602083039250611541565b6001836020036101000a0380198251168184511680821785525050505050509050019150509081526020016040518091039020866040518082805190602001908083835b6020831015156115cf57805182526020820191506020810190506020830392506115aa565b6001836020036101000a038019825116818451168082178552505050505050905001915050908152602001604051809103902060006101000a81548160ff0219169083151502179055507f1c9d36c4434b664e87e212c8fa4e841c9c06c03e7811d63a67a38a28880fd9ab8685898842604051808060200180602001806020018060200186815260200185810385528a818151815260200191508051906020019080838360005b83811015611691578082015181840152602081019050611676565b50505050905090810190601f1680156116be5780820380516001836020036101000a031916815260200191505b50858103845289818151815260200191508051906020019080838360005b838110156116f75780820151818401526020810190506116dc565b50505050905090810190601f1680156117245780820380516001836020036101000a031916815260200191505b50858103835288818151815260200191508051906020019080838360005b8381101561175d578082015181840152602081019050611742565b50505050905090810190601f16801561178a5780820380516001836020036101000a031916815260200191505b50858103825287818151815260200191508051906020019080838360005b838110156117c35780820151818401526020810190506117a8565b50505050905090810190601f1680156117f05780820380516001836020036101000a031916815260200191505b50995050505050505050505060405180910390a160019150611812565b600091505b5095945050505050565b60008060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff1614151561187957600080fd5b60006001846040518082805190602001908083835b6020831015156118b3578051825260208201915060208101905060208303925061188e565b6001836020036101000a038019825116818451168082178552505050505050905001915050908152602001604051809103902080546001816001161561010002031660029004905011151561198b57816001846040518082805190602001908083835b60208310151561193b5780518252602082019150602081019050602083039250611916565b6001836020036101000a038019825116818451168082178552505050505050905001915050908152602001604051809103902090805190602001906119819291906126e8565b5060019050611990565b600090505b92915050565b6000809054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff161415156119f157600080fd5b6000809054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff167ff8df31144d9c2f0f6b59d69b8b98abd5459d07f2742c4df920b25aae33c6482060405160405180910390a260008060006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff160217905550565b60606005836040518082805190602001908083835b602083101515611ad25780518252602082019150602081019050602083039250611aad565b6001836020036101000a038019825116818451168082178552505050505050905001915050908152602001604051809103902060008381526020019081526020016000208054600181600116156101000203166002900480601f016020809104026020016040519081016040528092919081815260200182805460018160011615610100020316600290048015611baa5780601f10611b7f57610100808354040283529160200191611baa565b820191906000526020600020905b815481529060010190602001808311611b8d57829003601f168201915b5050505050905092915050565b60606003836040518082805190602001908083835b602083101515611bf15780518252602082019150602081019050602083039250611bcc565b6001836020036101000a0380198251168184511680821785525050505050509050019150509081526020016040518091039020826040518082805190602001908083835b602083101515611c5a5780518252602082019150602081019050602083039250611c35565b6001836020036101000a03801982511681845116808217855250505050505090500191505090815260200160405180910390208054600181600116156101000203166002900480601f016020809104026020016040519081016040528092919081815260200182805460018160011615610100020316600290048015611d215780601f10611cf657610100808354040283529160200191611d21565b820191906000526020600020905b815481529060010190602001808311611d0457829003601f168201915b5050505050905092915050565b6000809054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b60606002836040518082805190602001908083835b602083101515611d8d5780518252602082019150602081019050602083039250611d68565b6001836020036101000a0380198251168184511680821785525050505050509050019150509081526020016040518091039020826040518082805190602001908083835b602083101515611df65780518252602082019150602081019050602083039250611dd1565b6001836020036101000a03801982511681845116808217855250505050505090500191505090815260200160405180910390208054600181600116156101000203166002900480601f016020809104026020016040519081016040528092919081815260200182805460018160011615610100020316600290048015611ebd5780601f10611e9257610100808354040283529160200191611ebd565b820191906000526020600020905b815481529060010190602001808311611ea057829003601f168201915b5050505050905092915050565b600060606000809054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff16141515611f2957600080fd5b6003866040518082805190602001908083835b602083101515611f615780518252602082019150602081019050602083039250611f3c565b6001836020036101000a0380198251168184511680821785525050505050509050019150509081526020016040518091039020856040518082805190602001908083835b602083101515611fca5780518252602082019150602081019050602083039250611fa5565b6001836020036101000a03801982511681845116808217855250505050505090500191505090815260200160405180910390208054600181600116156101000203166002900480601f0160208091040260200160405190810160405280929190818152602001828054600181600116156101000203166002900480156120915780601f1061206657610100808354040283529160200191612091565b820191906000526020600020905b81548152906001019060200180831161207457829003601f168201915b5050505050905060008151141561230557846005876040518082805190602001908083835b6020831015156120db57805182526020820191506020810190506020830392506120b6565b6001836020036101000a038019825116818451168082178552505050505050905001915050908152602001604051809103902060006004896040518082805190602001908083835b6020831015156121485780518252602082019150602081019050602083039250612123565b6001836020036101000a0380198251168184511680821785525050505050509050019150509081526020016040518091039020548152602001908152602001600020908051906020019061219d9291906126e8565b50836003876040518082805190602001908083835b6020831015156121d757805182526020820191506020810190506020830392506121b2565b6001836020036101000a0380198251168184511680821785525050505050509050019150509081526020016040518091039020866040518082805190602001908083835b602083101515612240578051825260208201915060208101905060208303925061221b565b6001836020036101000a038019825116818451168082178552505050505050905001915050908152602001604051809103902090805190602001906122869291906126e8565b506004866040518082805190602001908083835b6020831015156122bf578051825260208201915060208101905060208303925061229a565b6001836020036101000a03801982511681845116808217855250505050505090500191505090815260200160405180910390206000815460010191905081905550612403565b82156123f957836003876040518082805190602001908083835b602083101515612344578051825260208201915060208101905060208303925061231f565b6001836020036101000a0380198251168184511680821785525050505050509050019150509081526020016040518091039020866040518082805190602001908083835b6020831015156123ad5780518252602082019150602081019050602083039250612388565b6001836020036101000a038019825116818451168082178552505050505050905001915050908152602001604051809103902090805190602001906123f39291906126e8565b50612402565b60009150612408565b5b600191505b50949350505050565b60606001826040518082805190602001908083835b60208310151561244b5780518252602082019150602081019050602083039250612426565b6001836020036101000a03801982511681845116808217855250505050505090500191505090815260200160405180910390208054600181600116156101000203166002900480601f0160208091040260200160405190810160405280929190818152602001828054600181600116156101000203166002900480156125125780601f106124e757610100808354040283529160200191612512565b820191906000526020600020905b8154815290600101906020018083116124f557829003601f168201915b50505050509050919050565b60006004826040518082805190602001908083835b6020831015156125585780518252602082019150602081019050602083039250612533565b6001836020036101000a0380198251168184511680821785525050505050509050019150509081526020016040518091039020549050919050565b6000809054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff161415156125ee57600080fd5b600073ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff161415151561262a57600080fd5b8073ffffffffffffffffffffffffffffffffffffffff166000809054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff167f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e060405160405180910390a3806000806101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555050565b828054600181600116156101000203166002900490600052602060002090601f016020900481019282601f1061272957805160ff1916838001178555612757565b82800160010185558215612757579182015b8281111561275657825182559160200191906001019061273b565b5b5090506127649190612768565b5090565b61278a91905b8082111561278657600081600090555060010161276e565b5090565b905600a165627a7a7230582071e2a34153d5cc94ceeae205f0a0fecf744f401c31d20baa033d48a17a3fd0070029',
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
                    optrakContract.methods.addProvider(this.state.name, this.state.pubkey).send().on('receipt', async(receipt) => {
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