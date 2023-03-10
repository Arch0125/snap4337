import { HttpRpcClient } from "@account-abstraction/sdk/dist/src/HttpRpcClient";
import { ethers } from "ethers";

export async function getHttpRpcClient() {
    const provider = new ethers.providers.Web3Provider(ethereum);
    const bundlerUrl = "https://node.stackup.sh/v1/rpc/1b79726cd7c3536558f2d641f287ccbef97aa361751ae10a06a095b66dc8edbe";
    const entryPointAddress = "0x0F46c65C17AA6b4102046935F33301f0510B163A";
  const chainId = await provider.getNetwork().then((net) => net.chainId);
  return new HttpRpcClient(bundlerUrl, entryPointAddress, chainId);
}