import { TezosToolkit } from '@taquito/taquito';
import { wallet } from './wallet';

export const tezos = new TezosToolkit('https://jakartanet.smartpy.io');
export const contractAddress = 'KT1HqoKg6mtwYyjiHXRcP8NWcXhtvT973ZZF';

tezos.setWalletProvider(wallet);
