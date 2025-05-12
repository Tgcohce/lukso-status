import React from 'react';
import { HashRouter as Router, Switch, Route, Redirect } from 'react-router-dom';
import Home from './components/Home';
import ProfileViewer from './components/ProfileViewer';
import GridLanding from './components/GridLanding';

function App() {
  return (
    <Router>
      <Switch>
        {/* Landing page for Grid embedding */}
        <Route exact path="/" component={GridLanding} />
        
        {/* Main app routes */}
        <Route exact path="/app" component={Home} />
        <Route exact path="/profile" component={ProfileViewer} />
        <Route path="/profile/:address" component={ProfileViewer} />
        
        {/* Fallback route */}
        <Route path="*">
          <Redirect to="/" />
        </Route>
      </Switch>
    </Router>
  );
}

export default App;
