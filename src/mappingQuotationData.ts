import { Cover } from "../generated/schema"
import{ isLatestNexusContract, getUser, getLatestAddress, getInsuredContract } from "./helpers";
import { CoverDetailsEvent } from "../generated/templates/QuotationData/QuotationData";
import { QuotationData } from "../generated/templates/QuotationData/QuotationData";

export function handleCoverDetailsEvent(event: CoverDetailsEvent): void {
  if(isLatestNexusContract("quotationData", event.address)) {
    let qd = QuotationData.bind(event.address);
    let userId = qd.getCoverMemberAddress(event.params.cid);
    let user = getUser(userId);

    let id = event.params.cid.toString()
    let entity = Cover.load(id);
    if (entity == null) {
      user.coverCount += 1;
      user.save();

      entity = new Cover(id);
      entity.contract = getInsuredContract(event.params.scAdd).id;
      entity.user = user.id;
      entity.amount = event.params.sumAssured;
      entity.daysToCover = qd.getCoverPeriod(event.params.cid);
      entity.premium = event.params.premium;
      entity.premiumNXM = event.params.premiumNXM;
      entity.created =  event.block.timestamp;
      entity.expires = event.params.expiry;
      entity.save();
    }
  }
}