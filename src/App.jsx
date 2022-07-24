import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import React, { Suspense, lazy, useState } from "react";
//Components
import Navbar from "./components/Navbar/navbar.jsx";
import Body from "./components/Body/body.jsx";
import Footer from "./components/Footer/footer.jsx";
import Dashboard from "./components/Body/dashboard.jsx";
import { BeaconWallet } from "@taquito/beacon-wallet";
import { TezosToolkit } from "@taquito/taquito";
import { Tzip16Module } from "@taquito/tzip16";

const wallet = new BeaconWallet({
  name: "dPay",
  preferredNetwork: "jakartanet",
});

const Tezos = new TezosToolkit("https://jakartanet.smartpy.io");
Tezos.addExtension(new Tzip16Module());
Tezos.setWalletProvider(wallet);

function App() {
  return (
    <div
      className=" absolute h-screen w-screen"
      style={{
        backgroundImage:
          "linear-gradient(to bottom right , rgb(0, 0, 0)  60%,  rgb(134, 25, 143))",
      }}
    >
      <Router>
        <Suspense fallback={<div>Loading...</div>}>
          <Switch>
            <Route exact path="/">
              <Body tezos={Tezos} wallet={wallet} />
            </Route>
            <Route exact path="/dashboard" component={Dashboard} />
          </Switch>
        </Suspense>
        <Footer />
      </Router>
    </div>
  );
}

export default App;
