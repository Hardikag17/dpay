export const viewMethods = async (tezos) => {
  const c = await tezos.wallet.at("KT1TbkHzj8DMKn2iaBmmacghPDrCiAcW5RYe");
  console.log(JSON.stringify(c.parameterSchema.ExtractSignatures()));
};

export const checkMembership = async (tezos, name) => {
  const c = await tezos.wallet.at("KT1U14gj9VPNEhsZ3TbY79XPNYKgdHMyFM8p");
  console.log(name);
  if (undefined === (await (await c.storage())["users"].get(name)))
    return false;
  else return true;
};

export const getFriends = async (tezos, name) => {
  try {
    const c = await tezos.wallet.at("KT1U14gj9VPNEhsZ3TbY79XPNYKgdHMyFM8p");

    const storage = (await c.storage())["users"];
    const s = await storage.get(name);

    const friendList = await Promise.all(
      s.user_friends.map(async (friendName) => {
        const friend = await storage.get(friendName);
        return { user_bio: friend.user_bio, user_name: friendName };
      })
    );

    return friendList;
  } catch (err) {
    throw new Error(`Unable to fetch friends: ${err}`);
  }
};

export const getGroups = async (tezos, name) => {
  try {
    const c = await tezos.wallet.at("KT1U14gj9VPNEhsZ3TbY79XPNYKgdHMyFM8p");
    const groupStorage = (await c.storage())["groups"];
    const userStorage = (await c.storage())["users"];
    const s = await userStorage.get(name);

    const groupList = await Promise.all(
      s.user_groups.map(async (groupId) => {
        const group = await groupStorage.get(groupId);
        return {
          groupId: groupId.toNumber(),
          group_name: group.group_name,
          balance: group.balance.toNumber() / 1000000,
          group_friends: group.group_friends,
        };
      })
    );

    return groupList;
  } catch (err) {
    throw new Error(`Unable to fetch groups: ${err}`);
  }
};

export const fetchBalance = async (tezos, group_id) => {
  try {
    const c = await tezos.wallet.at("KT1U14gj9VPNEhsZ3TbY79XPNYKgdHMyFM8p");
    const groupStorage = (await c.storage())["groups"];

    return (await groupStorage.get(group_id)).balance.toNumber() / 1000000;
  } catch (err) {
    throw new Error(`Unable to fetch balance: ${err}`);
  }
};

export const register = async (tezos, user_name, user_bio) => {
  try {
    const c = await tezos.wallet.at("KT1U14gj9VPNEhsZ3TbY79XPNYKgdHMyFM8p");
    const op = await c.methods.register(user_bio, user_name).send();
    await op.confirmation();

    console.log(op.opHash);
  } catch (err) {
    throw new Error(`Unable to register: ${err}`);
  }
};

// not checking if the friend is already added
export const addFriend = async (tezos, id, friend_id) => {
  try {
    const c = await tezos.wallet.at("KT1U14gj9VPNEhsZ3TbY79XPNYKgdHMyFM8p");
    const op = await c.methods.addFriend(friend_id, id).send();
    await op.confirmation();

    console.log(op.opHash);
  } catch (err) {
    throw new Error(`Unable to add a friend: ${err}`);
  }
};

export const makeGroup = async (tezos, friends, group_name) => {
  try {
    const c = await tezos.wallet.at("KT1U14gj9VPNEhsZ3TbY79XPNYKgdHMyFM8p");
    const op = await c.methods.make_group([...friends], group_name).send();
    await op.confirmation();

    console.log(op.opHash);
  } catch (err) {
    throw new Error(`Unable to make a group: ${err}`);
  }
};

export const addAmountToGroup = async (tezos, group_id, amount) => {
  try {
    const c = await tezos.wallet.at("KT1U14gj9VPNEhsZ3TbY79XPNYKgdHMyFM8p");
    const op = await c.methods.addAmountToGroup(group_id).send({ amount });
    await op.confirmation();

    console.log(op.opHash);
    return await fetchBalance(tezos, group_id);
  } catch (err) {
    throw new Error(`Unable to add amount to group: ${err}`);
  }
};

export const withdraw = async (tezos, amount, group_id) => {
  try {
    const c = await tezos.wallet.at("KT1U14gj9VPNEhsZ3TbY79XPNYKgdHMyFM8p");
    amount = amount * 1000000;

    const op = await c.methods.withdraw(amount, group_id).send();
    await op.confirmation();

    console.log(op.opHash);
    return await fetchBalance(tezos, group_id);
  } catch (err) {
    throw new Error(`Unable to withdraw: ${err}`);
  }
};

export const transferAmountToFriend = async (tezos, friend_id, amount) => {
  try {
    const c = await tezos.wallet.at("tz1WgR5wpmrvHYCroUFpgjypZ3CKqTZgMfUK");
    const op = await c.methods
      .transferAmountToFriend(friend_id)
      .send({ amount });
    await op.confirmation();

    console.log(op.opHash);
  } catch (err) {
    throw new Error(`Unable to transfer amount: ${err}`);
  }
};

//export const stake = async (tezos, )
