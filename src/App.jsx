import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import React, { Suspense, lazy, useState } from 'react';
//Components
import Navbar from './components/Navbar/navbar.jsx';
import Body from './components/Body/body.jsx';
import Footer from './components/Footer/footer.jsx';

function App() {
  return (
    <div>
      <Router>
        <Navbar />
        <Suspense fallback={<div>Loading...</div>}>
          <Switch>
            <Route exact path='/' component={Body} />
          </Switch>
        </Suspense>
        <Footer />
      </Router>
    </div>
  );
}

export default App;
