import type { Account, PublicClient } from "viem";
import { formatEther } from "viem";

type EstimateContractGasParameters = Parameters<PublicClient["estimateContractGas"]>[0];

/**
 * Ensures `account` holds enough native currency to cover an estimated contract call (gas × fee + buffer).
 * @returns An error message if funds are insufficient; otherwise `undefined`.
 */
export async function ensureNativeBalanceForContractCall(
  publicClient: PublicClient,
  account: Account,
  estimateParams: Omit<EstimateContractGasParameters, "account">,
  options?: {
    fallbackGas?: bigint;
    bufferNumerator?: bigint;
    bufferDenominator?: bigint;
  },
): Promise<string | undefined> {
  const {
    fallbackGas = 5_000_000n,
    bufferNumerator = 115n,
    bufferDenominator = 100n,
  } = options ?? {};

  const balance = await publicClient.getBalance({ address: account.address });

  let gasEstimate: bigint;
  try {
    gasEstimate = await publicClient.estimateContractGas({
      ...estimateParams,
      account,
    });
  } catch {
    gasEstimate = fallbackGas;
  }

  const feeData = await publicClient.estimateFeesPerGas().catch(() => undefined);
  const weiPerGas = feeData?.maxFeePerGas ?? (await publicClient.getGasPrice());

  const required = (gasEstimate * weiPerGas * bufferNumerator) / bufferDenominator;

  if (balance < required) {
    return `Insufficient native balance for transaction: have ${formatEther(balance)}, need ~${formatEther(
      required,
    )} (${gasEstimate.toString()} gas × ${weiPerGas.toString()} wei/gas; buffer ${bufferNumerator}/${bufferDenominator}).`;
  }

  return undefined;
}
