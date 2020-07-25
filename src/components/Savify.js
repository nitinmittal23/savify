import React, { Component } from "react";
import Web3 from "web3";
import Authereum from "authereum";
import Modal from "react-bootstrap/Modal";
import Web3Modal from "web3modal";
import "bootstrap/dist/css/bootstrap.min.css";
import "./savify.css";
import "./smart-bots-frontend/assets/css/loader.css";
import "./smart-bots-frontend/assets/css/plugins.css";
import "./smart-bots-frontend/bootstrap/css/bootstrap.min.css";
import "./smart-bots-frontend/assets/css/structure.css";
import "./smart-bots-frontend/plugins/apex/apexcharts.css";
import "./smart-bots-frontend/assets/css/widgets/modules-widgets.css";
import savifycopy from './images/savify copy.png';
import compoundf from './images/compoundf.png';
import aave from './images/aave.jpg';
import dxdy from './images/dxdy.PNG';
import curve from './images/curve.png';
import maker from './images/maker.jpg';
import dai from './images/dai.PNG';
import eth from './images/eth.png';
import usdc from './images/usdc.PNG';
import btc from './images/btc.PNG';
import usdt from './images/usdt.PNG';
import zrx from './images/zrx.PNG';
import axios from 'axios';
import dashboard from "./images/download.png";





import Footer from "./footer.js";
import {genericDSAtoggle, genericDSAdeposit, genericDSAwithdraw} from "../DSA/utils";
import {genericResolver, getBalances} from "../DSA/resolvers";

const DSA = require("dsa-sdk");

const Transaction = props => (
    <li key = {props.transaction._id.toString()}>
        <div className="item-timeline timeline-new">
            <div className="t-dot">
                <div className="t-danger"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-check"><polyline points="20 6 9 17 4 12"></polyline></svg></div>
            </div>
            <div className="t-content">
                <p id = "time" style = {{color:"black"}}>{props.transaction.createdAt}</p>
                <p style = {{fontWeight: "bold", color:"black"}}>DAI {props.transaction.Daiamount}</p>
                <p id = "text"><span>{props.transaction.fromTodai}</span></p>
                
                <p style = {{fontWeight: "bold", color:"black"}}>ETH {props.transaction.Ethamount}</p>
                <p id = "text"><span>{props.transaction.fromToeth}</span></p>
               
                <p style = {{fontWeight: "bold", color:"black"}}>USDC {props.transaction.Usdcamount}</p>
                <p id = "text"><span>{props.transaction.fromTousdc}</span></p>
                
            </div>
        </div>
    </li>
)

