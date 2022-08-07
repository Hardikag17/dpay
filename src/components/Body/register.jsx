import { useState, useContext, useCallback } from "react";
import { useHistory } from "react-router-dom";
import { connectionContext } from "../../App";
import {
  DomainNameValidationResult,
  RecordMetadata,
  generateNonce,
} from "@tezos-domains/core";
import { viewMethods } from "../../utils/contract";

export default function Register() {
  let history = useHistory();
  const { connected, Tezos, wallet, client } = useContext(connectionContext);

  const [nameFound, setNameFound] = useState(true);
  const [currentName, setCurrentName] = useState("");
  const [loading, setLoading] = useState(false);
  const [currentTld, setCurrentTld] = useState(
    client.validator.supportedTLDs[0]
  );

  const buy = useCallback(async () => {
    if (!connected) {
      console.log("No Connection");
      return;
    }

    setLoading(true);
    const address = await wallet.getPKH();
    try {
      if (
        client.validator.validateDomainName(`${currentName}.${currentTld}`) !==
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

      const commitOperation = await client.manager.commit(currentTld, params);
      await commitOperation.confirmation();

      const buyOperation = await client.manager.buy(currentTld, {
        ...params,
        duration: 365,
        address: address,
        data: new RecordMetadata(),
        nonce,
      });
      await buyOperation.confirmation();
      console.log(`Domain ${currentName} has been registered.`);
      setNameFound(true);
      history.push("/");
    } catch (err) {
      setNameFound(false);
      viewMethods(Tezos);
      console.log(err);
    }
    setLoading(false);
  }, [client, wallet, currentName, Tezos, history, connected, currentTld]);

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
            <div className="dropdown relative">
              <button
                className={
                  "dropdown-toggle text-gray rounded-lg border-2 border-solid border-" +
                  (nameFound ? "green" : "red") +
                  "-500 focus:outline-none w-24 h-12 flex items-center justify-center transition duration-150 ease-in-out flex"
                }
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                {currentTld}
                <svg
                  aria-hidden="true"
                  focusable="false"
                  data-prefix="fas"
                  data-icon="caret-down"
                  class="w-2 ml-2"
                  role="img"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 320 512"
                >
                  <path
                    fill="currentColor"
                    d="M31.3 192h257.3c17.8 0 26.7 21.5 14.1 34.1L174.1 354.8c-7.8 7.8-20.5 7.8-28.3 0L17.2 226.1C4.6 213.5 13.5 192 31.3 192z"
                  ></path>
                </svg>
              </button>
              <ul
                className="
          dropdown-menu
          absolute
          hidden
          bg-white
          text-base
          z-50
          float-left
          py-2
          list-none
          text-left
          rounded-lg
          shadow-lg
          mt-1
          hidden
          m-0
          w-32
          bg-clip-padding
          border-none
        "
                aria-labelledby="dropdownMenuButton1"
              >
                {client.validator.supportedTLDs.map((tld, key) => (
                  <li
                    key={key}
                    onClick={() => setCurrentTld(tld)}
                    className="
                  dropdown-item
                  text-sm
                  py-2
                  px-4
                  font-normal
                  block
                  whitespace-nowrap
                  bg-transparent
                  text-gray-700
                  hover:bg-gray-100
                  "
                  >
                    {tld}
                  </li>
                ))}
              </ul>
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
