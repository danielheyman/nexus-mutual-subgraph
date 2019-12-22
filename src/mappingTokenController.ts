import { NexusContracts, Stake } from "../generated/schema"
import{ isLatestNexusContract, getUser, getInsuredContract } from "./helpers";
import { Burned, Unlocked, Locked } from "../generated/templates/TokenController/TokenController";
import { Address, BigInt, log } from "@graphprotocol/graph-ts";
import { TokenData } from "../generated/templates/TokenData/TokenData";

export function handleBurned(event: Burned): void {
  if(isLatestNexusContract("tokenController", event.address)) {
    let td = TokenData.bind(NexusContracts.load("1").tokenData as Address);
    let stakes = td.getStakerStakedContractLength(event.params.member).toI32();
    let user = getUser(event.params.member);
    for (let i = 0; i < stakes; i++) {
      let burned = td.getStakerStakedBurnedByIndex(event.params.member, BigInt.fromI32(i));
      if (burned.toI32() == 0) {
        continue;
      }
      let id = user.id + "-" + i.toString();
      let entity = Stake.load(id);
      if (entity.burntAmount == burned) {
        continue;
      }
      log.debug("Burning stake for {}", [id]);
      entity.burntAmount = burned;
      entity.save();
    }
  }
}

export function handleUnlocked(event: Unlocked): void {
  if(isLatestNexusContract("tokenController", event.address)) {
    let td = TokenData.bind(NexusContracts.load("1").tokenData as Address);
    let stakes = td.getStakerStakedContractLength(event.params._of).toI32();
    let user = getUser(event.params._of);
    for (let i = 0; i < stakes; i++) {
      let unlocked = td.getStakerUnlockedStakedTokens(event.params._of, BigInt.fromI32(i));
      if (unlocked.toI32() == 0) {
        continue;
      }
      let id = user.id + "-" + i.toString();
      let entity = Stake.load(id);
      if (entity.unlockedAmount == unlocked) {
        continue;
      }
      log.debug("Unlocking stake for {}", [id]);
      entity.unlockedAmount = unlocked;
      entity.save();
    }
  }
}