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
    setCurrentGroup(group.groupId.toNumber());
    setCurrentGroupAmount(group.balance.toNumber() / 1000000);
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
    <div className="text-white w-full rounded-3xl p-2 overflow-y-auto hover:brightness-125 hover:scale-110 cursor-pointer flex items-center justify-center">
      <div className="flex flex-col w-full items-center justify-center overflow-y-auto">
        {!state ? (
          <div className="overflow-y-auto py-3 grid gap-y-4 w-full">
            {groups.map((group, i) => (
              <div
                key={i}
                onClick={() => onGroup(group)}
                className="flex items-center bg-opacity-0 rounded-lg w-full px-3 py-2 text-sm transition duration-150 ease-in-out border border-gray-300 cursor-pointer focus:outline-none"
              >
                <div className="w-full pb-2">
                  <div className="flex justify-between block ml-2 text-2xl font-semibold text-yellow">
                    {group.group_name}
                  </div>
                  <div className="block ml-2 text-sm text-white">
                    Balance: {group.balance.toNumber() / 1000000}ꜩ
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="overflow-y-auto py-3 grid gap-y-4 w-full">
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
