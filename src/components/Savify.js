import React, { Component } from "react";
import Web3 from "web3";
import Authereum from "authereum";
import Modal from "react-bootstrap/Modal";
import Web3Modal from "web3modal";
import "bootstrap/dist/css/bootstrap.min.css";
import "./savify.css";
import savifycopy from './images/savify copy.png';


import {
    genericDSAtoggle,
    genericDSAdeposit,
    genericDSAwithdraw
  } from "../DSA/utils";
  import {
    genericResolver,
    getBalances
  } from "../DSA/resolvers";

const DSA = require("dsa-sdk");

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            color: "#0ff279",
            buttonText: "Connect",
            shortnerAddress: "",
            errMessage: "",
            showWarning: false,
        };
    }
  
    // async componentWillMount() {
    //     this.showWarningModal();
    // }
    async loadWeb3() {
        const providerOptions = {
            /* See Provider Options Section */
            authereum: {
                package: Authereum, // required
            },
        };
        const web3Modal = new Web3Modal({
            network: "mainnet", // optional
            cacheProvider: false, // optional
            providerOptions, // required
        });
        const provider = await web3Modal.connect();
        const web3 = new Web3(provider);
        this.setState({ web3 });
    }
  
    login = async () => {
        try {
            await this.loadWeb3();
            await this.loadBlockchainData();
            await this.showShortner()
            this.setState({ color: "#85f7ff" });
            this.setState({ buttonText: this.state.shortnerAddress});
        } catch (err) {
            this.setState({ color: "#85f7ff", buttonText: "Try Again", errMessage: "Please select Mainnet in your wallet" });
            this.showErrorModal();   
        }
    };
  
    async showShortner() {
        let address = this.state.dsaAddress.toString()
        address = address.substring(0,6)+ '......'+ address.substring(address.length -7, address.length -1)
        this.setState({shortnerAddress : address})
    }
  
    async loadBlockchainData() {
        // in browser with react
        const accounts = await this.state.web3.eth.getAccounts();
        this.setState({ account: accounts[0] });
        const dsa = new DSA(this.state.web3);
        this.setState({ dsa });
  
        // Getting Your DSA Address
        var existingDSAAddress = await dsa.getAccounts(this.state.account);
        if (existingDSAAddress.length === 0) {
            var newDsaAddress = await dsa.build({
                gasPrice: this.state.web3.utils.toWei("27", "gwei"),
            });
        }
        // change to this.state.account does this requires address as string?
        existingDSAAddress = await dsa.getAccounts(this.state.account);
        this.setState({ dsaAddress: existingDSAAddress[0].address });
        // Setting DSA Instance
        await dsa.setInstance(existingDSAAddress[0].id);
    }
    render() {
        return (
            <div>
                <nav id = "navbar" className="navbar navbar-light fixed-top flex-md-nowrap">
                    
                    <img src={savifycopy} alt="home-page" className="savify-image"/>
                    <button
                        onClick={this.login}
                        style={{
                            backgroundColor: this.state.color,
                            borderRadius: "10px",
                            width: "160px",
                            height: "40px",
                            border: "None",
                        }}
                    >
                        {this.state.buttonText}{" "}
                    </button>
                </nav>
            </div>
        );
    }
}
export default App;