class App extends Component {
    constructor(props) {
        super(props);
        this.onChangeprotocol = this.onChangeprotocol.bind(this);
        this.onChangetransaction = this.onChangetransaction.bind(this);
        this.onChangeselectedAsset = this.onChangeselectedAsset.bind(this);
        this.onChangeToggleSelectedAsset = this.onChangeToggleSelectedAsset.bind(this);
        this.onChangeAmount = this.onChangeAmount.bind(this);
        this.createAccount = this.createAccount.bind(this);
        this.deposit = this.deposit.bind(this);
        this.withdraw = this.withdraw.bind(this);
        this.loadBlockchainData = this.loadBlockchainData.bind(this);
        this.showInterestModal = this.showInterestModal.bind(this);
        this.toggle = this.toggle.bind(this);
        this.getAssetsPresentIn = this.getAssetsPresentIn.bind(this);
        this.deposit = this.deposit.bind(this);
        this.withdraw = this.withdraw.bind(this);
        this.handleAssetChange = this.handleAssetChange.bind(this);
        this.updateToggleTransaction = this.updateToggleTransaction.bind(this);
        this.updateUserData = this.updateUserData.bind(this);
        this.getUserdata = this.getUserdata.bind(this);
        this.createUserdata = this.createUserdata.bind(this);
        this.dashboardupdate = this.dashboardupdate.bind(this);


        this.state = {
            resolvers: {
                compound: {},
                maker: {},
                aave: {},
                dydx: {},
                curve: {}
            },
            amount: 0,
            buttonText: "Connect",
            buttonDisabled: true,
            shortnerAddress: "",
            errMessage: "",
            interestRate: {
                dai: {
                    compound: 0,
                    aave: 0,
                    dydx: 0,
                    maker: 0,
                    curve: 0,
                },
                eth: {
                    compound: 0,
                    aave: 0,
                    dydx: 0,
                    maker: 0,
                    curve: 0,
                },
                usdc: {
                    compound: 0,
                    aave: 0,
                    dydx: 0,
                    maker: 0,
                    curve: 0,
                },
                wbtc: {
                    compound: 0,
                    aave: 0,
                    dydx: 0,
                    maker: 0,
                    curve: 0,
                },
                usdt: {
                    compound: 0,
                    aave: 0,
                    dydx: 0,
                    maker: 0,
                    curve: 0,
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
            transaction: [],
            dsa_id: 0,
            assetSelected: "eth",
            toggleassetSelected: "eth",
            amount: 0,
            
        };
        this.login();
      
    }

    login = async () => {
        try {
            await this.loadWeb3();
            await this.loadBlockchainData();
        } catch (err) {
            this.setState({ buttonText: "Not Connected", errMessage: "Please select Mainnet in your wallet" });
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
            await this.showInterestModal(dsa);
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
        const com = await dsa.compound.getPosition("0x89577F822F1a7c026855314CE346E6AEf46ee495");
        const aav = await dsa.aave.getPosition("0x89577F822F1a7c026855314CE346E6AEf46ee495");
        const dd = await dsa.dydx.getPosition("0x89577F822F1a7c026855314CE346E6AEf46ee495");
        const mak = await dsa.maker.getDaiPosition("0x89577F822F1a7c026855314CE346E6AEf46ee495");
        const cur = await dsa.curve_susd.getPosition("0x89577F822F1a7c026855314CE346E6AEf46ee495");
        console.log(dd);
        this.setState({
            interestRate: {
                dai: {
                    compound: com["dai"].supplyYield,
                    aave: aav["dai"].supplyYield,
                    dydx: dd["dai"].supplyYield,
                    maker: mak.rate,
                    curve: 0,
                },
                eth: {
                    compound: com["eth"].supplyYield,
                    aave: aav["eth"].supplyYield,
                    dydx: dd["eth"].supplyYield,
                    maker: 0,
                    curve: 0,
                },
                usdc: {
                    compound: com["usdc"].supplyYield,
                    aave: aav["usdc"].supplyYield,
                    dydx: dd["usdc"].supplyYield,
                    maker: 0,
                    curve: 0,
                },
                wbtc: {
                    compound: com["wbtc"].supplyYield,
                    aave: aav["wbtc"].supplyYield,
                    dydx: 0,
                    maker: 0,
                    curve: 0,
                },
                usdt: {
                    compound: com["usdt"].supplyYield,
                    aave: aav["usdt"].supplyYield,
                    dydx: 0,
                    maker: 0,
                    curve: 0,
                }
            },
            resolvers: {
                compound: com,
                maker: mak,
                aave: aav,
                dydx: dd,
                curve: cur
            },

        });
        console.log(this.state.resolvers.compound["dai"].supplyYield)
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
        
        let daiprotocol= "NA";
        let daiamount = 0;
        let ethprotocol = "NA";
        let ethamount = 0;
        let usdcprotocol = "NA";
        let usdcamount = 0;

        if(com["dai"].supply>aav["dai"].supply && com["dai"].supply>dd["dai"].supply){
            daiprotocol = "compound";
            daiamount = com["dai"].supply;
        } else if (aav["dai"].supply>com["dai"].supply && aav["dai"].supply>dd["dai"].supply){
            daiprotocol = "aave";
            daiamount = aav["dai"].supply;
        } else if (dd["dai"].supply>aav["dai"].supply && dd["dai"].supply>com["dai"].supply){
            daiprotocol = "dydx";
            daiamount = dd["dai"].supply;
        }

        if(com["eth"].supply>aav["eth"].supply && com["eth"].supply>dd["eth"].supply){
            ethprotocol = "compound";
            ethamount = com["eth"].supply;
        } else if (aav["eth"].supply>com["eth"].supply && aav["eth"].supply>dd["eth"].supply){
            ethprotocol = "aave";
            ethamount = aav["eth"].supply;
        } else if (dd["eth"].supply>aav["eth"].supply && dd["eth"].supply>com["eth"].supply){
            ethprotocol = "dydx";
            ethamount = dd["eth"].supply;
        }

        if(com["usdc"].supply>aav["usdc"].supply && com["usdc"].supply>dd["usdc"].supply){
            usdcprotocol = "compound";
            usdcamount = com["usdc"].supply;
        } else if (aav["usdc"].supply>com["usdc"].supply && aav["usdc"].supply>dd["usdc"].supply){
            usdcprotocol = "aave";
            usdcamount = aav["usdc"].supply;
        } else if (dd["usdc"].supply>aav["usdc"].supply && dd["usdc"].supply>com["usdc"].supply){
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

    async updateUserData(amount, message){
        const id = this.state.dsa_id;
        let daimessage = "No change";
        let ethmessage= "No change";
        let usdcmessage = "No change";
        let daii;
        let ethh;
        let usdcc;
        let daiamount = 0;
        let ethamount = 0;
        let usdcamount = 0;
        if(this.state.assetSelected === "dai"){
            daii = this.state.principalAmount.dai + amount;
            ethh = this.state.principalAmount.eth;
            usdcc = this.state.principalAmount.usdc;
            daimessage = message
            daiamount = Math.abs(amount);
        }else if (this.state.assetSelected === "eth"){
            daii = this.state.principalAmount.dai;
            ethh = this.state.principalAmount.eth + amount;
            usdcc = this.state.principalAmount.usdc;
            ethmessage = message
            ethamount = Math.abs(amount);
        } else if (this.state.assetSelected === "usdc"){
            daii = this.state.principalAmount.dai;
            ethh = this.state.principalAmount.eth;
            usdcc = this.state.principalAmount.usdc + amount;
            daimessage = message
            daiamount = Math.abs(amount);
        }
        const details = {
            fromTodai: daimessage,
            fromToeth: ethmessage,
            fromTousdc: usdcmessage,
            Daiamount: daiamount,
            Ethamount: ethamount,
            Usdcamount: usdcamount,
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

    async updateToggleTransaction(message1, message2, message3, ethchange, daichange, usdcchange){
        const id = this.state.dsa_id;
        let daiamount = 0;
        let ethamount = 0;
        let usdcamount = 0;
        if(daichange === true){daiamount = this.state.totalSupply.dai;}
        if(ethchange === true){ethamount = this.state.totalSupply.eth;}
        if(usdcchange === true){usdcamount = this.state.totalSupply.usdc;}
        const details = {
            fromTodai: message2,
            fromToeth: message1,
            fromTousdc: message3,
            Daiamount: daiamount,
            Ethamount: ethamount,
            Usdcamount: usdcamount,
            Dai: this.state.principalAmount.dai,
            Eth: this.state.principalAmount.eth,
            USDC: this.state.principalAmount.usdc
        }
        axios.post('http://localhost:1423/users/update/'+ id, details)
            .then(res => {
                console.log(res.data);
                this.dashboardupdate(this.state.dsa)
            });
    }

    async deposit(){
        try {
            let amount = this.state.amount;
            let spells = await this.state.dsa.Spell();
            spells = await genericDSAdeposit(
                spells,
                this.state.protocolinterestmax[this.state.assetSelected],
                this.state.dsa.tokens.info[this.state.assetSelected].address,
                this.state.dsa.tokens.fromDecimal(amount, this.state.assetSelected)
            );
            console.log(spells)
            const tx = await this.state.dsa.cast({spells: spells})
                .catch((err) => {
                    throw new Error("Transaction is likely to fail, Check you spells once!")
                });
            if (tx) { 
                var message = "deposit in " + this.state.protocolinterestmax[this.state.assetSelected];
                await this.updateUserData(amount, message )
            }
        } catch(err) {
            console.log(err.message)
        }
    }

    async withdraw(){
        try {
            let amount = this.state.amount;
            if(this.state.protocolassetPresent[this.state.assetSelected]!=="NA"){
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
                    await this.updateUserData(-1 * amount, message )
                    //update details in state;
                }
            }
            
        } catch(err) {
            console.log(err.message);
        }
    }

    async toggle(){
        var message1 = "No change in ETH";
        var message2 = "No change in DAI";
        var message3 = "No change in USDC";
        var daichange = false;
        var ethchange = false;
        var usdcchange = false;
        
        try {
            let spells = await this.state.dsa.Spell();
            if(this.state.dsa.totalSupply["eth"]>0){
                if((this.state.protocolassetPresent["eth"] !== this.state.protocolinterestmax["eth"]) && (this.state.protocolassetPresent["eth"] !== "NA") ){
                    message1 = this.state.protocolassetPresent["eth"] +  " to " + this.state.protocolinterestmax["eth"];
                    ethchange = true;
                    spells = await genericDSAtoggle(
                        spells,
                        this.state.protocolassetPresent["eth"],
                        this.state.protocolinterestmax["eth"],
                        this.state.dsa.tokens.info["eth"].address,
                        this.state.dsa.tokens.fromDecimal(this.state.totalSupply[this.state.toggleassetSelected] , "eth")
                    );
                }
            }
            if(this.state.totalSupply["dai"]>0){
                console.log(this.state.protocolassetPresent["dai"]);
                console.log(this.state.protocolinterestmax["dai"])
                if((this.state.protocolassetPresent["dai"] !== this.state.protocolinterestmax["dai"]) && (this.state.protocolassetPresent["dai"] !== "NA")){
                    message2 = this.state.protocolassetPresent["dai"] +  " to " + this.state.protocolinterestmax["dai"];
                    ethchange = true;
                    spells = await genericDSAtoggle(
                        spells,
                        this.state.protocolassetPresent["dai"],
                        this.state.protocolinterestmax["dai"],
                        this.state.dsa.tokens.info["dai"].address,
                        this.state.dsa.tokens.fromDecimal(this.state.totalSupply[this.state.toggleassetSelected] , "dai")
                    );
                }
            }
            if(this.state.dsa.totalSupply["usdc"]>0){
                if((this.state.protocolassetPresent["usdc"] !== this.state.protocolinterestmax["usdc"]) && (this.state.protocolassetPresent["usdc"] !== "NA")){
                    message3 = this.state.protocolassetPresent["usdc"] +  " to " + this.state.protocolinterestmax["usdc"];
                    usdcchange = true;
                    spells = await genericDSAtoggle(
                        spells,
                        this.state.protocolassetPresent["usdc"],
                        this.state.protocolinterestmax["usdc"],
                        this.state.dsa.tokens.info["usdc"].address,
                        this.state.dsa.tokens.fromDecimal(this.state.totalSupply[this.state.toggleassetSelected] , "usdc")
                    );
                }
            }
            
            const tx = await this.state.dsa.cast({spells: spells})
                .catch((err) => {
                    throw new Error("Transaction is likely to fail, Check you spells once!")
                });
            if (tx) { 
                await this.updateToggleTransaction(message1, message2, message3, ethchange, daichange, usdcchange);
            }
        } catch(err) {
            console.log(err.message)
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

    onChangeToggleSelectedAsset (e) {
        this.setState({
            toggleassetSelected: e.target.value
        })
    }

    onChangeAmount(evt) {
        try {
            this.setState({ amount: evt.target.value });
        } catch (err) {
            console.log(err);
        }
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

    transactionList() {
        return this.state.transaction.map(currenttransaction => {
          return <Transaction transaction={currenttransaction}/>;
        })
    }

    render() {
        return (
            <div>
                
                <div className="header-container fixed-top">
                    <div> 
                        <img src={savifycopy} alt="SaviFi"  style={{
                                                                    paddingLeft: "25px",
                                                                    paddingRight: "25px",
                                                                    width: "210px",
                                                                    height: "80px",
                                                                    backgroundColor: "azure"
                            }} align="left" />
                    </div>
                    
                    <header className="header navbar navbar-expand-sm">
                        <a className="sidebarCollapse" data-placement="bottom"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-list"></svg></a>
                            <div className="media">
                                <div className="user-img">
                                    <div className="avatar avatar-xl">
                                        <span className="avatar-title rounded-circle"></span>
                                    </div>
                                </div>
                                <div className="media-body">
                                    <div className="" id = "loginbutton">
                                        {/* <h5 className="usr-name" id="accountValue">No Account Created</h5> */}
                                        <button onClick={this.createAccount} align="right" disabled={this.state.buttonDisabled}>
                                            {this.state.buttonText}{" "}
                                        </button>
                                    </div>
                                </div>
                            </div>
                    </header>
                </div>

                <div className="main-container" id="container">
                    <div className="overlay"></div>
                    <div className="cs-overlay"></div>
                    <div className="search-overlay"></div>

                    <div className="sidebar-wrapper sidebar-theme">
                        <nav id="compactSidebar">
                            <ul className="menu-categories">
                                <li className="menu active">
                                    <a href="#dashboard" data-active="true" className="menu-toggle">
                                        <div className="base-menu">
                                            <div className="base-icons">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-home"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>
                                            </div>
                                            <span>Dashboard</span>
                                        </div>
                                    </a>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-chevron-left"><polyline points="15 18 9 12 15 6"></polyline></svg>
                                </li>

                                <li className="menu">
                                    <a href="https://drive.google.com/file/d/1VeQa-g64T1_vmTa8CJuYMTsgeGXC26ND/view" data-active="false" className="menu-toggle">
                                        <div className="base-menu">
                                            <div className="base-icons">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-cpu"><rect x="4" y="4" width="16" height="16" rx="2" ry="2"></rect><rect x="9" y="9" width="6" height="6"></rect><line x1="9" y1="1" x2="9" y2="4"></line><line x1="15" y1="1" x2="15" y2="4"></line><line x1="9" y1="20" x2="9" y2="23"></line><line x1="15" y1="20" x2="15" y2="23"></line><line x1="20" y1="9" x2="23" y2="9"></line><line x1="20" y1="14" x2="23" y2="14"></line><line x1="1" y1="9" x2="4" y2="9"></line><line x1="1" y1="14" x2="4" y2="14"></line></svg>
                                            </div>
                                            <span>White Paper</span>
                                        </div>
                                    </a>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-chevron-left"><polyline points="15 18 9 12 15 6"></polyline></svg>
                                </li>
                            </ul>
                        </nav>

                        <div id="compact_submenuSidebar" className="submenu-sidebar">

                            <div className="submenu" id="dashboard">
                                <ul className="submenu-list" data-parent-element="#dashboard"> 
                                    <li className="active">
                                        <a href="index.html"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-pie-chart"><path d="M21.21 15.89A10 10 0 1 1 8 2.83"></path><path d="M22 12A10 10 0 0 0 12 2v10z"></path></svg> Analytics </a>
                                    </li>
                                </ul>
                            </div>

                            <div className="submenu" id="about us">
                                
                            </div>
                        </div>

                    </div>

                    <div id="content" className="main-content">
                        <div className="layout-px-spacing">
                            <div className="page-header">
                                <div className="page-title">
                                    <h3>Dashboard</h3>
                                </div>
                            </div>
                            <div className="row sales layout-top-spacing">
                                <div className="col-xl-3 col-lg-2 col-md-2 col-sm-2 col-4 layout-spacing">
                                    <div className="widget widget-card-four">
                                        <div className="widget-content">
                                            <div className="w-content">
                                                <div className="w-info">
                                                    <p className="value" id="AvgRate">0</p> 
                                                    <p className="value" id="">Percentage</p>
                                                    <h6 className="">% Earnings</h6>
                                                </div>
                                                <div className=""></div>
                                                </div>
                                            <div className="progress">
                                                <div className="progress-bar bg-gradient-secondary" role="progressbar" style={{width: "57%"}} aria-valuenow="57" aria-valuemin="0" aria-valuemax="100"></div>
                                            </div>
                                        </div>
                                    </div>           
                                </div>
                                <div className="col-xl-3 col-lg-2 col-md-2 col-sm-2 col-4 layout-spacing">
                                    <div className="widget widget-card-four">
                                        <div className="widget-content">
                                            <div className="w-content">
                                                <div className="w-info">
                                                    <p className="value" id ="intEarned">0</p> 
                                                    <p className="value" id="">DAI</p>
                                                    <h6 className="">Interest Earned</h6>
                                                </div>
                                                <div className=""></div>
                                                </div>
                                            <div className="progress">
                                                <div className="progress-bar bg-gradient-secondary" role="progressbar" style={{width: "57%"}} aria-valuenow="57" aria-valuemin="0" aria-valuemax="100"></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-xl-3 col-lg-2 col-md-2 col-sm-2 col-4 layout-spacing">
                                    <div className="widget widget-card-four">
                                        <div className="widget-content">
                                            <div className="w-content">
                                                <div className="w-info">
                                                    <p className="value" id = "PAmount">0</p> 
                                                    <p className="value" id="">DAI</p>
                                                    <h6 className="">Principal Amount</h6>
                                                </div>
                                            <div className=""></div>          
                                            </div>
                                            <div className="progress">
                                                <div className="progress-bar bg-gradient-secondary" role="progressbar" style={{width: "57%"}} aria-valuenow="57" aria-valuemin="0" aria-valuemax="100"></div>
                                            </div>
                                        </div>
                                    </div>
                                    <br></br>
                                </div>
                                <div className="col-xl-3 col-lg-2 col-md-2 col-sm-2 col-4 layout-spacing">
                                    <div className="widget widget-card-four">
                                        <div className="widget-content">
                                            <div className="w-content">
                                                <div className="w-info">
                                                    <p className="value" id="totalSupply">0</p>
                                                    <p className="value" id="">DAI</p>
                                                    <h6 className="">A/C Summary</h6>
                                                </div> 
                                            </div>
                                            <div className="progress">
                                                <div className="progress-bar bg-gradient-secondary" role="progressbar" style={{width: "57%"}} aria-valuenow="57" aria-valuemin="0" aria-valuemax="100"></div>
                                            </div>
                                        </div>
                                    </div>    
                                </div>

                                 
                                <div className="col-xl-3 col-lg-2 col-md-2 col-sm-2 col-4 layout-spacing">
                                    <div className="widget widget-activity-three">
                                        <div className="widget-heading">
                                            <h5 className="">Investment Summary </h5>
                                        </div>
                                    <div style={{overflowY: "scroll", 
                                            height:"450px" }} 
                                            dir="ltr">
                                        <div className="widget-content">
                                            <div className="vistorsBrowser">
                                                <div className="browser-list">
                                                    <div className="w-icon">
                                                        <a href=""><img src={compoundf} className="flag-width" alt="compoundf" style= {{ width:"40px" }} /></a>
                                                    </div>
                                                    <div className="w-browser-details">
                                                        <div className="w-browser-info">
                                                            <h6>Compound</h6>
                                                            <p className="browser-count" id = "cpercent">0%</p>
                                                        </div>
                                                        <div className="w-browser-stats">
                                                            <div className="progress" dir="rtl">
                                                                <div className="progress-bar bg-gradient-primary" role="progressbar" style={{width: "45%"}} aria-valuenow="45" aria-valuemin="0" aria-valuemax="100"></div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="browser-list">
                                                    <div className="w-icon">
                                                        <a  href=""><img src={aave} className="flag-width" alt="aave" style= {{width:"40px"}}/></a>
                                                    </div>
                                                    <div className="w-browser-details">
                                                        
                                                        <div className="w-browser-info">
                                                            <h6>Aave</h6>
                                                            <p className="browser-count" id = "mpercent">0%</p>
                                                        </div>

                                                        <div className="w-browser-stats">
                                                            <div className="progress" dir="rtl">
                                                                <div className="progress-bar bg-gradient-warning" role="progressbar" style={{width: "45%"}} aria-valuenow="45" aria-valuemin="0" aria-valuemax="100"></div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="browser-list">
                                                    <div className="w-icon">
                                                        <a  href=""><img src={dxdy} className="flag-width" alt="dxdy" style= {{width:"40px"}}/></a>
                                                    </div>
                                                    <div className="w-browser-details">
                                                        
                                                        <div className="w-browser-info">
                                                            <h6>dydx</h6>
                                                            <p className="browser-count" id = "mpercent">0%</p>
                                                        </div>

                                                        <div className="w-browser-stats">
                                                            <div className="progress" dir="rtl">
                                                                <div className="progress-bar bg-gradient-dark" role="progressbar" style={{width: "45%"}} aria-valuenow="45" aria-valuemin="0" aria-valuemax="100"></div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="browser-list">
                                                    <div className="w-icon">
                                                        <a data-img-value="de" href=""><img src={curve} className="flag-width" alt="curve" style=  {{width:"40px"}}/></a>
                                                    </div>
                                                    <div className="w-browser-details">
                                                        
                                                        <div className="w-browser-info">
                                                            <h6>Curve</h6>
                                                            <p className="browser-count" id = "mpercent">0%</p>
                                                        </div>

                                                        <div className="w-browser-stats">
                                                            <div className="progress" dir="rtl">
                                                                <div className="progress-bar bg-gradient-success" role="progressbar" style={{width: "45%"}} aria-valuenow="45" aria-valuemin="0" aria-valuemax="100"></div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="browser-list">
                                                    <div className="w-icon">
                                                        <a  href=""><img src={maker} className="flag-width" alt="maker" style= {{ width:"40px" }} /></a>
                                                    </div>
                                                    <div className="w-browser-details">  
                                                        <div className="w-browser-info">
                                                            <h6>Maker Dao</h6>
                                                            <p className="browser-count">0%</p>
                                                        </div>
                                                        <div className="w-browser-stats">
                                                            <div className="progress" dir="rtl">
                                                                <div className="progress-bar bg-gradient-danger" role="progressbar" style={{width: "45%"}} aria-valuenow="45" aria-valuemin="0" aria-valuemax="100" ></div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                </div>
                     
                    <div className="col-xl-6 col-lg-6 col-md-2 col-sm-2 col-4 layout-spacing">
                                    <div className="widget widget-activity-four">
                                        <div className="layout-px-spacing">
                                    
                                            <div className= "panel-body text-center">
                                                <button onClick={this.withdraw} className="button" id="withdraw" >Withdraw</button>
                                                <button onClick={this.deposit} className="button" id="deposit" >Deposit </button>
                                            </div>
                                            <br></br>
                                            <div className="panel-body text-center">
                                                <form action="/action_page.php" method="get">
                                                    <select  id="token"  className="select-Asset"
                                                    onChange={this.handleAssetChange} style={{height:"40px", width:"70px", marginLeft:"20px"}}>

                                                        <option value="eth">Eth </option>
                                                        <option value="dai">Dai</option>
                                                        <option value="usdc">USDC</option>
                                                    </select>
                                                    <input list="hosting-plan"  type="number"
                                                        onChange={this.onChangeAmount}
                                                        placeholder={`Amount`}  id="asset"  style={{height:"40px", width:"330px"}} />
                                                </form>
                                                <br></br>     
                                                <button onClick={this.toggle} className="button" id="optimize"  >Optimize
                                                </button>
                                            </div>
                                            <br></br>

                                            <div className=" col-xl-12 col-lg-6 col-md-6 col-sm-12 col-12 layout-spacing " >
        
                                            <div className="widget widget-table-one" >
                                                <div className= "widget-heading ">
                                                    <h5 className="">Token Summary</h5>
                                                </div>
                                                <div style={{overflowY: "scroll",
                                                        height:"250px"}}
                                                        dir="ltr">
                                                    <div className="widget-content" >
                                                        <div className="transactions-list"  >
                                                            <div className="t-item" >
                                                                <div className="t-company-name">
                                                                    <div className="icon">
                                                                        <img src={dai} className="flag-width" alt= "dai" style={{width:"40px"}} />
                                                                    </div>
                                                                    <div className="t-name">
                                                                        <h4>{this.state.totalSupply.dai.toFixed(5)} Dai</h4>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="transactions-list" >
                                                            <div className="t-item">
                                                                <div className="t-company-name">
                                                                    <div className= "icon">
                                                                        <img src={eth} className="flag-width" alt= "eth" style={{width:"40px"}}/>
                                                                    </div>
                                                                    <div className="t-name">
                                                                        <h4>{this.state.totalSupply.eth.toFixed(5)} Ether</h4>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="transactions-list"  >
                                                            <div className="t-item" >
                                                                <div className="t-company-name">
                                                                    <div className="icon">
                                                                        <img src={usdc} className="flag-width" alt="usdc" style= {{width:"40px", margin:"0px 5px"}}/>
                                                                    </div>
                                                                    <div className="t-name">
                                                                        <h4>{this.state.totalSupply.usdc.toFixed(5)} USDC</h4>
                                                                    </div>
                                                                </div>    
                                                            </div>
                                                        </div>
                                                        <div className="transactions-list"  >
                                                            <div className="t-item" >
                                                                <div className="t-company-name">
                                                                    <div className="icon">
                                                                        <img src={btc} className="flag-width" alt= "flag" style={{width:"40px",margin:"0px 5px"}}/>
                                                                    </div>
                                                                    <div className="t-name">
                                                                        <h4>0 WBTC</h4>
                                                                    </div>
                                                                </div>    
                                                            </div>       
                                                        </div>
                                                        <div className="transactions-list" >
                                                            <div className="t-item">
                                                                <div className="t-company-name">
                                                                    <div className= "icon">
                                                                        <img src={usdt} className="flag-width" alt="usdt" style= {{width:"40px"}}/>
                                                                    </div>
                                                                    <div className="t-name">
                                                                        <h4>0 USDT</h4>
                                                                    </div>
                                                                </div>    
                                                            </div>
                                                        </div>
                                                        <div className="transactions-list" >
                                                            <div className="t-item">
                                                                <div className="t-company-name">
                                                                    <div className= "icon">
                                                                        <img src={zrx} className="flag-width" alt="zrx" style= {{width:"40px"}}/>
                                                                    </div>
                                                                    <div className="t-name">
                                                                        <h4>0 ZRX</h4>
                                                                </div>
                                                                </div> 
                                                            </div>
                                                        </div>
                                                        <div className="transactions-list" >
                                                            <div className="t-item">
                                                                <div className="t-company-name">
                                                                    <div className= "icon">
                                                                        <img src={maker} className="flag-width" alt="maker" style= {{width:"40px",margin:"0px 5px"}}/>
                                                                    </div>
                                                                    <div className="t-name">
                                                                        <h4>0 MKR</h4>
                                                                   </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                </div>

                                    
        

                                    </div>
                                </div>
                           
                                <div className="col-xl-3 col-lg-2 col-md-2 col-sm-2 col-4 layout-spacing">
                                    <div className="widget widget-activity-three">
                                        <div className="widget-heading">
                                            <h5 className="">Transfer Logs</h5>
                                        </div>
                                        <div className="widget-content">
                                            <div className="mt-container mx-auto">
                                                <div className="timeline-line">
                                                    { this.transactionList() }         
                                                </div>
                                            </div> 
                                        </div>
                                    </div> 
                                </div>
                                <div className="col-xl-12 col-lg-6 col-md-2 col-sm-2 col-2 layout-spacing" >
                                    <div className="widget widget-activity-four">

                                        <div className="widget-heading">
                                            <h5 className=""> Supply Interest Rate</h5>
                                        </div>
                                        <div className="widget-content">
                                            <div style={{ overflowY: "scroll", height: "300px" }} dir="ltr">
                                                <table className="table">
                                                    <thead>
                                                        <tr >
                                                            <th><div className="th-content"></div></th>
                                                            <th>
                                                                <div className="th-content">
                                                                    <div className="w-icon" >
                                                                        <a href=""><img src={compoundf} className="flag-width" alt="compoundf" style={{ width: "50px" }} /></a>
                                                                    </div>
                                                                </div>
                                                            </th>
                                                            <th>
                                                                <div className="th-content">
                                                                    <div className="w-icon">
                                                                        <a href=""><img src={aave} className="flag-width" alt="aave" style={{ width: "50px" }} /></a>
                                                                    </div>
                                                                </div>
                                                            </th>
                                                            <th>
                                                                <div className="th-content">
                                                                    <div className="w-icon">
                                                                        <a href=""><img src={dxdy} className="flag-width" alt="dxdy" style={{ width: "50px" }} /></a>
                                                                    </div>
                                                                </div>
                                                            </th>
                                                            <th>
                                                                <div className="th-content th-heading">
                                                                    <div className="w-icon">
                                                                        <a href=""><img src={curve} className="flag-width" alt="curve" style={{ width: "40px" }} /></a>
                                                                    </div>
                                                                </div>
                                                            </th>

                                                            <th>
                                                                <div className="th-content">
                                                                    <div className="w-icon">
                                                                        <a href=""><img src={maker} className="flag-width" alt="maker" style={{ width: "40px" }} /></a>
                                                                    </div>
                                                                </div>
                                                            </th>

                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        <tr >
                                                            <td><div className="td-content product-name" ><h5>DAI</h5></div></td>
                                                            <td><div className="td-content"></div>{this.state.interestRate.dai.compound.toFixed(3)} %</td>
                                                            <td><div className="td-content"></div>{this.state.interestRate.dai.aave.toFixed(3)} %</td>
                                                            <td><div className="td-content"></div>{this.state.interestRate.dai.dydx.toFixed(3)} %</td>
                                                            <td><div className="td-content"></div>-</td>
                                                            <td><div className="td-content"></div>{this.state.interestRate.dai.maker.toFixed(3)} %</td>

                                                        </tr>
                                                        <tr >
                                                            <td><div className="td-content product-name"><h5>ETH</h5></div></td>
                                                            <td><div className="td-content"></div>{this.state.interestRate.eth.compound.toFixed(3)} %</td>
                                                            <td><div className="td-content"></div>{this.state.interestRate.eth.aave.toFixed(3)} %</td>
                                                            <td><div className="td-content"></div>{this.state.interestRate.eth.dydx.toFixed(3)} %</td>
                                                            <td><div className="td-content"></div>-</td>
                                                            <td><div className="td-content"></div>-</td>
                                                        </tr>
                                                        <tr>
                                                            <td><div className="td-content product-name"><h5>USDC</h5></div></td>
                                                            <td><div className="td-content"></div>{this.state.interestRate.usdc.compound.toFixed(3)} %</td>
                                                            <td><div className="td-content"></div>{this.state.interestRate.usdc.aave.toFixed(3)} %</td>
                                                            <td><div className="td-content"></div>{this.state.interestRate.usdc.dydx.toFixed(3)} %</td>
                                                            <td><div className="td-content"></div>-</td>
                                                            <td><div className="td-content"></div>-</td>

                                                        </tr>
                                                        <tr >
                                                            <td><div className="td-content product-name"><h5>WBTC</h5></div></td>
                                                            <td><div className="td-content"></div>{this.state.interestRate.wbtc.compound.toFixed(3)} %</td>
                                                            <td><div className="td-content"></div>{this.state.interestRate.wbtc.aave.toFixed(3)} %</td>
                                                            <td><div className="td-content"></div>-</td>
                                                            <td><div className="td-content"></div>-</td>
                                                            <td><div className="td-content"></div>-</td>

                                                        </tr>
                                                        <tr>
                                                            <td><div className="td-content product-name"><h5>USDT</h5></div></td>
                                                            <td><div className="td-content"></div>{this.state.interestRate.usdt.compound.toFixed(3)} %</td>
                                                            <td><div className="td-content"></div>{this.state.interestRate.usdt.aave.toFixed(3)} %</td>
                                                            <td><div className="td-content"></div>-</td>
                                                            <td><div className="td-content"></div>-</td>
                                                            <td><div className="td-content"></div>-</td>

                                                        </tr>
                         


                                                    </tbody>
                                                </table>  
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                

                <div style={{alignContent: "center"}}>
                    <Footer />
                </div>

            </div>    
        );
    }
}

export default App;