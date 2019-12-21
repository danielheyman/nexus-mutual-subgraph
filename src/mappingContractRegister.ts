import { Bytes, log } from "@graphprotocol/graph-ts"
import { ContractRegister, AddNewVersionCall } from "../generated/ContractRegister/ContractRegister";
import { MemberRoles, Pool1, TokenData, Claims } from "../generated/templates";
import { NexusContracts } from  "../generated/schema";
import { getLatestAddress } from "./helpers";

export function updateContracts(call: AddNewVersionCall): void {
  log.info("Updating contracts", []);
  let register = ContractRegister.bind(call.to);

  // got bytes using https://onlineutf8tools.com/convert-utf8-to-bytes
  let pool1 = getLatestAddress(register, "5031"); // P1
  let memberRoles =  getLatestAddress(register, "4d52"); // MR
  let tokenData =  getLatestAddress(register, "5444"); // TD
  let claims = getLatestAddress(register, "434c"); // CL
  
  let entity = NexusContracts.load("1");
  if (entity == null) {
    entity = new NexusContracts("1");
    entity.contractRegister = register._address;
    entity.pool1 = new Bytes(0);
    entity.memberRoles = new Bytes(0);
    entity.tokenData = new Bytes(0);
    entity.claims = new Bytes(0);
  }
  if (entity.pool1 != pool1) {
    log.info("Found new pool1 contract: {}", [pool1.toHexString()]);
    entity.pool1 = pool1;
    Pool1.create(pool1);
  }
  if (entity.memberRoles != memberRoles) {
    log.info("Found new memberRoles contract: {}", [memberRoles.toHexString()]);
    entity.memberRoles = memberRoles;
    MemberRoles.create(memberRoles);
  }
  if (entity.tokenData != tokenData) {
    log.info("Found new tokenData contract: {}", [tokenData.toHexString()]);
    entity.tokenData = tokenData;
    TokenData.create(tokenData);
  }
  if (entity.claims != claims) {
    log.info("Found new claims contract: {}", [claims.toHexString()]);
    entity.claims = claims;
    Claims.create(claims);
  }
  entity.save();
}