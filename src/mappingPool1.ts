import { MakeCoverBeginCall } from "../generated/templates/Pool1/Pool1"
import { Cover } from "../generated/schema"
import { isLatestNexusContract, getInsuredContract, getUser } from "./helpers";
import { BigInt } from "@graphprotocol/graph-ts";

export function handleNewCover(call: MakeCoverBeginCall): void {
  if (isLatestNexusContract("pool1", call.to)) {
    let user = getUser(call.from);
    let id = call.from.toHexString() + "-" + BigInt.fromI32(user.coverCount).toString();

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
