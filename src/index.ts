import { OnRpcRequestHandler } from '@metamask/snap-types';
import { ethers } from 'ethers';
import { getAbstractAccount } from './getAbstractAccount';
import { getBalance } from './getBalance';
import { getHttpRpcClient } from './getHttpRpcClient';
import { HttpRpcClient } from "@account-abstraction/sdk/dist/src/HttpRpcClient";


export const getEoaAddress = async (): Promise<string> => {
  const provider = new ethers.providers.Web3Provider(ethereum);
  const accounts = await provider.send('eth_requestAccounts', []);
  return accounts[0];
};

export const getAddress = async (): Promise<string> => {
  const aa = await getAbstractAccount();
  const address = await aa.getAccountAddress();
  return address;
};

export const HttpClient = async () => {
  const client = await getHttpRpcClient();
  return client;
}


export const onRpcRequest: OnRpcRequestHandler = async ({
  origin,
  request,
}) => {
  console.log(origin);
  console.log(request);
  switch (request.method) {
    case 'init_aa':
      {
        const addr = await getAddress();
        const client = await HttpClient();
        await snap.request({
          method: 'snap_confirm',
          params: [
            {
              prompt: 'Would you like to take the action?',
              description: 'The action is...',
              textAreaContent: `Very detailed information about the action...${JSON.stringify(client)}`,
            },
          ],
        });
        break;
      }
    default:
      throw new Error('Method not found.');
  }
};
