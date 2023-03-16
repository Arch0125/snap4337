import { OnRpcRequestHandler } from "@metamask/snap-types";
import { ethers } from "ethers";
import { getAbstractAccount } from "./getAbstractAccount";
import { getBalance } from "./getBalance";
import { getHttpRpcClient } from "./getHttpRpcClient";
import { HttpRpcClient } from "@account-abstraction/sdk/dist/src/HttpRpcClient";
import { panel, heading, text } from "@metamask/snaps-ui";
import { OnTransactionHandler } from "@metamask/snap-types";

export const getEoaAddress = async (): Promise<string> => {
  const provider = new ethers.providers.Web3Provider(ethereum);
  const accounts = await provider.send("eth_requestAccounts", []);
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
};

export const onRpcRequest: OnRpcRequestHandler = async ({
  origin,
  request,
}) => {
  console.log(origin);
  console.log(request);
  switch (request.method) {
    case "init_aa": {
      const addr = await getAddress();
      const eoa = await getEoaAddress();
      await snap.request({
        method: "snap_dialog",
        params: {
          type: "Confirmation",
          content: panel([
            heading("Account Generation"),
            text(`Smart Contract Wallet ${addr} has been generated`),
            text(`from EOA ${eoa}`),
          ]),
        },
      });
      break;
    }
    case "deposit_aa": {
      const provider = new ethers.providers.Web3Provider(ethereum);
      const signer = provider.getSigner();
      const ethamount = await snap.request({
        method: "snap_dialog",
        params: {
          type: "Prompt",
          content: panel([
            heading("Deposit ETH to Smart Contract Wallet"),
            text(
              `Current Balance for Smart Contract Wallet ${await getAddress()} is ${await getBalance(
                await getAddress()
              )} ETH`
            ),
            text("Enter the amount of ETH to deposit"),
          ]),
          placeholder: "0.01 ETH",
        },
      });
      const addr = await getAddress();
      const tx = await signer.sendTransaction({
        to: addr,
        value: ethers.utils.parseEther(ethamount),
      });
      await tx.wait();
      await snap.request({
        method: "snap_dialog",
        params: {
          type: "Alert",
          content: panel([
            heading("Deposit Complete"),
            text(
              `New Balance for Smart Contract Wallet ${addr} is ${await getBalance(
                addr
              )} ETH`
            ),
          ]),
        },
      });
      break;
    }
    case "transact_aa": {
      const aa = await getAbstractAccount();
      const target = ethers.utils.getAddress(
        "0x118aeFa610ceb7C42C73d83dfC3D8C54124A4946"
      );
      const value = ethers.utils.parseEther("0.001");
      const op = await aa.createSignedUserOp({
        target,
        value,
        data: "0x",
      });
      const client = await HttpClient();
      const uoHash = await client.sendUserOpToBundler(op);
      console.log(`UserOpHash: ${uoHash}`);

      const txHash = await aa.getUserOpReceipt(uoHash);
      console.log(`Transaction hash: ${txHash}`);

      await snap.request({
        method: "snap_dialog",
        params: {
          type: "Alert",
          content: panel([
            heading("Transaction Sent"),
            text(`Transaction sent to the network`),
            text(`UserOpHash: ${uoHash}`),
            text(`Transaction hash: ${txHash}`),
          ]),
        },
      });

      break;
    }
    default:
      throw new Error("Method not found.");
  }
};

export const onTransaction: OnTransactionHandler = async ({
  transaction,
  chainId,
}) => {
  const insights = transaction;
  const provider = new ethers.providers.Web3Provider(ethereum);
  const signer = provider.getSigner();
  const addr = await getAddress();
  const fromaddr = `From : ${addr.slice(0, 6)}` + `...` + `${addr.slice(-4)}`;
  const toaddr =
    `To : ${String(insights.to).slice(0, 6)}` +
    `...` +
    `${String(insights.to).slice(-4)}`;

  const target: string = String(transaction.to);
  const value: any = transaction.value;
  const data: any = transaction.data;

  const aa = await getAbstractAccount();
  const op = await aa.createSignedUserOp({
    target,
    value,
    data,
  });
  const client = await HttpClient();
  const uoHash = await client.sendUserOpToBundler(op);
  console.log(`UserOpHash: ${uoHash}`);

  const txHash = await aa.getUserOpReceipt(uoHash);
  console.log(`Transaction hash: ${txHash}`);

  const res = await snap.request({
    method: "snap_dialog",
    params: {
      type: "Alert",
      content: panel([
        heading("Transaction Sent"),
        text(`Transaction sent to the network`),
        text(`UserOpHash: ${uoHash}`),
        text(`Transaction hash: ${txHash}`),
      ]),
    },
  });

  return {
    content: panel([
      heading("Welcome to AA Snap!"),
      text(
        "If you want to sign using your **SCW**, please click the **REJECT** button below."
      ),
      text(
        "You will be taken to the AA Snap UI where you can sign the transaction."
      ),
      text("or **CONFIRM** here to sign using your **EOA**"),
    ]),
  };
};
