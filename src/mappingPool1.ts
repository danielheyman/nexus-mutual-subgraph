import { MakeCoverBeginCall } from "../generated/templates/Pool1/Pool1"
import { Cover, NexusContracts } from "../generated/schema"
import { isLatestNexusContract, getInsuredContract, getUser, getLatestAddress } from "./helpers";
import { BigInt, Address } from "@graphprotocol/graph-ts";
import { ContractRegister } from "../generated/ContractRegister/ContractRegister";
import { QuotationData } from "../generated/templates/QuotationData/QuotationData";

export function handleNewCover(call: MakeCoverBeginCall): void {
  if (isLatestNexusContract("pool1", call.to)) {
    let user = getUser(call.from);
    let register = ContractRegister.bind(NexusContracts.load("1").contractRegister as Address);
    let qdAddress = getLatestAddress(register, "5144") // QD
    let qd = QuotationData.bind(qdAddress);
    let id = qd.getAllCoversOfUser(call.from)[user.coverCount].toString();

    let entity = Cover.load(id);
    if (entity == null) {
      user.coverCount += 1;
      user.save();

      entity = new Cover(id);
      entity.contract = getInsuredContract(call.inputs.smartCAdd).id;
      entity.user = user.id;
      entity.amount = call.inputs.coverDetails.shift();
      entity.daysToCover = call.inputs.coverPeriod;
      entity.created =  call.block.timestamp;
      entity.expires = call.block.timestamp.plus(BigInt.fromI32(entity.daysToCover * 24 * 60 * 60));
      entity.save();
    }
  }
}
