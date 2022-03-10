import { ForgeAdded as ForgeAddedEvent } from "../../generated/PendleData/PendleData";
import { Forge } from "../../generated/schema";
import { IPendleForge as PendleForgeTemplate } from "../../generated/templates";

export function handleForgeAdded(event: ForgeAddedEvent): void {
  let hash = event.transaction.hash.toHexString();
  let timestamp = event.block.timestamp;
  let block = event.block.number;

  let forge = new Forge(event.params.forgeAddress.toHexString());
  forge.hash = hash;
  forge.timestamp = timestamp;
  forge.block = block;
  forge.forgeAddress = event.params.forgeAddress.toHexString();
  forge.forgeId = event.params.forgeId.toString();
  forge.save();

  // create new YieldContract from template
  PendleForgeTemplate.create(event.params.forgeAddress);
}
