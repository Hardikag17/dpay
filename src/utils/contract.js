import { compact } from "@headlessui/react/dist/utils/render";

export const viewMethods = async (tezos) => {
  const c = await tezos.wallet.at("KT1HqoKg6mtwYyjiHXRcP8NWcXhtvT973ZZF");
  console.log(JSON.stringify(c.parameterSchema.ExtractSignatures()));
};

export const checkMembership = async (tezos) => {};

export const register = async (tezos, user_name, user_bio) => {
  try {
    const c = await tezos.wallet.at("KT1HqoKg6mtwYyjiHXRcP8NWcXhtvT973ZZF");
    const op = await c.methods.register(user_name, user_bio).send();
    await op.confirmation();

    console.log(op.hash);
  } catch (err) {
    console.log("Unable to Register", err);
  }
};

export const addFriend = async (tezos, id, friend_id) => {
  try {
    const c = await tezos.wallet.at("KT1HqoKg6mtwYyjiHXRcP8NWcXhtvT973ZZF");
    const op = await c.methods.addFriend(id, friend_id).send();
    await op.confirmation();

    console.log(op.hash);
  } catch (err) {
    console.log("Unable to add Friend", err);
  }
};

export const makeGroup = async (tezos, friends, group_name) => {
  try {
    const c = await tezos.wallet.at("KT1HqoKg6mtwYyjiHXRcP8NWcXhtvT973ZZF");
    const op = await c.methods.makeGroup(friends, group_name).send();
    await op.confirmation();

    console.log(op.hash);
  } catch (err) {
    console.log("Unable to Make the Group", err);
  }
};

export const addAmountToGroup = async (tezos, group_id, amount) => {
  try {
    const c = await tezos.wallet.at("KT1HqoKg6mtwYyjiHXRcP8NWcXhtvT973ZZF");
    const op = await c.methods.addAmountToGroup(group_id).send({ amount });
    await op.confirmation();

    console.log(op.hash);
  } catch (err) {
    console.log("Unable to add amount to the group", err);
  }
};

export const withdraw = async (tezos, amount, group_id) => {
  try {
    const c = await tezos.wallet.at("KT1HqoKg6mtwYyjiHXRcP8NWcXhtvT973ZZF");
    const op = await c.methods.withdraw(group_id, amount).send();
    await op.confirmation();

    console.log(op.hash);
  } catch (err) {
    console.log("Unable to withdraw", err);
  }
};

export const transferAmountToFriend = async (tezos, friend_id, amount) => {
  try {
    const c = await tezos.wallet.at("KT1HqoKg6mtwYyjiHXRcP8NWcXhtvT973ZZF");
    const op = await c.methods
      .transferAmountToFriend(friend_id)
      .send({ amount });
    await op.confirmation();

    console.log(op.hash);
  } catch (err) {
    console.log("Unable to transfer amount");
  }
};
