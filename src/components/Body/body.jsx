import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { TaquitoTezosDomainsClient } from "@tezos-domains/taquito-client";
import { connectWallet, getAccount } from "../../utils/wallet.js";

export default function Body({ tezos, wallet }) {
  let history = useHistory();

  const [currentName, setCurrentName] = useState("");

  const client = new TaquitoTezosDomainsClient({
    tezos: tezos,
    network: "jakartanet",
    caching: { enabled: true },
  });

  const [address, setAddress] = useState("");
  useEffect(async () => {
    console.log(tezos);
    const activeAccount = await wallet.client.getActiveAccount();
    if (activeAccount) {
      setAddress(activeAccount.address);
    } else {
      await wallet.requestPermissions({ network: { type: "jakartanet" } });
      setAddress(await wallet.getPKH());
    }
    console.log(address);
  }, []);

  const validateName = async () => {
    try {
      setCurrentName("...CHECKING...");
      const address = await client.resolver.resolveNameToAddress(
        `${currentName}.tez`
      );
      if (address == null) {
        throw Error("NotFound");
      }
      if (onConnectWallet() === address) {
        console.log(`${currentName}: ${address} (Connection is Okay)`);
        history.push("/dashboard");
      } else {
        alert("Please check the details entered");
      }
    } catch (err) {
      console.log(err);
      setCurrentName("INVALID");
    }
  };

  const onConnectWallet = async () => {
    await connectWallet();
    const account = await getAccount();
    return account;
  };

  return (
    <div>
      <div className=" flex h-screen flex-col lg:mx-64 mx-auto lg:my-10 my-24 lg:px-4 lg:w-1/2 w-10/12">
        <div className=" lg:text-web_title text-mobile_title">
          Verify your Identity
        </div>
        <div className="text-grey py-5 lg:px-2 text-small lg:w-3/4 w-full">
          Your identity must be verifed by tezos domains
        </div>
        <div className="lg:w-3/4 w-full">
          <div className="bg-black flex items-center rounded-lg border-2 border-solid border-grey shadow-xl">
            <input
              className="rounded-l bg-black w-full px-4 text-gray leading-tight focus:outline-none"
              id="search"
              type="text"
              placeholder="alex"
              value={currentName}
              onChange={(e) => setCurrentName(e.target.value)}
            />

            {/*Button? */}
            <button className="text-gray rounded-lg border-2 border-solid border-grey focus:outline-none w-24 h-12 flex items-center justify-center">
              .tez
            </button>
          </div>
        </div>
        <div className=" py-10 z-10">
          <div>
            <button
              onClick={validateName}
              className="bg-yellow hover:scale-105 cursor-pointer hover:brightness-125 rounded-xl lg:px-10 lg:py-3 p-3 text-black font-semibold lg:text-2xl text-xl text-center"
            >
              Confirm
            </button>
          </div>
        </div>
      </div>
      <div className="header__squares">
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
      </div>
    </div>
  );
}
