import { Bytes, log } from "@graphprotocol/graph-ts"
import { ContractRegister, AddNewVersionCall } from "../generated/ContractRegister/ContractRegister";
import { MemberRoles, TokenData, ClaimsData, QuotationData, TokenController } from "../generated/templates";
import { NexusContracts } from  "../generated/schema";
import { getLatestAddress } from "./helpers";

export function updateContracts(call: AddNewVersionCall): void {
  log.info("Updating contracts", []);
  let register = ContractRegister.bind(call.to);

  // got bytes using https://onlineutf8tools.com/convert-utf8-to-bytes
  let memberRoles =  getLatestAddress(register, "4d52"); // MR
  let tokenData =  getLatestAddress(register, "5444"); // TD
  let claimsData = getLatestAddress(register, "4344"); // CD
  let quotationData = getLatestAddress(register, "5144") // QD
  let tokenController = getLatestAddress(register, "5443") // TC

  // Add support for Events:
  // Payout
  // Commission

  let entity = NexusContracts.load("1");
  if (entity == null) {
    entity = new NexusContracts("1");
    entity.contractRegister = register._address;
    entity.memberRoles = new Bytes(0);
    entity.tokenData = new Bytes(0);
    entity.claimsData = new Bytes(0);
    entity.quotationData = new Bytes(0);
    entity.tokenController = new Bytes(0);
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
  if (entity.claimsData != claimsData) {
    log.info("Found new claimsData contract: {}", [claimsData.toHexString()]);
    entity.claimsData = claimsData;
    ClaimsData.create(claimsData);
  }
  if (entity.quotationData != quotationData) {
    log.info("Found new quotationData contract: {}", [quotationData.toHexString()]);
    entity.quotationData = quotationData;
    QuotationData.create(quotationData);
  }
  if (entity.tokenController != tokenController) {
    log.info("Found new tokenController contract: {}", [tokenController.toHexString()]);
    entity.tokenController = tokenController;
    TokenController.create(tokenController);
  }
  entity.save();
}