import { HttpRpcClient } from "@account-abstraction/sdk/dist/src/HttpRpcClient";
import { ethers } from "ethers";

export async function getHttpRpcClient() {
    const provider = new ethers.providers.Web3Provider(ethereum);
    const bundlerUrl = "https://node.stackup.sh/v1/rpc/e5016bd026ad62bf0fc476e96207cbc63ef2d2c8b40002a6ced78eb3f68304c0";
    const entryPointAddress = "0x0576a174D229E3cFA37253523E645A78A0C91B57";
  const chainId = await provider.getNetwork().then((net) => net.chainId);
  return new HttpRpcClient(bundlerUrl, entryPointAddress, chainId);
}