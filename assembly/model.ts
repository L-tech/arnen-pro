import { PersistentUnorderedMap, u128, context } from "near-sdk-as";

@nearBindgen
export class Charity {
    id: string;
    name: string;
    purpose: string;
    image: string;
    location: string;
    goal: u128;
    raised: u128;
    donors: Array<string>;
    donations: u32;
    owner: string;
    highest: u128;
    completed: boolean;
    public static fromPayload(payload: Charity): Charity {
        const charity = new Charity();
        charity.id = payload.id;
        charity.name = payload.name;
        charity.purpose = payload.purpose;
        charity.image = payload.image;
        charity.location = payload.location;
        charity.goal = payload.goal;
        charity.owner = context.sender;
        charity.completed = false;
        charity.raised = u128.Zero;
        charity.highest = u128.Zero;
        charity.donors = [];
        return charity;
    }
    public increaseDonation(amount: u128): void {
        this.donations = this.donations + 1;
        this.raised = u128.add(this.raised, amount);
        if(this.raised >= this.goal) {
            this.completed = true;
        }
    }
}

export const listedCharities = new PersistentUnorderedMap<string, Charity>("LISTED_CHARITIES");