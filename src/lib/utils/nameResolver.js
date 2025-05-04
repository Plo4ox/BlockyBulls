import {
  resolveName,
  resolveL2Name,
  BASENAME_RESOLVER_ADDRESS,
} from "thirdweb/extensions/ens";
import { base } from "thirdweb/chains";

export async function resolveAddressToName(client, address) {
  let L2Name, L1Name;

  try {
    L2Name = await resolveL2Name({
      client,
      address: address,
      resolverAddress: BASENAME_RESOLVER_ADDRESS,
      resolverChain: base,
    });
  } catch (L2Err) {
    console.warn("Error resolving L2 name:", L2Err);
  }

  if (!L2Name) {
    try {
      L1Name = await resolveName({
        client,
        address: address,
      });
    } catch (L1Err) {
      console.warn("Error resolving L1 name:", L1Err);
    }
  }
  return L2Name ?? L1Name ?? null;
}
