import React, { Component } from 'react';
import { Route ,Switch } from 'react-router-dom';
import Home from './Home.js';
import './App.css';
import Savify from './Savify.js';

class App extends Component {
  render() {
    return (
      <div>
        <Switch>
          <Route path='/' exact component={Home}/> 
          <Route path='/sav' exact component={Savify}/>        
        </Switch>
      </div>  
    );
  }
}

export default App;