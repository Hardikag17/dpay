import { useEffect, useState, useReducer, useContext } from "react";
import Gun from "gun";
import { connectionContext } from "../../App";
import { addAmountToGroup, withdraw } from "../../utils/contract";

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

export default function UserDate({ friendState }) {
  // the form state manages the form input for creating a new message
  const [formState, setForm] = useState({
    name: "",
    message: "",
  });

  // initialize the reducer & state for holding the messages array
  const [state, dispatch] = useReducer(reducer, initialState);

  // when the app loads, fetch the current messages and load them into the state
  // this also subscribes to new data as it changes and updates the local state
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

  const { Tezos } = useContext(connectionContext);
  const take = async () => {
    setCurrentAmount(
      await withdraw(Tezos).catch((e) => {
        console.log(e);
      })
    );
  };

  const put = async () => {
    setCurrentAmount(await addAmountToGroup(Tezos));
  };

  const stake = async () => {};

  return (
    <div className=" w-full flex flex-col">
      <div
        className="modal fade fixed top-0 left-0 hidden w-full h-full outline-none overflow-x-hidden overflow-y-auto"
        id="amountexampleModalCenter"
        tabIndex="-1"
        aria-labelledby="amountexampleModalCenterTitle"
        aria-modal="true"
        role="dialog"
      >
        <div className="modal-dialog modal-dialog-centered relative w-auto pointer-events-none">
          <div className="modal-content border-none shadow-lg relative flex flex-col w-full pointer-events-auto bg-black bg-clip-padding rounded-md outline-none text-current">
            <div className="modal-header flex flex-col flex-shrink-0 items-center justify-between p-4 border-b border-gray-200 rounded-t-md">
              <h2
                className="text-2xl font-medium leading-normal text-yellow"
                id="amountexampleModalScrollableLabel"
              >
                Enter Username
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
                  id="search"
                  type="text"
                  value={currentAmount}
                  onChange={(e) => setCurrentAmount(e.target.value)}
                />
              </div>
            </div>
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
                className="bg-yellow hover:scale-105 cursor-pointer hover:brightness-125 rounded-xl lg:px-10 lg:py-3 p-3 text-black font-semibold lg:text-2xl text-xl text-center"
              >
                Proceed
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className=" h-72 flex flex-row border-solid border-grey border-2 w-full">
        <div
          data-bs-toggle="modal"
          data-bs-target="#amountexampleModalCenter"
          className=" text-left flex items-center w-full font-bold p-1 text-web_large px-2"
        >
          Current Balance: {currentAmount} Tez
        </div>
        <div className=" flex flex-row justify-end">
          <button
            onClick={take}
            class="text-gray rounded-lg border-2 m-1 border-solid border-grey focus:outline-none w-24 h-12 "
          >
            Take
          </button>
          <button
            onClick={put}
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
    </div>
  );
}
