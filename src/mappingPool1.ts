import { isLatestNexusContract } from "./helpers";
import { Payout } from "../generated/templates/Pool1/Pool1";
import { Cover } from "../generated/schema";

export function handlePayout(event: Payout): void {
  if(isLatestNexusContract("pool1", event.address)) {
    let entity = Cover.load(event.params.coverId.toString());
    entity.payout = event.params.tokens;
    entity.save();
  }
}