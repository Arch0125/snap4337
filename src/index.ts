import { OnRpcRequestHandler } from '@metamask/snap-types';
import { ethers } from 'ethers';
import { getAbstractAccount } from './getAbstractAccount';
import { getBalance } from './getBalance';
import { getHttpRpcClient } from './getHttpRpcClient';
import { HttpRpcClient } from "@account-abstraction/sdk/dist/src/HttpRpcClient";
import { panel, heading, text } from '@metamask/snaps-ui';


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
        const eoa = await getEoaAddress();
        await snap.request({
          method: 'snap_dialog',
          params: {
            type: 'Confirmation',
            content: panel([
              heading('Account Generation'),
              text(`Smart Contract Wallet ${addr} has been generated`),
              text(`from EOA ${eoa}`)
            ]),
          },
        });
        break;
    }
    case 'deposit_aa':{
      const provider = new ethers.providers.Web3Provider(ethereum);
      const signer = provider.getSigner();
      const ethamount = await snap.request({
        method: 'snap_dialog',
        params: {
          type: 'Prompt',
          content: panel([
            heading('Deposit ETH to Smart Contract Wallet'),
            text(`Current Balance for Smart Contract Wallet ${await getAddress()} is ${await getBalance(await getAddress())} ETH`),
            text('Enter the amount of ETH to deposit'),
          ]),
          placeholder: '0.01 ETH',
        },
      });
      const addr = await getAddress();
      const tx = await signer.sendTransaction({
        to: addr,
        value: ethers.utils.parseEther(ethamount),
      });
      await tx.wait();
      await snap.request({
        method: 'snap_dialog',
        params: {
          type: 'Alert',
          content: panel([
            heading('Deposit Complete'),
            text(`New Balance for Smart Contract Wallet ${addr} is ${await getBalance(addr)} ETH`),
          ]),
        },
      });      
      break;
    }
    default:
      throw new Error('Method not found.');
  }
};
