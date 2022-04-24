import { Charity, listedCharities } from './model';
import { ContractPromiseBatch, context } from 'near-sdk-as';

export function setCharity(charity: Charity): void {
    let storedCharity = listedCharities.get(charity.id);
    if (storedCharity !== null) {
        throw new Error(`a charity with ${charity.id} already exists`);
    }
    listedCharities.set(charity.id, Charity.fromPayload(charity));
}

// get a single charity by id
export function getCharity(id: string): Charity | null {
    return listedCharities.get(id);
}

// get all charity projects
export function getCharities(): Charity[] {
    return listedCharities.values();
}

// donate to a charity project
export function donateToCharity(charityId: string): void {
    const charity = getCharity(charityId);
    if (charity == null) {
        throw new Error("charity not found");
    }
    
    if (context.attachedDeposit.toString() == "0") {
        throw new Error("attached deposit should be greater than 0");
    }

    ContractPromiseBatch.create(charity.owner).transfer(context.attachedDeposit);

    if(!charity.donors.includes(context.sender)) {
        charity.donors.push(context.sender);
    }
    if(context.attachedDeposit.toString() > charity.highest.toString()) { 
        charity.highest = context.attachedDeposit;
    }
    charity.increaseDonation(context.attachedDeposit);
    listedCharities.set(charity.id, charity);
}