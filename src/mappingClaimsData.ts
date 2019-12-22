import { VoteCast, ClaimRaise, ClaimsData } from "../generated/templates/ClaimsData/ClaimsData"
import { Vote, Claim } from "../generated/schema"
import{ isLatestNexusContract, getUser } from "./helpers";

export function handleVoteCast(event: VoteCast): void {
  if(isLatestNexusContract("claimsData", event.address)) {
    let user = getUser(event.params.userAddress);
    user.voteCount += 1;
    user.save();

    let claim = Claim.load(event.params.claimId.toString());
    claim.voteCount += 1;
    claim.save();

    let id = event.params.claimId.toString() + "-" + event.params.userAddress.toHexString();
    let entity = new Vote(id);
    entity.user = user.id;
    entity.claim = claim.id;
    entity.verdict = event.params.verdict == 1 ? "Accepted" : "Denied";
    entity.submitDate = event.params.submitDate;
    entity.save();
  }
}

export function handleClaimRaise(event: ClaimRaise): void {
  if(isLatestNexusContract("claimsData", event.address)) {
    let cd = ClaimsData.bind(event.address);

    let user = getUser(event.params.userAddress);
    user.claimCount += 1;
    user.save();

    let id = event.params.claimId.toString();
    let entity = new Claim(id);
    entity.user = user.id;
    entity.cover = event.params.coverId.toString();
    entity.submitDate = event.params.dateSubmit;
    entity.statusUpdateDate = event.params.dateSubmit;
    entity.status = "CAVote";
    entity.voteCount = 0;
    entity.maxVotingTime = cd.maxVotingTime();
    entity.save();
  }
}