import React, { Component } from "react";
import Web3 from "web3";
import Authereum from "authereum";
import Modal from "react-bootstrap/Modal";
import Web3Modal from "web3modal";
import "bootstrap/dist/css/bootstrap.min.css";
import "./savify.css";
import savifycopy from './images/savify copy.png';
import axios from 'axios';
import dashboard from "./images/download.png";


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
        this.onChangeprotocol = this.onChangeprotocol.bind(this);
        this.onChangetransaction = this.onChangetransaction.bind(this);
        this.onChangeselectedAsset = this.onChangeselectedAsset.bind(this);
        this.onChangeAmount = this.onChangeAmount.bind(this);
        this.state = {
            buttonText: "Connect",
            shortnerAddress: "",
            errMessage: "",
            interestRate: {
                Dai: {
                    compound: 0,
                    aave: 0,
                    dydx: 0,
                },
                Eth: {
                    compound: 0,
                    aave: 0,
                    dydx: 0,
                },
                USDC: {
                    compound: 0,
                    aave: 0,
                    dydx: 0,
                },
            },
            protocol: {
                dai: "",
                eth: "",
                usdc: ""
            },
            totalSupply : {
                dai: 0,
                eth: 0,
                usdc: 0,
            },
            principalAmount: {
                dai: 0,
                eth: 0,
                usdc: 0,
            },
            transaction: [{}],
            dsa_id: 0,
            assetSelected: "eth",
            amount: 0,
            
        };
        //this.login();
      
    }
  
    async componentWillMount() {
        
    }

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
            this.setState({ buttonText: this.state.shortnerAddress});
        } catch (err) {
            this.setState({ buttonText: "Try Again", errMessage: "Please select Mainnet in your wallet" });
            //this.showErrorModal();   
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
        this.setState({ dsaAddress: existingDSAAddress[0].address, dsa_id: existingDSAAddress[0].id });
        // Setting DSA Instance
        await dsa.setInstance(existingDSAAddress[0].id);
        await this.createUserdata(dsa);
        await this.getUserdata(dsa);
        
    }

    async showInterestModal(dsa){
        const com = await dsa.compound.getPosition("0x724A3c801ae0E84fbEA630D72f4675220429EA00");
        const aav = await dsa.aave.getPosition("0x724A3c801ae0E84fbEA630D72f4675220429EA00");
        const dd = await dsa.dydx.getPosition("0x724A3c801ae0E84fbEA630D72f4675220429EA00");
        this.setState({
            interestRate: {
                Dai: {
                    compound: com["dai"].supplyYield,
                    aave: aav["dai"].supplyYield,
                    dydx: dd["dai"].supplyYield
                },
                Eth: {
                    compound: com["eth"].supplyYield,
                    aave: aav["eth"].supplyYield,
                    dydx: dd["eth"].supplyYield
                },
                USDC: {
                    compound: com["usdc"].supplyYield,
                    aave: aav["usdc"].supplyYield,
                    dydx: dd["usdc"].supplyYield
                }
            }
        });
        console.log(this.state.interestRate);

    }

    async createUserdata (dsa){
        const user = {
            id: this.state.dsa_id
        }
        axios.post('http://localhost:1423/users/add', user)
            .then(res => console.log(res.data))
            .catch((error) => {console.log("User already created");})
    }

    async getUserdata(dsa){
        const id = this.state.dsa_id;
        axios.get('http://localhost:1423/users/'+id)
            .then(res => {
                this.setState({
                    userAssets : {
                        Dai: res.data.Dai,
                        Eth: res.data.Eth,
                        USDC: res.data.USDC
                    },
                    transaction: res.data.trans
                })
            })
            .catch((error) => {console.log(error);})
    }



    async withdrawAmount(dsa, amount){
        const proto = this.state.protocol;
        var spells = dsa.spells();
        if(proto !== "None" || proto !== ""){
            if(this.state.assetSelected === "dai"){
                spells = await genericDSAwithdraw(
                    spells,
                    proto,
                    dsa.tokens.info["dai"].address,
                    this.state.amount,
                    this.state.account  
                );
            }else if(this.state.assetSelected === "eth"){
                spells = await genericDSAwithdraw(
                    spells,
                    proto,
                    dsa.tokens.info["eth"].address,
                    this.state.amount,
                    this.state.account  
                );
            }else if(this.state.assetSelected === "usdc"){
                spells = await genericDSAwithdraw(
                    spells,
                    proto,
                    dsa.tokens.info["usdc"].address,
                    this.state.amount,
                    this.state.account  
                );
            }
            const tx = await dsa.cast({spells: spells})
                .catch((err) => {
                    throw new Error("Transaction is likely to fail, Check you spells once!")
                });
            if (tx) {
                console.log("https://etherscan.io/tx/" + tx)
                
            }  

        }else{
            console.log("You will have to deposit amount first!");
        }
    }

    onChangeprotocol(e) {
        this.setState({
            protocol: e.target.value
        })
    }

    onChangetransaction(e) {
        this.setState({
            transaction: e.target.value
        })
    }
    onChangeselectedAsset(e) {
        this.setState({
            assetSelected: e.target.value
        })
    }
    onChangeAmount(e) {
        this.setState({
            amount: e.target.value
        })
    }

    handleAssetChange = (evt) => {
        try {
            const asset = evt.target.value.toLowerCase();
            this.setState({ assetSelected: asset });
        } catch (err) {
            this.setState({ errMessage: "Connect your Metamask Wallet First" });
            console.log(this.state.errMessage);
        } 
    };

    render() {
        return (
            <div>
                <div id = "navbar" className="header-container fixed-top shadow p-0">
                    <div> 
                        <img src={savifycopy} href="/" alt="SaviFi"  align="left" className="savify-image"/>
                    </div>
                    <div  id = "test" className="header navbar navbar-expand-sm flex-md-nowrap">
                        <button onClick={this.login} align="right">
                            {this.state.buttonText}{" "}
                        </button>
                    </div>    
                </div>

                <div id="mySidenav" className="sidenav shadow">
                    <a href="#">DashBoard</a> <br></br>
                    <a href="#">About us</a><br></br>
                   
                </div>
                <div id = "maincontent">
                    <div id = "summary1" className="col-xl-2 col-lg-2 col-md-3 col-sm-4 col-12 layout-spacing shadow">
                        <div className="widget widget-card-four">
                            <div className="widget-content">
                                <div className="w-content">
                                    <div className="w-info">
                                        <p className="value" id="AvgRate">0</p> 
                                        <p className="value" id="">USDC</p><br></br>
                                        <h6 className="cardhead">A/C Summary</h6>
                                    </div>
                                </div>
                            </div>
                        </div>           
                    </div>
                    <div id = "summary2" className="col-xl-2 col-lg-2 col-md-2 col-sm-2 col-4 layout-spacing shadow">
                        <div className="widget widget-card-four">
                            <div className="widget-content">
                                <div className="w-content">
                                    <div className="w-info">
                                        <p className="value" id="AvgRate">0</p> 
                                        <p className="value" id="">Percentage</p><br></br>
                                        <h6 className="cardhead">Principal Amount</h6>
                                    </div>
                                </div>
                            </div>   
                        </div>    
                    </div>

                    <div id = "summary3" className="col-xl-2 col-lg-2 col-md-2 col-sm-2 col-4 layout-spacing shadow inline">
                        <div className="widget widget-card-four">
                            <div className="widget-content">
                                <div className="w-content">
                                    <div className="w-info">
                                        <p className="value" id="AvgRate">0</p> 
                                        <p className="value" id="">Percentage</p><br></br>
                                        <h6 className="cardhead">Interest Earned</h6>
                                    </div>
                                </div>
                            </div>
                        </div>           
                    </div>
                    <div id = "summary4" className="col-xl-2 col-lg-2 col-md-2 col-sm-2 col-4 layout-spacing shadow">
                        <div className="widget widget-card-four">
                            <div className="widget-content">
                                <div className="w-content">
                                    <div className="w-info">
                                        <p className="value" id="AvgRate">0</p> 
                                        <p className="value" id="">Percentage</p><br></br>
                                        <h6 className="cardhead">% Earnings</h6>
                                    </div>
                                </div>
                            </div>
                        </div>           
                    </div>
                </div>
                {/* <div id = "whole">
                    <div>
                        <h1>{this.state.interestRate.Dai.compound}</h1>
                    </div>
                    <select
                        className="select-Asset"
                        onChange={this.handleAssetChange}
                    >
                        <option>ETH</option>
                        <option>DAI</option>
                        <option>USDC</option>
                    </select>
                </div> */}
                
                
                
                
                
            </div>
        );
    }
}
export default App;