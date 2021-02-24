import './App.css';
import Navbar from './Navbar'
import Main from './Main'
import {BrowserRouter as Router, Route, Switch } from 'react-router-dom'
function App() {
  return (
    <Router>
    
    <div className="App">
    <Navbar/>    
      <div className="container2">
        <Switch>
          <Route exact path ="/">
              <Main/>
          </Route>
          <Route exact path ="/:country">
              <Main/>
          </Route>
        </Switch>
      </div>  
    </div>


    </Router>
  );
}

export default App;
