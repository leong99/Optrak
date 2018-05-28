let fs=require("fs");
let Web3=require('web3');

if (typeof Web3 !== 'undefined'){
    let web3=new Web3(Web3.currentProvider); //might have to change how web3 is instantiated
}
else{
    //throw exception since web3 isn't supported by program
}

//not entirely sure what parameters the contract creation takes
let abi; //ABI retrieval when our final smart contract is written
let userAddress = web3.eth.accounts[0];
let optrak=new web3.eth.Contract(abi, userAddress); //might want to do this with a JSON interface

let accountCheck = intervalCheck(function() {
    if(userAddress !== web3.eth.accounts[0]) {
        userAddress = web3.eth.accounts[0];
        //TODO: Some function that updates UI
    }
}, 100);

/* All of the following methods will be called with the function 'send'.
However, not all of them update the blockchain.
Thus, we should be able to use the function 'call' on methods like getMetaData.
Though we might have to add the keywords 'view' or 'pure'.
Those functions will be marked below.
Note: Version 1.0 of web3 uses promises and not callbacks. */

function getProviderPubkey(provider){ //could use call
    return optrak.methods.getProviderPubkey(provider).call();
} 

function addProvider(provider, pubkey){
    optrak.methods.addProvider(provider, pubkey).send();
    //TODO: Create frontend and use jQuery to send current user update regarding status
}

function getProviderMetaCount(provider){ //could use call
    return optrak.methods.getProviderMetaCount(provider).call();
}

function getMetaName(provider, index){ //could use call
    return optrak.methods.getMetaName(provider, index).call();
}

function getMetaData(provider, metaName){ //could use call
    return optrak.methods.getMetaData(provider, metaName).call();
}

function addMetaData(provider, metaName, content, overwrite){
    //might want to implement some service to prompt user for overwrite
    return optrak.methods.addMetaData(provider, metaname, content, overwrite).send();
    //could also fire event
}

function getMetaDataAccess(sharer, metaName, sharee){ //this is already a view so will use call
    return optrak.methods.getMetaDataAccess(sharer, metaName, sharee).call();
}

function updateMetaDataAccess(sharer, metaName, sharee, access){
    return optrak.methods.updateMetaDataAccess(sharer, metaName, sharee, access).send();
}