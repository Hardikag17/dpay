import { setArgs } from "@craco/craco/lib/args";
import { Disclosure } from "@headlessui/react";
import { XIcon, MenuIcon } from "@heroicons/react/outline";
import { useContext, useEffect, useCallback } from "react";
import { connectionContext } from "../../App";

export default function Navbar() {
  const { connected, setConnected, wallet } = useContext(connectionContext);

  const connect = useCallback(async () => {
    const activeAccount = await wallet.client.getActiveAccount();
    if (activeAccount) {
      console.log("Already connected:", activeAccount.address);
    } else {
      await wallet.requestPermissions({ network: { type: "jakartanet" } });
      const myAddress = await wallet.getPKH();
      console.log("New connection:", myAddress);
    }
    setConnected(true);
  }, [setConnected, wallet]);

  const disconnect = async () => {
    await wallet.clearActiveAccount();
    setConnected(false);
  };

  useEffect(() => {
    connect();
  }, [connect]);

  return (
    <Disclosure as="nav">
      {({ open }) => (
        <>
          <div className="max-w-7xl mx-auto lg:py-5 py-2 px-5 sm:px-8 lg:px-10">
            <div className="relative flex items-center justify-between h-16">
              <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
                {/* Mobile menu button*/}
                <Disclosure.Button className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
                  <span className="sr-only">Open main menu</span>
                  {open ? (
                    <XIcon className="block h-6 w-6" aria-hidden="true" />
                  ) : (
                    <MenuIcon className="block h-6 w-6" aria-hidden="true" />
                  )}
                </Disclosure.Button>
              </div>
              <div className="flex-1 flex items-center justify-center sm:items-stretch sm:justify-start">
                <div className="flex-shrink-0 flex items-center cursor-pointer">
                  <a href="/">
                    <h1
                      className="block lg:hidden h-8 w-auto font-bold text-web_large"
                      alt="dsi."
                    >
                      dPay<span className=" text-yellow">.</span>
                    </h1>
                  </a>
                  <a href="/">
                    <h1
                      className="hidden lg:block h-8 w-auto font-bold text-web_large"
                      alt="dsi."
                    >
                      dPay<span className=" text-yellow">.</span>
                    </h1>
                  </a>
                </div>
              </div>
              <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
                <Disclosure.Button as="a">
                  <div className=" flex flex-col">
                    <div>
                      <button
                        onClick={connected ? disconnect : connect}
                        className="bg-yellow hover:scale-105 cursor-pointer hover:brightness-125 rounded-xl lg:px-10 lg:py-3 p-3 text-black font-semibold lg:text-2xl text-xl text-center"
                      >
                        {connected ? "CONNECTED" : "DISCONNECTED"}
                        <span className=" text-yellow text-right text-web_normal font-bold">
                          .
                        </span>
                      </button>
                    </div>
                  </div>
                </Disclosure.Button>
              </div>
            </div>
          </div>
        </>
      )}
    </Disclosure>
  );
}
