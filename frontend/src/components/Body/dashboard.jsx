import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-regular-svg-icons";
import {} from "@fortawesome/free-regular-svg-icons";
import User from "./user.jsx";
import UserData from "./userData.jsx";
import { useEffect, useState, useContext, useCallback } from "react";
import {
  addFriend,
  getFriends,
  getGroups,
  makeGroup,
} from "../../utils/contract.js";
import { connectionContext } from "../../App";

export default function Dashboard() {
  const { Tezos, userName, wallet, connected, client } =
    useContext(connectionContext);

  const [currentName, setCurrentName] = useState("");
  const [address, setAddress] = useState("");
  const [nameFound, setNameFound] = useState(true);
  const [currentTld, setCurrentTld] = useState(
    client.validator.supportedTLDs[0]
  );

  const [state, setState] = useState(true);

  const [groups, setGroups] = useState([]);
  const [friends, setFriends] = useState([]);

  const getGroupsNFriends = useCallback(async () => {
    if (!connected) return;
    try {
      //setGroups(await getGroups(Tezos, userName));
      setFriends(await getFriends(Tezos, userName));
    } catch (err) {
      console.log(err);
    }
  }, [Tezos, connected, userName, wallet]);

  useEffect(() => {
    getGroupsNFriends();
  }, [getGroupsNFriends]);

  const addNewFriend = useCallback(async () => {
    try {
      const finalName = `${currentName}${currentTld}`;
      setNameFound(true);
      await addFriend(Tezos, userName, finalName);
      getGroupsNFriends();
    } catch (err) {
      setNameFound(false);
      console.log("Unable to find name and register", err);
    }
  }, [
    Tezos,
    address,
    getGroupsNFriends,
    client,
    currentName,
    currentTld,
    userName,
  ]);

  const makeNewGroup = async () => {};

  return (
    <div className="flex lg:flex-row mx-auto justify-center h-screen w-screen border-2 border-solid border-grey">
      <div
        className="modal fade fixed top-0 left-0 hidden w-full h-full outline-none overflow-x-hidden overflow-y-auto"
        id="exampleModalCenter"
        tabIndex="-1"
        aria-labelledby="exampleModalCenterTitle"
        aria-modal="true"
        role="dialog"
      >
        <div className="modal-dialog modal-dialog-centered relative w-auto pointer-events-none">
          <div className="modal-content border-none shadow-lg relative flex flex-col w-full pointer-events-auto bg-black bg-clip-padding rounded-md outline-none text-current">
            <div className="modal-header flex flex-col flex-shrink-0 items-center justify-between p-4 border-b border-gray-200 rounded-t-md">
              <h2
                className="text-2xl font-medium leading-normal text-yellow"
                id="exampleModalScrollableLabel"
              >
                Enter Username
              </h2>
            </div>
            <div class="modal-body relative p-4">
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
                onClick={addNewFriend}
                className="bg-yellow hover:scale-105 cursor-pointer hover:brightness-125 rounded-xl lg:px-10 lg:py-3 p-3 text-black font-semibold lg:text-2xl text-xl text-center"
              >
                Add Friend
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="w-2/6 flex flex-col items-center">
        <div className=" flex flex-row border-2 border-solid border-grey py-1 w-full">
          <button
            className="text-yellow font-bold text-mobile_large rounded-lg focus:outline-none w-24 h-12 flex items-center justify-center"
            data-bs-toggle="modal"
            data-bs-target="#exampleModalCenter"
          >
            +
          </button>
          <button className="text-yellow font-bold text-mobile_large rounded-lg  focus:outline-none w-24 h-12 flex items-center justify-center">
            <FontAwesomeIcon icon={faUser} />
          </button>
          <button class="text-white font-bold text-mobile_large rounded-lg focus:outline-none w-24 h-12 flex items-center justify-center">
            .
          </button>
        </div>

        <div className="flex flex-col items-center justify-center py-3">
          <div className="inline-flex" role="group">
            <button
              type="button"
              onClick={() => setState(true)}
              className={
                "rounded-l px-6 py-2 border-2 " +
                (state
                  ? "border-yellow text-yellow"
                  : "border-grey text-gray") +
                " font-medium text-xs leading-tight uppercase hover:bg-black hover:bg-opacity-5 focus:outline-none focus:ring-0 transition duration-150 ease-in-out "
              }
            >
              Friends
            </button>
            <button
              type="button"
              onClick={() => setState(false)}
              className={
                "rounded-r px-6 py-2 border-2 " +
                (!state
                  ? "border-yellow text-yellow"
                  : "border-grey text-gray") +
                " font-medium text-xs leading-tight uppercase hover:bg-black hover:bg-opacity-5 focus:outline-none focus:ring-0 transition duration-150 ease-in-out "
              }
            >
              Groups
            </button>
          </div>
        </div>
        <div className="m-1 overflow-y-auto w-full">
          <User state={state} groups={groups} friends={friends} />
        </div>
      </div>
      <div className="w-4/6 border-2 border-solid border-grey ">
        <UserData state={state} />
      </div>
    </div>
  );
}
