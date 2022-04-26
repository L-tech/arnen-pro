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
  let pasedDonation= parseNearAmount(donation + "");
  await window.contract.donateToCharity({ charityId: id }, GAS, parsedDonation);
}