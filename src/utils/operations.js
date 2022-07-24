import { tezos, contractAddress } from './tezos';
import { bytes2Char } from '@taquito/utils';

export const fetchTezosDomainFromWalletAddressInContract = async (
) => {
  const contract = await tezos.wallet.at(contractAddress);
  const storage = await contract.storage();
  const domain = await storage.store.reverse_records.get(address);
  if (domain) {
    return bytes2Char(domain.name);
  } else {
    return 'You are a new user of our platform';
  }
};

// export const buyTicketOperation = async () => {
//   try {
//     const contractInstance = await tezos.wallet.at("KT1JGp6cyFQPKprgJmHdfx1BKCAWvcscz6sR");
//     const op = await contractInstance.methods.buy_ticket().send({
//       amount: 1,
//       mutez: false,
//     });
//     await op.confirmation(1);
//   } catch (err) {
//     throw err;
//   }
// };
// export const endGameOperation = async () => {
//   try {
//     const contractInstance = await tezos.wallet.at("KT1JGp6cyFQPKprgJmHdfx1BKCAWvcscz6sR");
//     const op = await contractInstance.methods.end_game().send();
//     await op.confirmation(1);
//   } catch (err) {
//     throw err;
//   }
// };
