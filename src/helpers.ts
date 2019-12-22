import { NXMaster as NXMasterEntity, InsuredContract, User } from "../generated/schema";
import { log, Address, Bytes, BigInt, BigDecimal } from "@graphprotocol/graph-ts";
import { NXMaster } from "../generated/NXMaster/NXMaster";

export function isLatestNexusContract(contractName: string, address: Address): boolean {
  if (NXMasterEntity.load("1").get(contractName).toBytes() != address) {
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
    entity.claimCount = 0;
    entity.voteCount = 0;
    entity.save();
  }
  return entity as User;
}

export function getLatestAddress(nx: NXMaster, hexString: string): Address {
  return nx.getLatestAddress(Bytes.fromHexString(hexString) as Bytes);
}

export function toTokenDecimals(num: BigInt): BigDecimal {
  let decimalMultiplier = BigInt.fromI32(10).pow(18).toBigDecimal();
  return num.divDecimal(decimalMultiplier);
}