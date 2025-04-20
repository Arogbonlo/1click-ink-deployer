import { ApiPromise, WsProvider } from '@polkadot/api';
import { CodePromise } from '@polkadot/api-contract';
import type { WeightV2 } from '@polkadot/types/interfaces';
import type { ISubmittableResult, Signer, SignerPayloadJSON } from '@polkadot/types/types';

interface DeployContractParams {
  wasmCode: Uint8Array;
  metadata: Record<string, unknown>;
  constructorName: string;
  constructorArgs: unknown[];
  senderAddress: string;
  signer: Signer;
  rpcUrl: string;
}

interface DeployResult {
  status: 'success';
  blockHash: string;
  events: ISubmittableResult['events'];
}

export async function deployContract({
  wasmCode,
  metadata,
  constructorName,
  constructorArgs,
  senderAddress,
  signer,
  rpcUrl,
}: DeployContractParams): Promise<DeployResult> {
  const provider = new WsProvider(rpcUrl);
  const api = await ApiPromise.create({ provider });

  try {
    await api.setSigner(signer);
    const code = new CodePromise(api, metadata, wasmCode);

    const gasLimit: WeightV2 = api.registry.createType('WeightV2', {
      refTime: BigInt(2_000_000_000),
      proofSize: BigInt(1_000_000),
    });

    const storageDepositLimit = null;
    const txConstructor = code.tx[constructorName as keyof typeof code.tx];

    if (typeof txConstructor !== 'function') {
      throw new Error(`Constructor "${constructorName}" not found.`);
    }

    const tx = txConstructor(
      { gasLimit, storageDepositLimit },
      ...constructorArgs
    );

    return await new Promise((resolve, reject) => {
      tx.signAndSend(senderAddress, (result: ISubmittableResult) => {
        if (result.status.isInBlock) {
          console.log('📦 Included in block:', result.status.asInBlock.toString());
        }

        if (result.status.isFinalized) {
          console.log('✅ Finalized in block:', result.status.asFinalized.toString());
          resolve({
            status: 'success',
            blockHash: result.status.asFinalized.toString(),
            events: result.events,
          });
        }

        if (result.isError) {
          reject(new Error('❌ Transaction failed'));
        }
      }).catch((error: unknown) => reject(error as Error));
    });
  } catch (error) {
    throw error as Error;
  } finally {
    await api.disconnect();
  }
}
