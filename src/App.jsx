import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import React, { Suspense, useState } from "react";
//Components
import Body from "./components/Body/body.jsx";
import Footer from "./components/Footer/footer.jsx";
import Dashboard from "./components/Body/dashboard.jsx";
import { BeaconWallet } from "@taquito/beacon-wallet";
import { TezosToolkit } from "@taquito/taquito";
import { Tzip16Module } from "@taquito/tzip16";
import { TaquitoTezosDomainsClient } from "@tezos-domains/taquito-client";
import "tw-elements";
import Register from "./components/Body/register.jsx";

const wallet = new BeaconWallet({
  name: "dPay",
  preferredNetwork: "jakartanet",
});

const Tezos = new TezosToolkit("https://jakartanet.smartpy.io");
Tezos.addExtension(new Tzip16Module());
Tezos.setWalletProvider(wallet);

const client = new TaquitoTezosDomainsClient({
  tezos: Tezos,
  network: "jakartanet",
  caching: { enabled: true },
});

export const connectionContext = React.createContext({
  userName: "",
  setUserName: (status) => {},

  conected: false,
  setConnected: (status) => {},

  currentGroup: -1,
  setCurrentGroup: (status) => {},
  currentGroupAmount: 0,
  setCurrentGroupAmount: (status) => {},
  currentGroupName: "",
  setCurrentGroupName: (status) => {},

  currentFriend: "",
  setCurrentFriend: (status) => {},

  wallet: wallet,
  Tezos: Tezos,
  client: client,
});

function App() {
  const [connected, setConnected] = useState(false);
  const [userName, setUserName] = useState("");
  const [currentGroup, setCurrentGroup] = useState(-1);
  const [currentFriend, setCurrentFriend] = useState("");
  const [currentGroupName, setCurrentGroupName] = useState("");
  const [currentGroupAmount, setCurrentGroupAmount] = useState(0);

  return (
    <div className=" absolute h-screen w-screen">
      <Router>
        <connectionContext.Provider
          value={{
            connected,
            setConnected,
            wallet,
            Tezos,
            client,
            userName,
            setUserName,
            currentGroup,
            setCurrentGroup,
            currentFriend,
            setCurrentFriend,
            currentGroupName,
            setCurrentGroupName,
            currentGroupAmount,
            setCurrentGroupAmount,
          }}
        >
          <Suspense fallback={<div>Loading...</div>}>
            <Switch>
              <Route exact path="/">
                <Body />
              </Route>
              <Route exact path="/dashboard" component={Dashboard} />
              <Route exact path="/register" component={Register} />
            </Switch>
          </Suspense>
          <Footer />
        </connectionContext.Provider>
      </Router>
    </div>
  );
}

export default App;