import { useState, useContext, useCallback } from "react";
import { connectionContext } from "../../App";
import {
  getTld,
  getLabel,
  DomainNameValidationResult,
  RecordMetadata,
  generateNonce,
} from "@tezos-domains/core";

export default function Register() {
  const { connected, wallet, client } = useContext(connectionContext);

  const [nameFound, setNameFound] = useState(true);
  const [currentName, setCurrentName] = useState("");
  const [loading, setLoading] = useState(false);

  const tld = client.validator.supportedTLDs[0];
  const buy = useCallback(async () => {
    if (!connected) {
      console.log("No Connection");
      return;
    }

    setLoading(true);
    const address = await wallet.getPKH();
    try {
      if (
        client.validator.validateDomainName(currentName + tld) !==
        DomainNameValidationResult.VALID
      ) {
        setCurrentName("Invalid Name");
        throw new Error("Domain name not valid");
      }

      const existing = await client.resolver.resolveDomainRecord(currentName);
      if (existing) {
        setCurrentName("Already Taken");
        throw new Error("Domain Name taken.");
      }

      const label = currentName;
      const nonce = generateNonce();

      const params = {
        label,
        owner: address,
        nonce,
      };

      const commitOperation = await client.manager.commit(tld, params);
      await commitOperation.confirmation();

      const buyOperation = await client.manager.buy(tld, {
        ...params,
        duration: 365,
        address: address,
        data: new RecordMetadata(),
        nonce
      });
      await buyOperation.confirmation();
      console.log(`Domain ${currentName} has been registered.`);
      setNameFound(true);
    } catch (err) {
      setNameFound(false);
      console.log(err);
    }
    setLoading(false);
  }, [client, wallet, currentName, connected]);

  return (
    <div>
      <div className=" flex h-screen flex-col lg:mx-64 mx-auto lg:my-10 my-24 lg:px-4 lg:w-1/2 w-10/12">
        <div className=" lg:text-web_title text-mobile_title">
          Register New Domain
        </div>
        <div className="text-grey py-5 lg:px-2 text-small lg:w-3/4 w-full">
          Select a Unique Domain Name
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
              <button
                type="button"
                onClick={buy}
                disabled={!nameFound}
                className="bg-yellow hover:scale-105 cursor-pointer hover:brightness-125 rounded-xl lg:px-10 lg:py-3 p-3 text-black font-semibold lg:text-2xl text-xl text-center"
              >
                Confirm
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
