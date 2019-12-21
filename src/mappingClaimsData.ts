import { AddClaimCall} from "../generated/templates/ClaimsData/ClaimsData"
import {Claim} from "../generated/schema"
import{isLatestNexusContract} from "./helpers";

export function handleAddClaim(call: AddClaimCall): void {
    if(isLatestNexusContract("claimsData", call.to)) {
        let id = call.inputs._claimId.toHexString()
        let entity = Claim.load(id)
        if(entity == null) {
            entity = new Claim(id)
            entity.save()
        }
    }
}

// export function handleAddClaimVoteCACall(call: AddClaimVoteCACall) void {

// }

// export function handleAddClaimVotememberCall(call: AddClaimVotememberCall) void {
    
// }