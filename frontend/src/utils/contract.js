import { compact } from "@headlessui/react/dist/utils/render";

export const viewMethods = async (tezos) => {
  const c = await tezos.wallet.at("KT1HqoKg6mtwYyjiHXRcP8NWcXhtvT973ZZF");
  console.log(JSON.stringify(c.parameterSchema.ExtractSignatures()));
  console.log(JSON.stringify(await c.storage()));
};

export const checkMembership = async (tezos, name) => {};

export const register = async (tezos, user_name, user_bio) => {
  try {
    const c = await tezos.wallet.at("KT1HqoKg6mtwYyjiHXRcP8NWcXhtvT973ZZF");
    const op = await c.methods.register(user_bio, user_name).send();
    await op.confirmation();

    console.log(op.opHash);
  } catch (err) {
    throw new Error(`Unable to register: ${err}`);
  }
};

export const addFriend = async (tezos, id, friend_id) => {
  try {
    const c = await tezos.wallet.at("KT1HqoKg6mtwYyjiHXRcP8NWcXhtvT973ZZF");
    const op = await c.methods.addFriend(id, friend_id).send();
    await op.confirmation();

    console.log(op.opHash);
  } catch (err) {
    throw new Error(`Unable to add a friend: ${err}`);
  }
};

export const makeGroup = async (tezos, friends, group_name) => {
  try {
    const c = await tezos.wallet.at("KT1HqoKg6mtwYyjiHXRcP8NWcXhtvT973ZZF");
    const op = await c.methods.makeGroup(friends, group_name).send();
    await op.confirmation();

    console.log(op.opHash);
  } catch (err) {
    throw new Error(`Unable to make a group: ${err}`);
  }
};

export const addAmountToGroup = async (tezos, group_id, amount) => {
  try {
    const c = await tezos.wallet.at("KT1HqoKg6mtwYyjiHXRcP8NWcXhtvT973ZZF");
    const op = await c.methods.addAmountToGroup(group_id).send({ amount });
    await op.confirmation();

    console.log(op.opHash);
  } catch (err) {
    throw new Error(`Unable to add amount to group: ${err}`);
  }
};

export const withdraw = async (tezos, amount, group_id) => {
  try {
    const c = await tezos.wallet.at("KT1HqoKg6mtwYyjiHXRcP8NWcXhtvT973ZZF");
    const op = await c.methods.withdraw(group_id, amount).send();
    await op.confirmation();

    console.log(op.opHash);
  } catch (err) {
    throw new Error(`Unable to withdraw: ${err}`);
  }
};

export const transferAmountToFriend = async (tezos, friend_id, amount) => {
  try {
    const c = await tezos.wallet.at("KT1HqoKg6mtwYyjiHXRcP8NWcXhtvT973ZZF");
    const op = await c.methods
      .transferAmountToFriend(friend_id)
      .send({ amount });
    await op.confirmation();

    console.log(op.opHash);
  } catch (err) {
    throw new Error(`Unable to transfer amount: ${err}`);
  }
};
