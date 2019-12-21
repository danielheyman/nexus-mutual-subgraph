import { PayJoiningFeeCall } from "../generated/templates/MemberRoles/MemberRoles"
import { User } from "../generated/schema"
import { isLatestNexusContract, getUser } from "./helpers";

export function handlePayJoiningFee(call: PayJoiningFeeCall): void {
  if (isLatestNexusContract("memberRoles", call.to)) {
    let entity = getUser(call.inputs._userAddress);
    entity.isMember = true;
    entity.save();
  }
}
