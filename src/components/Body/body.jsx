import React, { useState, useEffect, useContext } from "react";
import { useHistory } from "react-router-dom";
import { TaquitoTezosDomainsClient } from "@tezos-domains/taquito-client";
import { connectionContext } from "../../App";

export default function Body() {
  let history = useHistory();
  const { connected, wallet, tezos } = useContext(connectionContext);

  const [currentName, setCurrentName] = useState("");
  const [address, setAddress] = useState("");
  const [nameFound, setNameFound] = useState(true);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAndResolveAddress() {
      if (!connected) {
        console.log("No Connection");
        return;
      }

      setLoading(true);
      setAddress(await wallet.getPKH());

      const client = new TaquitoTezosDomainsClient({
        tezos: tezos,
        network: "jakartanet",
        caching: { enabled: true },
      });

      try {
        const fetchedName = await client.resolver.resolveAddressToName(address);
        if (!fetchedName) {
          setNameFound(false);
          throw new Error();
        }

        setNameFound(true);
        setCurrentName(fetchedName);
        console.log(address);
      } catch (err) {
        setNameFound(false);
        setCurrentName("No Name Found")
        console.log("Unable to Resolve the address", err);
      }

      setLoading(false);
    }
    fetchAndResolveAddress();
  }, [tezos, wallet, address, connected]);

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
          <div
            className={
              "bg-black flex items-center rounded-lg border-2 border-solid border-" +
              (nameFound ? "green" : "red") +
              "-500 shadow-xl"
            }
          >
            <input
              className="rounded-l bg-black w-full px-4 text-gray leading-tight focus:outline-none"
              id="search"
              type="text"
              value={currentName}
              disabled
              onChange={(e) => setCurrentName(e.target.value)}
            />

            <div
              className={
                "text-gray rounded-lg border-2 border-solid border-" +
                (nameFound ? "green" : "red") +
                "-500 focus:outline-none w-24 h-12 flex items-center justify-center"
              }
            >
              .tez
            </div>
          </div>
        </div>
        <div className=" py-10 z-10">
          <div>
            {!connected ? (
              <button className="bg-red-500 hover:scale-105 cursor-pointer hover:brightness-125 rounded-xl lg:px-10 lg:py-3 p-3 text-black font-semibold lg:text-2xl text-xl text-center">
                No Connection
              </button>
            ) : loading ? (
              <div
                class="spinner-border animate-spin inline-block w-8 h-8 border-4 rounded-full"
                role="status"
              />
            ) : (
              <button className="bg-yellow hover:scale-105 cursor-pointer hover:brightness-125 rounded-xl lg:px-10 lg:py-3 p-3 text-black font-semibold lg:text-2xl text-xl text-center">
                {nameFound ? "Confirm" : "Register"}
              </button>
            )}
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
