import { useEffect, useState, useReducer, useContext } from "react";
import Gun from "gun";
import { connectionContext } from "../../App";
import {
  addAmountToGroup,
  transferAmountToFriend,
  withdraw,
} from "../../utils/contract";

// initialize gun locally
const gun = Gun({
  peers: ["http://localhost:5000/gun"],
});

// create the initial state to hold the messages
const initialState = {
  messages: [],
};

// Create a reducer that will update the messages array
function reducer(state, message) {
  return {
    messages: [message, ...state.messages],
  };
}

export default function UserDate() {
  // the form state manages the form input for creating a new message
  const [formState, setForm] = useState({
    name: "",
    message: "",
  });

  // initialize the reducer & state for holding the messages array
  const [state, dispatch] = useReducer(reducer, initialState);

  // when the app loads, fetch the current messages and load them into the state
  // this also subscribes to new KT1TbkHzj8DMKn2iaBmmacghPDrCiAcW5RYedata as it changes and updates the local state
  useEffect(() => {
    const messages = gun.get("messages");
    messages.map().on((m) => {
      dispatch({
        name: m.name,
        message: m.message,
        createdAt: m.createdAt,
      });
    });
  }, []);

  // set a new message in gun, update the local state to reset the form field
  function saveMessage() {
    const messages = gun.get("messages");
    messages.set({
      name: formState.name,
      message: formState.message,
      createdAt: Date.now(),
    });
    setForm({
      name: "",
      message: "",
    });
  }

  // update the form state as the user types
  function onChange(e) {
    setForm({ ...formState, [e.target.name]: e.target.value });
  }

  const [currentAmount, setCurrentAmount] = useState(0);

  const {
    Tezos,
    currentFriend,
    currentGroup,
    currentGroupAmount,
    currentGroupName,
    setCurrentGroupAmount,
  } = useContext(connectionContext);

  const [loading, setLoading] = useState(false);

  // add loading
  const take = async () => {
    try {
      if (currentAmount > currentGroupAmount)
        throw new Error("Insuffficient Balance");
      setLoading(true);
      setCurrentGroupAmount(
        (await withdraw(Tezos, currentAmount, currentGroup)).toNumber() / 1000000
      );
    } catch (err) {
      console.log("Unable to withdraw", err);
    } finally {
      setLoading(false);
      setCurrentAmount(0);
    }
  };

  const put = async () => {
    try {
      setLoading(true);
      setCurrentGroupAmount(
        (
          await addAmountToGroup(Tezos, currentGroup, currentAmount)
        ).toNumber() / 1000000
      );
    } catch (err) {
      console.log("Unable to add to the group", err);
    } finally {
      setLoading(false);
      setCurrentAmount(0);
    }
  };

  const stake = async () => {};

  const send = async () => {
    try {
      setLoading(true);
      await transferAmountToFriend(Tezos, currentFriend, currentAmount);
    } catch (err) {
      console.log("Unable to send tezos", err);
    } finally {
      setLoading(false);
      setCurrentAmount(0);
    }
  };

  return (
    <div className=" w-full flex flex-col">
      <div
        className="modal fade fixed top-0 left-0 hidden w-full h-full outline-none overflow-x-hidden overflow-y-auto"
        id="takeExampleModalCenter"
        tabIndex="-1"
        aria-labelledby="takeExampleModalCenterTitle"
        aria-modal="true"
        role="dialog"
      >
        <div className="modal-dialog modal-dialog-centered relative w-auto pointer-events-none">
          <div className="modal-content border-none shadow-lg relative flex flex-col w-full pointer-events-auto bg-black bg-clip-padding rounded-md outline-none text-current">
            <div className="modal-header flex flex-col flex-shrink-0 items-center justify-between p-4 border-b border-gray-200 rounded-t-md">
              <h2
                className="text-2xl font-medium leading-normal text-yellow"
                id="takeExampleModalScrollableLabel"
              >
                Enter Amount
              </h2>
            </div>
            <div class="modal-body relative p-4">
              <div
                className={
                  "bg-black flex items-center rounded-lg border-2 border-solid border-green-500 shadow-xl"
                }
              >
                <input
                  className="rounded-l bg-black w-full px-4 text-gray leading-tight focus:outline-none"
                  type="number"
                  value={currentAmount}
                  onChange={(e) => setCurrentAmount(e.target.value)}
                />
                <div
                  className={
                    "dropdown-toggle text-gray rounded-lg border-2 border-solid border-green-500 focus:outline-none w-24 h-12 flex items-center justify-center transition duration-150 ease-in-out flex"
                  }
                >
                  ꜩ
                </div>
              </div>
            </div>

            {loading ? (
              <div class="modal-footer flex flex-shrink-0 flex-wrap items-center justify-evenly p-4 border-t border-gray-200 rounded-b-md">
                <div
                  class="spinner-border animate-spin inline-block w-8 h-8 border-4 rounded-full"
                  role="status"
                />
              </div>
            ) : (
              <div class="modal-footer flex flex-shrink-0 flex-wrap items-center justify-evenly p-4 border-t border-gray-200 rounded-b-md">
                <button
                  type="button"
                  className="bg-red-500 hover:scale-105 cursor-pointer hover:brightness-125 rounded-xl lg:px-10 lg:py-3 p-3 text-black font-semibold lg:text-2xl text-xl text-center"
                  data-bs-dismiss="modal"
                >
                  Close
                </button>
                <button
                  type="button"
                  onClick={take}
                  className="bg-yellow hover:scale-105 cursor-pointer hover:brightness-125 rounded-xl lg:px-10 lg:py-3 p-3 text-black font-semibold lg:text-2xl text-xl text-center"
                >
                  Take
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <div
        className="modal fade fixed top-0 left-0 hidden w-full h-full outline-none overflow-x-hidden overflow-y-auto"
        id="putExampleModalCenter"
        tabIndex="-1"
        aria-labelledby="putExampleModalCenterTitle"
        aria-modal="true"
        role="dialog"
      >
        <div className="modal-dialog modal-dialog-centered relative w-auto pointer-events-none">
          <div className="modal-content border-none shadow-lg relative flex flex-col w-full pointer-events-auto bg-black bg-clip-padding rounded-md outline-none text-current">
            <div className="modal-header flex flex-col flex-shrink-0 items-center justify-between p-4 border-b border-gray-200 rounded-t-md">
              <h2
                className="text-2xl font-medium leading-normal text-yellow"
                id="putExampleModalScrollableLabel"
              >
                Enter Amount
              </h2>
            </div>
            <div class="modal-body relative p-4">
              <div
                className={
                  "bg-black flex items-center rounded-lg border-2 border-solid border-green-500 shadow-xl"
                }
              >
                <input
                  className="rounded-l bg-black w-full px-4 text-gray leading-tight focus:outline-none"
                  type="number"
                  value={currentAmount}
                  onChange={(e) => setCurrentAmount(e.target.value)}
                />
                <div
                  className={
                    "dropdown-toggle text-gray rounded-lg border-2 border-solid border-green-500 focus:outline-none w-24 h-12 flex items-center justify-center transition duration-150 ease-in-out flex"
                  }
                >
                  ꜩ
                </div>
              </div>
            </div>
            {loading ? (
              <div class="modal-footer flex flex-shrink-0 flex-wrap items-center justify-evenly p-4 border-t border-gray-200 rounded-b-md">
                <div
                  class="spinner-border animate-spin inline-block w-8 h-8 border-4 rounded-full"
                  role="status"
                />
              </div>
            ) : (
              <div class="modal-footer flex flex-shrink-0 flex-wrap items-center justify-evenly p-4 border-t border-gray-200 rounded-b-md">
                <button
                  type="button"
                  className="bg-red-500 hover:scale-105 cursor-pointer hover:brightness-125 rounded-xl lg:px-10 lg:py-3 p-3 text-black font-semibold lg:text-2xl text-xl text-center"
                  data-bs-dismiss="modal"
                >
                  Close
                </button>
                <button
                  type="button"
                  onClick={put}
                  className="bg-yellow hover:scale-105 cursor-pointer hover:brightness-125 rounded-xl lg:px-10 lg:py-3 p-3 text-black font-semibold lg:text-2xl text-xl text-center"
                >
                  Put
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <div
        className="modal fade fixed top-0 left-0 hidden w-full h-full outline-none overflow-x-hidden overflow-y-auto"
        id="sendExampleModalCenter"
        tabIndex="-1"
        aria-labelledby="sendExampleModalCenterTitle"
        aria-modal="true"
        role="dialog"
      >
        <div className="modal-dialog modal-dialog-centered relative w-auto pointer-events-none">
          <div className="modal-content border-none shadow-lg relative flex flex-col w-full pointer-events-auto bg-black bg-clip-padding rounded-md outline-none text-current">
            <div className="modal-header flex flex-col flex-shrink-0 items-center justify-between p-4 border-b border-gray-200 rounded-t-md">
              <h2
                className="text-2xl font-medium leading-normal text-yellow"
                id="sendExampleModalScrollableLabel"
              >
                Enter Amount
              </h2>
            </div>
            <div class="modal-body relative p-4">
              <div
                className={
                  "bg-black flex items-center rounded-lg border-2 border-solid border-green-500 shadow-xl"
                }
              >
                <input
                  className="rounded-l bg-black w-full px-4 text-gray leading-tight focus:outline-none"
                  type="number"
                  value={currentAmount}
                  onChange={(e) => setCurrentAmount(e.target.value)}
                />
                <div
                  className={
                    "dropdown-toggle text-gray rounded-lg border-2 border-solid border-green-500 focus:outline-none w-24 h-12 flex items-center justify-center transition duration-150 ease-in-out flex"
                  }
                >
                  ꜩ
                </div>
              </div>
            </div>
            {loading ? (
              <div class="modal-footer flex flex-shrink-0 flex-wrap items-center justify-evenly p-4 border-t border-gray-200 rounded-b-md">
                <div
                  class="spinner-border animate-spin inline-block w-8 h-8 border-4 rounded-full"
                  role="status"
                />
              </div>
            ) : (
              <div class="modal-footer flex flex-shrink-0 flex-wrap items-center justify-evenly p-4 border-t border-gray-200 rounded-b-md">
                <button
                  type="button"
                  className="bg-red-500 hover:scale-105 cursor-pointer hover:brightness-125 rounded-xl lg:px-10 lg:py-3 p-3 text-black font-semibold lg:text-2xl text-xl text-center"
                  data-bs-dismiss="modal"
                >
                  Close
                </button>
                <button
                  type="button"
                  onClick={send}
                  className="bg-yellow hover:scale-105 cursor-pointer hover:brightness-125 rounded-xl lg:px-10 lg:py-3 p-3 text-black font-semibold lg:text-2xl text-xl text-center"
                >
                  Send
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {currentGroup !== -1 ? (
        <div className=" flex flex-row border-solid border-grey border-2 w-full">
          <div className="flex-col items-center w-full font-bold p-1 text-yellow text-web_large px-2">
            <div>{currentGroupName}</div>
            <div>Current Balance: {currentGroupAmount} Tez</div>
          </div>
          <div className=" flex flex-row justify-end">
            <button
              data-bs-toggle="modal"
              data-bs-target="#takeExampleModalCenter"
              class="text-gray rounded-lg border-2 m-1 border-solid border-grey focus:outline-none w-24 h-12 "
            >
              Take
            </button>
            <button
              data-bs-toggle="modal"
              data-bs-target="#putExampleModalCenter"
              class="text-gray rounded-lg border-2 m-1 border-solid border-grey focus:outline-none w-24 h-12 "
            >
              Put
            </button>
            <button
              onClick={stake}
              class="text-gray rounded-lg border-2 m-1 border-solid border-grey focus:outline-none w-24 h-12 "
            >
              Stake
            </button>
          </div>
        </div>
      ) : currentFriend !== "" ? (
        <div className=" h-30 flex flex-row border-solid border-grey border-2 w-full">
          <div className="flex items-center w-full font-bold p-1 text-web_large px-2 text-yellow">
            {currentFriend}
          </div>
          <div className=" flex flex-row justify-end">
            <button
              data-bs-toggle="modal"
              data-bs-target="#sendExampleModalCenter"
              class="text-gray rounded-lg border-2 m-1 border-solid border-grey focus:outline-none w-24 h-12 "
            >
              Send
            </button>
          </div>
        </div>
      ) : (
        <div></div>
      )}

      {currentFriend === "" && currentGroup === -1 ? (
        <div className="grid grid-col gap-y-20">
          <div className="grid grid-col place-content-center">
            <h1 className="flex lg:block h-8 w-auto font-bold text-web_extra_large">
              dPay<span className="text-yellow">.</span>
            </h1>
          </div>
          <div className="text-grey py-2 lg:px-2 text-web_small text-center w-full">
            <i>Powered By ꜩ</i>
          </div>
        </div>
      ) : (
        <div className="flex flex-col mx-5">
          <div className="text-grey py-2 lg:px-2 text-small text-center w-full">
            <div className="h-96 flex flex-wrap overflow-y-scroll snap snap-y snap-mandatory hide-scroll-bar justify-center w-full items-center mx-auto">
              {state.messages.map((message) => (
                <div
                  className="flex-shrink-0 flex-col snap-always snap-center w-full mx-auto bg-white my-2 rounded-lg text-black"
                  key={message.createdAt}
                >
                  <div className=" flex flex-row space-x-4 ">
                    <h3>From: {message.name}</h3>
                    <p>Date: {message.createdAt}</p>
                  </div>
                  <div>
                    <h2 className=" text-web_large">{message.message}</h2>
                  </div>
                </div>
              ))}
            </div>
            <i>Your Chats are end to end encrypted</i>
          </div>
          <div class="absolute bg-black rounded-full w-4/6 right-0 bottom-0 flex items-center border-2 border-solid border-grey shadow-xl">
            <input
              className="rounded-l text-small bg-black w-full px-4 text-gray leading-tight focus:outline-none"
              id="search"
              type="text"
              placeholder="Type you chats"
              onChange={onChange}
              name="message"
              value={formState.message}
            />
            <button
              onClick={saveMessage}
              class="text-gray rounded-full  border-2 border-solid border-grey focus:outline-none w-24 h-12 flex items-center justify-center"
            >
              send{" "}
              <span className=" text-yellow text-right text-web_normal font-bold">
                .
              </span>
            </button>
          </div>
          <div></div>
        </div>
      )}
    </div>
  );
}
