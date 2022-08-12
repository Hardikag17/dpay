import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-regular-svg-icons";
import {} from "@fortawesome/free-regular-svg-icons";
import User from "./user.jsx";
import UserData from "./userData.jsx";
import { useState } from "react";
import { addFriend, makeGroup } from "../../utils/contract.js";

export default function Dashboard() {
  const [state, setState] = useState(true);
  const toggleState = () => {
    setState(!state);
  };

  return (
    <div className="flex lg:flex-row mx-auto justify-center h-screen w-screen border-2 border-solid border-grey">
      <div className="w-2/6 flex flex-col items-center">
        <div className=" flex flex-row border-2 border-solid border-grey py-1 w-full">
          <button
            onClick={addNewFriend}
            className="text-yellow font-bold text-mobile_large rounded-lg focus:outline-none w-24 h-12 flex items-center justify-center"
          >
            +
          </button>
          <button
            onClick={makeNewGroup}
            className="text-yellow font-bold text-mobile_large rounded-lg  focus:outline-none w-24 h-12 flex items-center justify-center"
          >
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
              onClick={toggleState}
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
              onClick={toggleState}
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
          <User state={state} />
        </div>
      </div>
      <div className="w-4/6 border-2 border-solid border-grey ">
        <UserData state={state} />
      </div>
    </div>
  );
}
