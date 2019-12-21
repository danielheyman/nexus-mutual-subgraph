import { NexusContracts, InsuredContract, User } from "../generated/schema";
import { log, Address } from "@graphprotocol/graph-ts";

export function isLatestNexusContract(contractName: string, address: Address): boolean {
  if (NexusContracts.load("1").get(contractName).toBytes() != address) {
    log.info("Ignoring outdated {} contract: {}", [contractName, address.toHexString()]);
    return false;
  }
  return true;
}

export function getInsuredContract(address: Address): InsuredContract {
  let id = address.toHexString();
  let entity = InsuredContract.load(id)
  if (entity == null) {
    entity = new InsuredContract(id);
    entity.save();
  }
  return entity as InsuredContract;
}

export function getUser(address: Address): User {
  let id = address.toHexString();
  let entity = User.load(id);
  if (entity == null) {
    entity = new User(id);
    entity.isMember = false;
    entity.coverCount = 0;
    entity.stakeCount = 0;
    entity.save();
  }
  return entity as User;
}