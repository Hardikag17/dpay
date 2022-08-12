import { compact } from "@headlessui/react/dist/utils/render";

export const viewMethods = async (tezos) => {
  const c = await tezos.wallet.at("KT1WrR6YgbwEf7p4idnhr6kmaCDcfUsgLbjb");
  console.log(JSON.stringify(c.parameterSchema.ExtractSignatures()));
  tezos.wallet
    .at("KT1WrR6YgbwEf7p4idnhr6kmaCDcfUsgLbjb")
    .then((myContract) => {
      return myContract.storage();
    })
    .then((myStorage) => {
      return myStorage["users"].get("cenieijak");
    })
    .then((val) => console.log(val));
};

export const checkMembership = async (tezos, name) => {
  const c = await tezos.wallet.at("KT1WrR6YgbwEf7p4idnhr6kmaCDcfUsgLbjb");
  console.log(name);
  if (undefined === (await (await c.storage())["users"].get(name)))
    return false;
  else return true;
};

export const getFriends = async (tezos, name) => {
  try {
    const c = await tezos.wallet.at("KT1WrR6YgbwEf7p4idnhr6kmaCDcfUsgLbjb");

    const storage = (await c.storage())["users"];
    const s = await storage.get(name);

    const friendList = await Promise.all(
      s.user_friends.map(async (friendName) => {
        const friend = await storage.get(friendName);
        console.log(friendName, friend);
        return { user_bio: friend.user_bio, user_name: friendName };
      })
    );

    console.log(friendList);
    return friendList;
  } catch (err) {
    throw new Error(`Unable to fetch friends: ${err}`);
  }
};

export const getGroups = async (tezos, name) => {
  try {
    const c = await tezos.wallet.at("KT1WrR6YgbwEf7p4idnhr6kmaCDcfUsgLbjb");
    const groupStorage = await c.storage()["groups"];

    const groupList = await Promise.all(
      (
        await (await c.storage())["users"].get(name)
      ).user_groups.map(async (groupId) => {
        const group = await groupStorage.get(groupId);
        return { group_name: group.group_name, balance: group.balance };
      })
    );

    console.log(groupList);
    return groupList;
  } catch (err) {
    throw new Error(`Unable to fetch groups: ${err}`);
  }
};

export const register = async (tezos, user_name, user_bio) => {
  try {
    const c = await tezos.wallet.at("KT1WrR6YgbwEf7p4idnhr6kmaCDcfUsgLbjb");
    const op = await c.methods.register(user_bio, user_name).send();
    await op.confirmation();

    console.log(op.opHash);
  } catch (err) {
    throw new Error(`Unable to register: ${err}`);
  }
};

export const addFriend = async (tezos, id, friend_id) => {
  try {
    const c = await tezos.wallet.at("KT1WrR6YgbwEf7p4idnhr6kmaCDcfUsgLbjb");
    const op = await c.methods.addFriend(friend_id, id).send();
    await op.confirmation();

    console.log(op.opHash);
  } catch (err) {
    throw new Error(`Unable to add a friend: ${err}`);
  }
};

export const makeGroup = async (tezos, friends, group_name) => {
  try {
    const c = await tezos.wallet.at("KT1WrR6YgbwEf7p4idnhr6kmaCDcfUsgLbjb");
    const op = await c.methods.makeGroup(friends, group_name).send();
    await op.confirmation();

    console.log(op.opHash);
  } catch (err) {
    throw new Error(`Unable to make a group: ${err}`);
  }
};

export const addAmountToGroup = async (tezos, group_id, amount) => {
  try {
    const c = await tezos.wallet.at("KT1WrR6YgbwEf7p4idnhr6kmaCDcfUsgLbjb");
    const op = await c.methods.addAmountToGroup(group_id).send({ amount });
    await op.confirmation();

    console.log(op.opHash);
  } catch (err) {
    throw new Error(`Unable to add amount to group: ${err}`);
  }
};

export const withdraw = async (tezos, amount, group_id) => {
  try {
    const c = await tezos.wallet.at("KT1WrR6YgbwEf7p4idnhr6kmaCDcfUsgLbjb");
    const op = await c.methods.withdraw(group_id, amount).send();
    await op.confirmation();

    console.log(op.opHash);
  } catch (err) {
    throw new Error(`Unable to withdraw: ${err}`);
  }
};

export const transferAmountToFriend = async (tezos, friend_id, amount) => {
  try {
    const c = await tezos.wallet.at("KT1WrR6YgbwEf7p4idnhr6kmaCDcfUsgLbjb");
    const op = await c.methods
      .transferAmountToFriend(friend_id)
      .send({ amount });
    await op.confirmation();

    console.log(op.opHash);
  } catch (err) {
    throw new Error(`Unable to transfer amount: ${err}`);
  }
};
