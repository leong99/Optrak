let fs=require("fs");
let Web3=require('web3');

if (typeof Web3 !== 'undefined'){
    let web3=new Web3(Web3.currentProvider); //might have to change how web3 is instantiated
}
else{
    //throw exception since web3 isn't supported by program
}

//not entirely sure what parameters the contract creation takes
let abi; //get ABI?
let address; //get contract address?
let optrak=new web3.eth.Contract(abi, address); //might want to do this with a JSON interface

/* All of the following methods will be called with the function 'send'.
However, not all of them update the blockchain.
Thus, we should be able to use the function 'call' on methods like getMetaData.
Though we might have to add the keywords 'view' or 'pure'.
Those functions will be marked below.
Note: Version 1.0 of web3 uses promises and not callbacks. */

function getProviderPubkey(provider){ //could use call
    return optrak.methods.getProviderPubkey(provider).send();
} 

function addProvider(provider, pubkey){
    optrak.methods.addProvider(provider, pubkey).send();
    //might want to have this fire an event to update the interface
}

function getProviderMetaCount(provider){ //could use call
    return optrak.methods.getProviderMetaCount(provider).send();
}

function getMetaName(provider, index){ //could use call
    return optrak.methods.getMetaName(provider, index).send();
}

function getMetaData(provider, metaName){ //could use call
    return optrak.methods.getMetaData(provider, metaName).send();
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