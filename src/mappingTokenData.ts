import { AddStakeCall, PushUnlockedStakedTokensCall, TokenData, PushBurnedTokensCall } from "../generated/templates/TokenData/TokenData"
import { Stake } from "../generated/schema"
import { isLatestNexusContract, getInsuredContract, getUser } from "./helpers";
import { BigInt, log } from "@graphprotocol/graph-ts";

export function handleAddStake(call: AddStakeCall): void {
  if (isLatestNexusContract("tokenData", call.to)) {
    let user = getUser(call.inputs._stakerAddress);
    let id = call.inputs._stakerAddress.toHexString() + "-" + BigInt.fromI32(user.stakeCount).toString();

    let entity = Stake.load(id);
    if (entity == null) {
      entity = new Stake(id);
      entity.user = user.id;
      entity.contract = getInsuredContract(call.inputs._stakedContractAddress).id;
      let decimalMultiplier = BigInt.fromI32(10).pow(18).toBigDecimal();
      entity.amount = call.inputs._amount.divDecimal(decimalMultiplier);
      entity.unlockedAmount = BigInt.fromI32(0);
      entity.burntAmount = BigInt.fromI32(0);
      entity.daysToStake = 250;
      entity.created =  call.block.timestamp;
      entity.expires = call.block.timestamp.plus(BigInt.fromI32(entity.daysToStake * 24 * 60 * 60));
      entity.save();

      user.stakeCount += 1;
      user.save();
    }
  }
}

export function handleRemoveStake(call: PushUnlockedStakedTokensCall): void {
  if (isLatestNexusContract("tokenData", call.to)) {
    let id = call.inputs._stakerAddress.toHexString() + "-" + call.inputs._stakerIndex.toString();
    let entity = Stake.load(id);
    log.debug("Unlocking stake for {}", [id]);
    entity.unlockedAmount = entity.unlockedAmount.plus(call.inputs._amount);
    entity.save(); 
  }
}

export function handleBurnStake(call: PushBurnedTokensCall): void {
  if (isLatestNexusContract("tokenData", call.to)) {
    let id = call.inputs._stakerAddress.toHexString() + "-" + call.inputs._stakerIndex.toString();
    let entity = Stake.load(id);
    log.debug("Burning stake for {}", [id]);
    entity.burntAmount = entity.burntAmount.plus(call.inputs._amount);
    entity.save();
  }
}