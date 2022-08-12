import { useState } from "react";

export default function User({ state }) {
  const groups = [
    { group_name: "Hello", balance: 0 },
    { group_name: "Hello", balance: 0 },
    { group_name: "Hello", balance: 0 },
    { group_name: "Hello", balance: 0 },
    { group_name: "Hello", balance: 0 },
    { group_name: "Hello", balance: 0 },
    { group_name: "Hello", balance: 0 },
    { group_name: "Hello", balance: 0 },
    { group_name: "Hello", balance: 0 },
  ];

  const friends = [
    { user_name: "ceniei", user_bio: "hello world" },
    { user_name: "ceniei", user_bio: "hello world" },
    { user_name: "ceniei", user_bio: "hello world" },
    { user_name: "ceniei", user_bio: "hello world" },
    { user_name: "ceniei", user_bio: "hello world" },
    { user_name: "ceniei", user_bio: "hello world" },
    { user_name: "ceniei", user_bio: "hello world" },
    { user_name: "ceniei", user_bio: "hello world" },
    { user_name: "ceniei", user_bio: "hello world" },
  ];

  return (
    <div className="text-white w-full rounded-3xl p-2 overflow-y-auto hover:brightness-125 hover:scale-110 cursor-pointer flex items-center justify-center">
      <div className="flex flex-col w-full items-center justify-center overflow-y-auto">
        {/*
        <div className="inline-flex" role="group">
          <button
            type="button"
            onClick={toggleState}
            className={
              "rounded-l px-6 py-2 border-2 " +
              (state ? "border-yellow text-yellow" : "border-grey text-gray") +
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
              (!state ? "border-yellow text-yellow" : "border-grey text-gray") +
              " font-medium text-xs leading-tight uppercase hover:bg-black hover:bg-opacity-5 focus:outline-none focus:ring-0 transition duration-150 ease-in-out "
            }
          >
            Groups
          </button>
        </div>
        */}

        {!state ? (
          <div className="overflow-y-auto py-3 grid gap-y-4 w-full">
            {groups.map((group, i) => (
              <div
                key={i}
                className="flex items-center bg-opacity-0 rounded-lg w-full px-3 py-2 text-sm transition duration-150 ease-in-out border border-gray-300 cursor-pointer focus:outline-none"
              >
                <div className="w-full pb-2">
                  <div className="flex justify-between block ml-2 text-2xl font-semibold text-yellow">
                    {group.group_name}
                  </div>
                  <div className="block ml-2 text-sm text-white">
                    Balance: {group.balance}ꜩ
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="overflow-y-auto py-3 grid gap-y-4 w-full">
            {friends.map((friend, i) => (
              <div
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
