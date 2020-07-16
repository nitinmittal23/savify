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
        this.createAccount = this.createAccount.bind(this);
        this.deposit = this.deposit.bind(this);
        this.withdraw = this.withdraw.bind(this);
        this.state = {
            buttonText: "Connect",
            buttonDisabled: true,
            shortnerAddress: "",
            errMessage: "",
            interestRate: {
                dai: {
                    compound: 0,
                    aave: 0,
                    dydx: 0,
                },
                eth: {
                    compound: 0,
                    aave: 0,
                    dydx: 0,
                },
                usdc: {
                    compound: 0,
                    aave: 0,
                    dydx: 0,
                },
            },
            protocolassetPresent: {
                dai: "",
                eth: "",
                usdc: ""
            },
            protocolinterestmax: {
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
        this.login();
      
    }
  
    async componentWillMount() {
        
    }

    login = async () => {
        try {
            await this.loadWeb3();
            await this.loadBlockchainData();
        } catch (err) {
            this.setState({ buttonText: "Try Again", errMessage: "Please select Mainnet in your wallet" });
            //this.showErrorModal();   
        }
    };

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
            // var newDsaAddress = await dsa.build({
            //     gasPrice: this.state.web3.utils.toWei("27", "gwei"),
            // });
            this.setState({
                buttonDisabled: false,
                buttonText: "Create Account"
            })
        }
        else{
            existingDSAAddress = await dsa.getAccounts(this.state.account);
            this.setState({ 
                dsaAddress: existingDSAAddress[0].address, 
                dsa_id: existingDSAAddress[0].id,
                buttonDisabled: true
            });
            // Setting DSA Instance
            await dsa.setInstance(existingDSAAddress[0].id);
            await this.createUserdata(dsa);
            await this.dashboardupdate(dsa); 
            await this.showShortner()
            this.setState({ buttonText: this.state.shortnerAddress});
        }
        // change to this.state.account does this requires address as string?
          
    }
    async createAccount(){
        var newDsaAddress = await this.state.dsa.build({
            gasPrice: this.state.web3.utils.toWei("27", "gwei"),
        });
        await this.loadBlockchainData();
        await this.showShortner()
        this.setState({ buttonText: this.state.shortnerAddress});
    }

    async dashboardupdate(dsa){
        await this.getUserdata(dsa);
        await this.showInterestModal(dsa);
        await this.getAssetsPresentIn(dsa);
    }

    async showInterestModal(dsa){
        const com = await dsa.compound.getPosition(this.state.dsaAddress);
        const aav = await dsa.aave.getPosition(this.state.dsaAddress);
        const dd = await dsa.dydx.getPosition(this.state.dsaAddress);
        this.setState({
            interestRate: {
                dai: {
                    compound: com["dai"].supplyYield,
                    aave: aav["dai"].supplyYield,
                    dydx: dd["dai"].supplyYield
                },
                eth: {
                    compound: com["eth"].supplyYield,
                    aave: aav["eth"].supplyYield,
                    dydx: dd["eth"].supplyYield
                },
                usdc: {
                    compound: com["usdc"].supplyYield,
                    aave: aav["usdc"].supplyYield,
                    dydx: dd["usdc"].supplyYield
                }
            }
        });
        var dai;
        var eth;
        var usdc;
        
        if(this.state.interestRate.dai.compound >= this.state.interestRate.dai.aave && this.state.interestRate.dai.compound >= this.state.interestRate.dai.dydx){
            dai = "compound";
        } else if(this.state.interestRate.dai.aave >= this.state.interestRate.dai.compound && this.state.interestRate.dai.aave >= this.state.interestRate.dai.dydx){
            dai = "aave";
        } else if(this.state.interestRate.dai.dydx >= this.state.interestRate.dai.aave && this.state.interestRate.dai.dydx >= this.state.interestRate.dai.compound){
            dai = "dydx";
        }

        if(this.state.interestRate.eth.compound >= this.state.interestRate.eth.aave && this.state.interestRate.eth.compound >= this.state.interestRate.eth.dydx){
            eth = "compound";
        } else if(this.state.interestRate.eth.aave >= this.state.interestRate.eth.compound && this.state.interestRate.eth.aave >= this.state.interestRate.eth.dydx){
            eth = "aave";
        } else if(this.state.interestRate.eth.dydx >= this.state.interestRate.eth.aave && this.state.interestRate.eth.dydx >= this.state.interestRate.eth.compound){
            eth = "dydx";
        }

        if(this.state.interestRate.usdc.compound >= this.state.interestRate.usdc.aave && this.state.interestRate.usdc.compound >= this.state.interestRate.usdc.dydx){
            usdc = "compound";
        } else if(this.state.interestRate.usdc.aave >= this.state.interestRate.usdc.compound && this.state.interestRate.usdc.aave >= this.state.interestRate.usdc.dydx){
            usdc = "aave";
        } else if(this.state.interestRate.usdc.dydx >= this.state.interestRate.usdc.aave && this.state.interestRate.usdc.dydx >= this.state.interestRate.usdc.compound){
            usdc = "dydx";
        }
        this.setState({
            protocolinterestmax:{
                dai: dai,
                eth: eth,
                usdc: usdc
            }
        })

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
                    principalAmount : {
                        dai: res.data.Dai,
                        eth: res.data.Eth,
                        usdc: res.data.USDC
                    },
                    transaction: res.data.trans
                })
            })
            .catch((error) => {console.log(error);})
    };

    async getAssetsPresentIn(dsa){
        const com = await dsa.compound.getPosition(this.state.dsaAddress);
        const aav = await dsa.aave.getPosition(this.state.dsaAddress);
        const dd = await dsa.dydx.getPosition(this.state.dsaAddress);
        let daiprotocol= "";
        let daiamount = 0;
        let ethprotocol = "";
        let ethamount = 0;
        let usdcprotocol = "";
        let usdcamount = 0;

        if(com["dai"].supply>=aav["dai"].supply && com["dai"].supply>=dd["dai"].supply){
            daiprotocol = "compound";
            daiamount = com["dai"].supply;
        } else if (aav["dai"].supply>=com["dai"].supply && aav["dai"].supply>=dd["dai"].supply){
            daiprotocol = "aave";
            daiamount = aav["dai"].supply;
        } else if (dd["dai"].supply>=aav["dai"].supply && dd["dai"].supply>=com["dai"].supply){
            daiprotocol = "dydx";
            daiamount = dd["dai"].supply;
        }

        if(com["eth"].supply>=aav["eth"].supply && com["eth"].supply>=dd["eth"].supply){
            ethprotocol = "compound";
            ethamount = com["eth"].supply;
        } else if (aav["eth"].supply>=com["eth"].supply && aav["eth"].supply>=dd["eth"].supply){
            ethprotocol = "aave";
            ethamount = aav["eth"].supply;
        } else if (dd["eth"].supply>=aav["eth"].supply && dd["eth"].supply>=com["eth"].supply){
            ethprotocol = "dydx";
            ethamount = dd["eth"].supply;
        }

        if(com["usdc"].supply>=aav["usdc"].supply && com["usdc"].supply>=dd["usdc"].supply){
            usdcprotocol = "compound";
            usdcamount = com["usdc"].supply;
        } else if (aav["usdc"].supply>=com["usdc"].supply && aav["usdc"].supply>=dd["usdc"].supply){
            usdcprotocol = "aave";
            usdcamount = aav["usdc"].supply;
        } else if (dd["usdc"].supply>=aav["usdc"].supply && dd["usdc"].supply>=com["usdc"].supply){
            usdcprotocol = "dydx";
            usdcamount = dd["usdc"].supply;
        }
        
        this.setState({
            protocolassetPresent: {
                dai: daiprotocol,
                eth: ethprotocol,
                usdc: usdcprotocol
            },
            totalSupply : {
                dai: daiamount,
                eth: ethamount,
                usdc: usdcamount,
            },
        })
        
    }

    async updateUserData(dsa, amount, message ){
        const id = this.state.dsa_id;
        let daii;
        let ethh;
        let usdcc;
        if(this.state.assetSelected === "dai"){
            daii = this.state.principalAmount.dai + amount;
            ethh = this.state.principalAmount.eth;
            usdcc = this.state.principalAmount.usdc;
        }else if (this.state.assetSelected === "eth"){
            daii = this.state.principalAmount.dai;
            ethh = this.state.principalAmount.eth + amount;
            usdcc = this.state.principalAmount.usdc;
        } else if (this.state.assetSelected === "usdc"){
            daii = this.state.principalAmount.dai;
            ethh = this.state.principalAmount.eth;
            usdcc = this.state.principalAmount.usdc + amount;
        }
        const details = {
            fromTo: message,
            amount: Math.abs(amount),
            type: this.state.assetSelected,
            Dai: daii,
            Eth: ethh,
            USDC: usdcc
        }

        axios.post('http://localhost:1423/users/update/'+ id, details)
            .then(res => {
                console.log(res.data);
                this.dashboardupdate(this.state.dsa)
            });
    }



    async deposit(amount){
        try {
            let spells = await this.state.dsa.Spell();
            spells = await genericDSAdeposit(
                spells,
                this.state.protocolinterestmax[this.state.assetSelected],
                this.state.dsa.tokens.info[this.state.assetSelected].address,
                this.state.dsa.tokens.fromDecimal(amount, this.state.assetSelected)
            );
            const tx = await this.state.dsa.cast({spells: spells})
                .catch((err) => {
                    throw new Error("Transaction is likely to fail, Check you spells once!")
                });
            if (tx) { 
                var message = "deposit in " + this.state.protocolinterestmax[this.state.assetSelected];
                await this.updateUserData(this.state.dsa, amount, message )
                //update details in state;
            }
        } catch(err) {
            console.log(err.message)
        }
    }

    async withdraw(amount){
        try {
            let spells = await this.state.dsa.Spell();
            spells = await genericDSAwithdraw(
                spells,
                this.state.protocolassetPresent[this.state.assetSelected],
                this.state.dsa.tokens.info[this.state.assetSelected].address,
                this.state.dsa.tokens.fromDecimal(amount, this.state.assetSelected),
                this.state.account
            );
            const tx = await this.state.dsa.cast({spells: spells})
                .catch((err) => {
                    throw new Error("Transaction is likely to fail, Check you spells once!")
                });
            if (tx) { 
                var message = "withdraw from " + this.state.protocolassetPresent[this.state.assetSelected];
                await this.updateUserData(this.state.dsa, -1 * amount, message )
                //update details in state;
            }
        } catch(err) {
            console.log(err.message);
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
                        <button onClick={this.createAccount} align="right" disabled={this.state.buttonDisabled}>
                            {this.state.buttonText}{" "}
                        </button>
                    </div>    
                </div>

                <div id="mySidenav" className="sidenav shadow">
                    <p>DashBoard</p> <br></br>
                    <p>About us</p><br></br>
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
                                        <p className="value" id="AvgRate"></p> 
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
                        <option>{ETH}</option>
                        <option>DAI</option>
                        <option>USDC</option>
                    </select>
                </div> */}
                
                
                
                
                
            </div>
        );
    }
}
export default App;