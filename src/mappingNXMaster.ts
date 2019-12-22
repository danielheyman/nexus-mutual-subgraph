import { Bytes, log } from "@graphprotocol/graph-ts"
import { NXMaster, AddNewVersionCall, DelegateCallBackCall } from "../generated/NXMaster/NXMaster";
import { MemberRoles, TokenData, ClaimsData, QuotationData, TokenController, Pool1 } from "../generated/templates";
import { NXMaster as NXMasterEntity, Claim } from  "../generated/schema";
import { PoolData } from  "../generated/templates/PoolData/PoolData";
import { ClaimsData as ClaimsDataInstance } from "../generated/templates/ClaimsData/ClaimsData";
import { getLatestAddress } from "./helpers";

export function handleAddNewVersion(call: AddNewVersionCall): void {
  log.info("Updating contracts", []);
  let nx = NXMaster.bind(call.to);

  // got bytes using https://onlineutf8tools.com/convert-utf8-to-bytes
  let memberRoles =  getLatestAddress(nx, "4d52"); // MR
  let tokenData =  getLatestAddress(nx, "5444"); // TD
  let claimsData = getLatestAddress(nx, "4344"); // CD
  let quotationData = getLatestAddress(nx, "5144") // QD
  let tokenController = getLatestAddress(nx, "5443") // TC
  let pool1 = getLatestAddress(nx, "5031") // P1

  // Add support for Events:
  // Commission

  let entity = NXMasterEntity.load("1");
  if (entity == null) {
    entity = new NXMasterEntity("1");
    entity.self = call.to;
    entity.memberRoles = new Bytes(0);
    entity.tokenData = new Bytes(0);
    entity.claimsData = new Bytes(0);
    entity.quotationData = new Bytes(0);
    entity.tokenController = new Bytes(0);
    entity.pool1 = new Bytes(0);
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
  if (entity.pool1 != pool1) {
    log.info("Found new pool1 contract: {}", [pool1.toHexString()]);
    entity.pool1 = pool1;
    Pool1.create(pool1);
  }
  entity.save();
}

export function handleDelegateCallBack(call: DelegateCallBackCall): void {
  let nx = NXMaster.bind(call.to);
  let pd = PoolData.bind(getLatestAddress(nx, "5044")) // PD
  let cd = ClaimsDataInstance.bind(getLatestAddress(nx, "4344")) // CD

  if (pd.getApiIdTypeOf(call.inputs.myid).toString() == "CLA") {
    let claimId = pd.getIdOfApiId(call.inputs.myid);
    log.info("Updating claim id {}", [claimId.toString()]);
    let claim = Claim.load(claimId.toString());
    let statusId = cd.getClaimStatusNumber(claimId).value1.toI32();
    let status = "CAVote";
    if (statusId >= 1 && statusId <= 5) {
      status = "MemberVote";
    } else if (statusId > 5) {
      status = "Closed";
      claim.verdict = statusId == 6 ? "Denied" : "Accepted";
    }
    if (status != claim.status) {
      claim.statusUpdateDate = call.block.timestamp;
      claim.status = status;
      claim.save();
    }
  }
}