pragma solidity ^0.4.23;

import "./Ownable.sol";

contract Optrak is Ownable {
    // -------------------- Provider Registry ----------------------------------
    mapping(string=>string) provider2pubkey;
    
    // uint public totalProviderCount;
    // todo: save provider index and create an actual provider-pubkey object in server code
    // mapping(uint=>string) index2provider; // hide this mapping so it's difficult to retrieve providers without index
    // -------------------- End of Provider Registry ---------------------------
    
    // -------------------- Patient Registry ----------------------------------
    mapping(string=>mapping(string=>string)) patientRegistry;
    
    // -------------------- End of Patient Registry ---------------------------

    // -------------------- Shared Meta Data -----------------------------------
    mapping(string=>mapping(string=>string)) provider2meta; // {provider: {type/name: api/pointer}}
    mapping(string=>uint) provider2metaCount;               // {provider: #}
    mapping(string=>mapping(uint=>string)) index2metaName;  // {provider: {#: type/name}}
    // note: could create the following mapping (existMetaType) in app code via traverse of previous data to save contract space
    // but each time a new meta data is added, traverse function has to be called
    // mapping(string=>mapping(string=>bool)) existMetaType;// {provider: {type/name: bool}} - use string comparison instead
    // -------------------- End of Shared Meta Data ----------------------------

    // -------------------- Meta Data Access------- ----------------------------
    mapping(string=>mapping(string=>mapping(string=>bool))) metadata2access; // {provider1:{metaname: {provider2: bool}}}
    // -------------------- End of Meta Data Access ----------------------------

   

    function getProviderPubkey(string provider) public view returns(string) {
        // string storage provider = index2provider[index];
        // todo: in server code check returned value against null
        return provider2pubkey[provider];
    }

    // Function returns a boolean so when interacting with web3 the frontend is aware
    // if a user has already registered or not
    function addProvider(string provider, string pubkey) public onlyOwner returns (bool){
         
        if (bytes(provider2pubkey[provider]).length <= 0) { //ensures a
         //provider can only register once
         //may need to update when use cases are developed further
            provider2pubkey[provider] = pubkey;
            return true;
         }
        return false;
    }

    // Function returns a boolean so when interacting with web3 the frontend is aware
    // if a user has already registered or not
    function addPatient(string patient, string pubkey, string uid) public onlyOwner returns (bool){

        if (bytes(patientRegistry[patient][uid]).length <=0) { //ensures a
        //patient can only register once
        //may need to update when use cases are developed further
            patientRegistry[patient][uid] = pubkey;
            return true;
        }
        return false;
    }



    function getProviderMetaCount(string provider) public view returns(uint) {
        return provider2metaCount[provider];
    }

    function getMetaName(string provider, uint index) public view returns(string) {
        return index2metaName[provider][index];
    }
    
    function getMetaData(string provider, string metaName) public view returns(string) {
        return provider2meta[provider][metaName];
    }

    function addMetaData(string provider, string metaName, string content, bool overwrite) public onlyOwner returns(bool){
        
        bytes memory tempExistingMeta = bytes(provider2meta[provider][metaName]);
        if (tempExistingMeta.length == 0) {
            index2metaName[provider][provider2metaCount[provider]] = metaName;
            provider2meta[provider][metaName] = content;
            ++provider2metaCount[provider];
        } else if (overwrite) {
            provider2meta[provider][metaName] = content;
        } else {
            //Prompt user on frontend for permission to overwrite current metadata
            return false;
        }
        return true;
    }

    function getMetaDataAccess(string sharer, string metaName, string sharee) public view returns(bool) {
        return metadata2access[sharer][metaName][sharee];
    }

    function getPatientAccess(string provider1, string provider2, string patientName) public view returns (bool) {
        return metadata2access[provider1][patientName][provider2];
    }

    function updateMetaDataAccess(string sharer, string metaName, string sharee, bool access) public onlyOwner returns(bool) {
        bytes memory tempExistingMeta = bytes(getMetaData(sharer, metaName));
        if (tempExistingMeta.length == 0) return false;
        metadata2access[sharer][metaName][sharee] = access;
        return true;
    }

}
