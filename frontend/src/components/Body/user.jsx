import { useContext, useState } from "react";
import { connectionContext } from "../../App";

export default function User({ state, groups, friends }) {
  console.log(groups);
  console.log(friends);

  const {
    setCurrentGroup,
    setCurrentFriend,
    setCurrentGroupAmount,
    setCurrentGroupName,
  } = useContext(connectionContext);

  const onGroup = (group) => {
    setCurrentGroup(group.groupId);
    setCurrentGroupAmount(group.balance / 1000000);
    setCurrentGroupName(group.group_name);
    setCurrentFriend("");
  };

  const onFriend = (friend) => {
    setCurrentGroup(-1);
    setCurrentGroupName("");
    setCurrentGroupAmount(0);
    setCurrentFriend(friend.user_name);
  };

  return (
    <div className="text-white w-full h-full rounded-3xl p-2 overflow-y-auto hover:brightness-125 hover:scale-110 cursor-pointer flex items-center justify-center">
      <div className="flex flex-col w-full h-full justify-center overflow-y-auto">
        {!state ? (
          <div className="overflow-y-auto bg-whie py-3 flex flex-col gap-y-4 h-full w-full">
            {groups.map((group, i) => (
              <div
                key={i}
                onClick={() => onGroup(group)}
                className="flex items-center bg-opacity-0 rounded-lg w-full px-3 py-2 text-sm transition duration-150 ease-in-out border border-gray-300 cursor-pointer focus:outline-none"
              >
                <div className="w-full pb-2 h-full">
                  <div className="flex flex-row justify-between w-full h-full">
                    <div className="flex block ml-2 text-web_medium font-semibold text-yellow">
                      {group.group_name}
                    </div>
                    <div className="block ml-2 text-sm text-white">
                      <div className="dropdown relative">
                        <button
                          className={
                            "dropdown-toggle text-gray rounded-lg border-2 border-solid border-green-500 focus:outline-none w-24 h-8 flex items-center justify-center transition duration-150 ease-in-out flex"
                          }
                          data-bs-toggle="dropdown"
                          aria-expanded="false"
                        >
                          Friends
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
                          aria-labelledby="dropdownMenuButton2"
                        >
                          {group.group_friends.map((name, key) => (
                            <li
                              key={key}
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
                              {name}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="overflow-y-auto py-3 flex flex-col gap-y-4 h-full w-full">
            {friends.map((friend, i) => (
              <div
                onClick={() => onFriend(friend)}
                key={i}
                className="flex items-center bg-opacity-0 rounded-lg w-full px-3 py-2 text-sm transition duration-150 ease-in-out border border-gray-300 cursor-pointer focus:outline-none"
              >
                <div className="w-full pb-2">
                  <div className="flex justify-between block ml-2 text-lg font-semibold text-yellow">
                    {friend.user_name}
                  </div>
                  <div className="block ml-2 text-xs text-white">
                    {friend.user_bio}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
