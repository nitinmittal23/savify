import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import "./Home.css"
import savifyimage from './images/savify.png';
import savifycopy from './images/savify copy.png';
import savifyvid from './images/savifivid.mp4';
class Home extends Component {

    render() {
        return (


<div>
           
                <div className="main">
                    <nav>
                        <div className="logo">
                            <img src={savifycopy} alt="savify-copy" />
                        </div>
                        <div className="nav-links">
                            <ul>
                                <li><a href="#">Contact</a></li>
                                <li><a href="#">About Us</a></li>
                                <li><a href="#">Home</a></li>
                            </ul>
                        </div>
                    </nav>

                
                    <div className="title">
                        <h1>SaviFi</h1></div>

                    <div className="heading">
                        <h3> Your One Stop Smart Savings Accounts DeFi Platform</h3></div>


                    <div className="buttonstart">
                        <a href="/sav" className="btnbtn">Get Started</a>
                    </div>
                 </div>

                    <section id="about">
                        <div class="container">
                            <div class="row">
                                <div class ="col-md-6">
                                    <h2>About Us</h2>
                                        <div class="about-content">
                                        One Stop Smart Savings Account platform that provides the facility to a user to let SaviFi do the job of managing his fund’s hassle-free. We plan to enable this by automatically toggling the users' funds from one platform to another basis the interest rates being offered across various Defi platforms. We aim to also incorporate trending methods like Yield farming to leverage on Defi protocols and generate higher returns for our users.

                                        </div>

                                        <button type="button" class="btn btn-primary">White Paper>></button>
                                </div>
                                    <div class="col-md-6">
                                        <video autoPlay muted loop id="video" width= "500" height="300">
                                            <source src={savifyvid} type="video/mp4">

                                            </source>
                                        </video>
                                    </div>        
                                                        </div>
                        </div>
                    </section>

                    



                    </div>           
              

        );
    }
}

export default Home;