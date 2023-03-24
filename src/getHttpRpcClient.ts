import { HttpRpcClient } from "@account-abstraction/sdk/dist/src/HttpRpcClient";
import { ethers } from "ethers";

export async function getHttpRpcClient() {
    const provider = new ethers.providers.Web3Provider(ethereum);
    const bundlerUrl = "https://node.stackup.sh/v1/rpc/fab34e95d4668d37893ff3d5eb531888516bfa9b811aa1481489d9873ad3bfda";
    const entryPointAddress = "0x0576a174D229E3cFA37253523E645A78A0C91B57";
  const chainId = await provider.getNetwork().then((net) => net.chainId);
  return new HttpRpcClient(bundlerUrl, entryPointAddress, chainId);
}