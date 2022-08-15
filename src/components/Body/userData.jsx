import {
  useEffect,
  useState,
  useReducer,
  useContext,
  useCallback,
} from "react";
import Gun from "gun";
import { connectionContext } from "../../App";
import {
  addAmountToGroup,
  transferAmountToFriend,
  withdraw,
} from "../../utils/contract";

// initialize gun locally
const gun = Gun({
  peers: ["https://d-pay-tez.herokuapp.com/gun"],
});

// create the initial state to hold the messages
const initialState = {
  messages: [],
};

// Create a reducer that will update the messages array
function reducer(state, action) {
  let newState;
  switch (action.type) {
    case "add":
      newState = { messages: [...state.messages, action.newMessage] };
      break;
    case "new":
      newState = { messages: [] };
      break;
    default:
      throw new Error("invalid action");
  }
  return newState;
}

export default function UserDate() {
  // the form state manages the form input for creating a new message
  const [formState, setForm] = useState({
    message: "",
  });

  localStorage.clear();

  const {
    Tezos,
    currentFriend,
    currentGroup,
    currentGroupAmount,
    currentGroupName,
    setCurrentGroupAmount,
    connected,
    userName,
  } = useContext(connectionContext);

  // initialize the reducer & state for holding the messages array
  const [state, dispatch] = useReducer(reducer, initialState);

  // when the app loads, fetch the current messages and load them into the state
  // this also subscribes to new KT1TbkHzj8DMKn2iaBmmacghPDrCiAcW5RYedata as it changes and updates the local state

  const fetchMess = useCallback((key) => {
    const messages = gun.get(key);

    // messages.on((m) => console.log(m));

    messages.map().once((m) => {
      console.log(m);
      dispatch({
        type: "add",
        newMessage: {
          name: m.name,
          message: m.message,
          createdAt: m.createdAt,
          key: m.key,
        },
      });
    });
  }, []);

  useEffect(() => {
    if (!connected) return;
    if (currentGroup === -1 && currentFriend === "") return;

    let key;
    if (currentGroup !== -1) {
      key = currentGroup.toString();
    } else {
      key = [currentFriend, userName].sort().join("");
    }
    console.log(key);
    const messages = gun.get(key);

    dispatch({
      type: "new",
    });

    fetchMess(key);
  }, [connected, currentFriend, currentGroup, userName, fetchMess]);

  // set a new message in gun, update the local state to reset the form field
  const saveMessage = useCallback(() => {
    if (!connected) return;
    if (currentGroup === -1 && currentFriend === "") return;

    let key;
    if (currentGroup !== -1) {
      key = currentGroup.toString();
    } else {
      key = [currentFriend, userName].sort().join("");
    }

    const messages = gun.get(key);

    messages.set({
      name: userName,
      message: formState.message,
      createdAt: Date.now(),
      key,
    });

    setForm({
      message: "",
    });
  }, [connected, currentFriend, currentGroup, userName, formState]);

  // update the form state as the user types
  function onChange(e) {
    setForm({ ...formState, [e.target.name]: e.target.value });
  }

  const [currentAmount, setCurrentAmount] = useState(0);

  const [loading, setLoading] = useState(false);

  // add loading
  const take = async () => {
    try {
      if (currentAmount > currentGroupAmount)
        throw new Error("Insuffficient Balance");
      setLoading(true);
      setCurrentGroupAmount(await withdraw(Tezos, currentAmount, currentGroup));
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
      const newBal = await addAmountToGroup(Tezos, currentGroup, currentAmount);
      setCurrentGroupAmount(newBal);
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
            <div>Current Balance: {currentGroupAmount}ꜩ</div>
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
        <div className="flex flex-col mx-5 ">
          <div className="flex flex-col text-grey py-2 lg:px-2 text-small text-center w-full">
            <div className="bg-black h-5/6 flex flex-col justify-end snap snap-y snap-mandatory w-full ">
              {state.messages.sort().map((message, i) => (
                <div className="flex flex-row gap-x-2 my-2 mb-4">
                  <div
                    className={
                      (message.name === userName ? " " : " ml-auto ") +
                      " flex w-1/3 flex-col snap-always snap-center text-white"
                    }
                    key={i}
                  >
                    <div
                      className={
                        "flex flex-row justify-evenly space-x-4 border-2 border-yellow " +
                        (message.name === userName
                          ? "rounded-tr-3xl"
                          : "rounded-tl-3xl")
                      }
                    >
                      <p>{new Date(message.createdAt).toDateString()}</p>
                      <p>{new Date(message.createdAt).toLocaleTimeString()}</p>
                    </div>
                    <div
                      className={
                        "justify-end border-2 border-yellow " +
                        (message.name === userName
                          ? "rounded-br-3xl"
                          : "rounded-bl-3xl")
                      }
                    >
                      <h2 className=" text-web_large">{message.message}</h2>
                    </div>
                  </div>

                  {message.name !== userName ? (
                    <div className="dropdown">
                      <button
                        data-bs-toggle="dropdown"
                        aria-expanded="false"
                        class="rounded-full grid place-content-center pr-2 w-16 h-16 text-white bg-black border-2 border-solid hover:border-dashed border-yellow text-web_large"
                      >
                        {message.name[0].toUpperCase()}
                      </button>
                      <ul
                        className="
          dropdown-menu
          absolute
          hidden
          bg-white
          text-base
          z-50
          py-2
          list-none
          flex
          justify-center
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
                        {message.name}
                      </ul>
                    </div>
                  ) : (
                    <></>
                  )}
                </div>
              ))}
            </div>
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