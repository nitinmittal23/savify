import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import "./Home.css";
import savifyimage from './images/savify.png';

class Home extends Component {

    render() {
        return (
            <div id="container">
	            <div className="content">
                    <img src={savifyimage} alt="home-page" className="savify-image"/>
                    <h1>SaviFy</h1>
                    <h3>Ensuring the best returns on your Defi savings</h3>
                    <Link to='/sav'><button type="submit" id="btn">Start Saving</button></Link>
                </div>
            </div>
        );
    }
}

export default Home;