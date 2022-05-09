import { Charity, listedCharities } from './model';
import { ContractPromiseBatch, context, u128 } from 'near-sdk-as';
// import { compareImpl } from 'assemblyscript/std/assembly/util/string';

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

// donate 1 Near to all charity projects
export function donateToAll(): void {
    const charities = getCharities().filter(charity => !charity.completed);
    const total = (1000000000000000000000000 * charities.length).toString();
    if(context.attachedDeposit < u128.fromString(total)) {
        throw new Error("attached deposit should be greater than " + total);
    }
    charities.forEach(charity => {

        ContractPromiseBatch.create(charity.owner).transfer(u128.fromString("1000000000000000000000000"));

        if(!charity.donors.includes(context.sender)) {
            charity.donors.push(context.sender);
        }
        if("1000000000000000000000000" > charity.highest.toString()) { 
            charity.highest = u128.fromString("1000000000000000000000000")
        }
        charity.increaseDonation(u128.fromString("1000000000000000000000000"));
        listedCharities.set(charity.id, charity);
    });

}

// transfer the ownership of a charity project to a new owner
export function transferCharityOwnership(charityId: string, newOwner: string): void {
    const charity = getCharity(charityId);
    if (charity == null) {
        throw new Error("charity not found");
    }
    if(charity.owner != context.sender) {
        throw new Error("you are not the owner of this charity project");
    }
    charity.owner = newOwner;
    listedCharities.set(charity.id, charity);
}

// get all uncompleted charity projects

export function getUncompletedCharities(): Charity[] {
    const charities = getCharities().filter(charity => !charity.completed);
    return charities;
}


// delete a charity
export function deleteCharity(charityId: string): void {
    const charity = getCharity(charityId);
    if (charity == null) {
        throw new Error("charity not found");
    }
    if(charity.owner != context.sender) {
        throw new Error("you are not the owner of this charity project");
    }
    listedCharities.delete(charity.id);
}



