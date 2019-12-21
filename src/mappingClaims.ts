import { SubmitClaimCall} from "../generated/templates/Claims/Claims"
import {Claim} from "../generated/schema"
import{isLatestNexusContract} from "./helpers";

export function handleSubmitClaim(call: SubmitClaimCall): void {
  if(isLatestNexusContract("claims", call.to)) {
    let id = call.transaction.hash.toHexString();
    let entity = Claim.load(id);
    if(entity == null) {
      entity = new Claim(id);
      entity.cover = call.inputs.coverId.toString();
      entity.save();
    }
  }
}

// export function handleAddClaimVoteCACall(call: AddClaimVoteCACall) void {

// }

// export function handleAddClaimVotememberCall(call: AddClaimVotememberCall) void {
    
// }