import { Cover } from "../generated/schema"
import{ isLatestNexusContract, getUser, getInsuredContract } from "./helpers";
import { CoverDetailsEvent, CoverStatusEvent } from "../generated/templates/QuotationData/QuotationData";
import { QuotationData } from "../generated/templates/QuotationData/QuotationData";

// Taken from QuotationData.Sol
function statusNoToString(statusNo: i32): string {
  switch (statusNo) {
    case 0: return "Active";
    case 1: return "ClaimAccepted";
    case 2: return "ClaimDenied";
    case 3: return "CoverExpired";
    case 4: return "ClaimSubmitted";
    case 5: return "Requested";
  }
  throw new Error("Unexpected statusNo: " + statusNo.toString());
}

export function handleCoverDetailsEvent(event: CoverDetailsEvent): void {
  if(isLatestNexusContract("quotationData", event.address)) {
    let qd = QuotationData.bind(event.address);

    let user = getUser(qd.getCoverMemberAddress(event.params.cid));
    user.coverCount += 1;
    user.save();

    let id = event.params.cid.toString()
    let entity = new Cover(id);
    entity.contract = getInsuredContract(event.params.scAdd).id;
    entity.user = user.id;
    entity.amount = event.params.sumAssured;
    entity.daysToCover = qd.getCoverPeriod(event.params.cid);
    entity.premium = event.params.premium;
    entity.premiumNXM = event.params.premiumNXM;
    entity.created =  event.block.timestamp;
    entity.expires = event.params.expiry;
    entity.status = statusNoToString(qd.getCoverStatusNo(event.params.cid));
    entity.save();
  }
}

export function handleCoverStatusEvent(event: CoverStatusEvent): void {
  if(isLatestNexusContract("quotationData", event.address)) {
    let entity = Cover.load(event.params.cid.toString());
    entity.status = statusNoToString(event.params.statusNum);
    entity.save();
  }
}