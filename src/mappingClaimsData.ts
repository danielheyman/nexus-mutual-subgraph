import { VoteCast, ClaimRaise } from "../generated/templates/ClaimsData/ClaimsData"
import {Vote, Claim} from "../generated/schema"
import{isLatestNexusContract, getUser} from "./helpers";

export function handleVoteCast(event: VoteCast): void {
  if(isLatestNexusContract("claimsData", event.address)) {
    let id = event.params.claimId.toString() + "-" + event.params.userAddress.toHexString();
    let entity = Vote.load(id);
    if(entity == null) {
      entity = new Vote(id);
      entity.user = getUser(event.params.userAddress).id;
      entity.claim = event.params.claimId.toString();
      entity.verdict = event.params.verdict;
      entity.submitDate = event.params.submitDate;
      entity.save();
    }
  }
}

export function handleClaimRaise(event: ClaimRaise): void {
  if(isLatestNexusContract("claimsData", event.address)) {
    let id = event.params.claimId.toString();
    let entity = Claim.load(id);
    if(entity == null) {
      entity = new Claim(id);
      entity.user = getUser(event.params.userAddress).id;
      entity.cover = event.params.coverId.toString();
      entity.submitDate = event.params.dateSubmit;
      entity.save();
    }
  }
}