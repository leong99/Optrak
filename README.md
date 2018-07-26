# Optrak
Solidity build of Optrak project

PREREQUISITES:
  1. CLI of preference 
  2. Latest version of Node.js & npm installed
  3. Metamask installed or Mist Browser being used
    - After this, you must connect to the Ropsten Test Net and if there is no available Ether,
    go to https://faucet.metamask.io/ and request more
    - Import an account to your Metamask using the private key given in the /keys directory
  4. Preferred version of Python installed with environment variable and PATH set
  
To get this repository working: 
  1. Clone repository into directory of choice 
  2. Navigate in CLI over to ./frontend
  3. Run  following commands 
    - npm install react-scripts -g
    - npm install firebase
    - npm install react-router-dom
    - npm install react-dom
    - npm install react-redux
    - npm install react-bootstrap
    - npm install web3@1.0.0-beta.34
    - npm install react-dropdown
    - npm install jsonwebtoken
  3. Run command npm start
  
  This version of the app does not have a splash page, so you must manually type in /signin or /signup at at the end of localhost:3000 to navigate to a different page
