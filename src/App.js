import React from 'react';
import { Switch, Route } from "react-router-dom";

import Home from './pages/Home';

const App = () => {
  return (
    <React.Fragment>
      <Switch>
        <Route exact path="/" component={Home} />
      </Switch>
    </React.Fragment>
  );
}

export default App;
