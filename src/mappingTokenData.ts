import { AddStakeCall } from "../generated/templates/TokenData/TokenData"
import { Stake } from "../generated/schema"
import { isLatestNexusContract, getInsuredContract, getUser, toTokenDecimals } from "./helpers";
import { BigInt } from "@graphprotocol/graph-ts";

export function handleAddStake(call: AddStakeCall): void {
  if (isLatestNexusContract("tokenData", call.to)) {
    let user = getUser(call.inputs._stakerAddress);
    user.stakeCount += 1;
    user.save();

    let id = call.inputs._stakerAddress.toHexString() + "-" + BigInt.fromI32(user.stakeCount - 1).toString();
    let entity = new Stake(id);
    entity.user = user.id;
    entity.contract = getInsuredContract(call.inputs._stakedContractAddress).id;
    entity.amount = toTokenDecimals(call.inputs._amount);
    entity.unlockedAmount = BigInt.fromI32(0).toBigDecimal();
    entity.burntAmount = BigInt.fromI32(0).toBigDecimal();
    entity.daysToStake = 250;
    entity.created =  call.block.timestamp;
    entity.expires = call.block.timestamp.plus(BigInt.fromI32(entity.daysToStake * 24 * 60 * 60));
    entity.save();
  }
}
