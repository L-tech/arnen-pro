import { v4 as uuid4 } from "uuid";
import { parseNearAmount } from "near-api-js/lib/utils/format";

const GAS = 100000000000000;

export function createCharity(charity) {
  charity.id = uuid4();
  charity.price = parseNearAmount(charity.price + "");
  return window.contract.setCharity({ charity });
}

export function getCharities() {
  return window.contract.getCharities();
}

export async function donateToCharity({ id, donation }) {
  parseNearAmount(donation + "");
  await window.contract.donateToCharity({ charityId: id }, GAS, donation);
}

export function getOngoingCharitiesCount() {
  return window.contract.getOngoingCharityCount();
}

export function donateToAllProjects({ amount }) {
  console.log("value passed", amount.toString());
  const figure = amount + "000000000000000000000000";
  parseNearAmount(figure + "");
  return window.contract.donateToAll({ charityId: figure }, GAS, figure);
}

export function deleteCharity({ id }) {
  return window.contract.deleteCharity({ charityId: id }, GAS);
}
