import { ethers } from 'ethers';
import { SimpleAccountAPI } from '@account-abstraction/sdk';

const entryPointAddress = '0x0576a174D229E3cFA37253523E645A78A0C91B57';
const factoryAddress = '0x71D63edCdA95C61D6235552b5Bc74E32d8e2527B';

export const getAbstractAccount = async (): Promise<SimpleAccountAPI> => {
  const provider = new ethers.providers.Web3Provider(ethereum);
  await provider.send('eth_requestAccounts', []);
  const owner = provider.getSigner();
  const aa = new SimpleAccountAPI({
    provider,
    entryPointAddress,
    owner,
    factoryAddress,
  });
  return aa;
};
