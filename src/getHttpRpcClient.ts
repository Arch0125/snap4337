import { HttpRpcClient } from "@account-abstraction/sdk/dist/src/HttpRpcClient";
import { ethers } from "ethers";

export async function getHttpRpcClient() {
    const provider = new ethers.providers.Web3Provider(ethereum);
    const bundlerUrl = "https://node.stackup.sh/v1/rpc/1b79726cd7c3536558f2d641f287ccbef97aa361751ae10a06a095b66dc8edbe";
    const entryPointAddress = "0x0576a174D229E3cFA37253523E645A78A0C91B57";
  const chainId = await provider.getNetwork().then((net) => net.chainId);
  return new HttpRpcClient(bundlerUrl, entryPointAddress, chainId);
}