import axios from 'axios';

export const fetchStorage = async () => {
  const res = await axios.get(
    'https://api.jakartanet.tzkt.io/v1/contracts/KT1HqoKg6mtwYyjiHXRcP8NWcXhtvT973ZZF/storage'
  );
  return res.data;
};
