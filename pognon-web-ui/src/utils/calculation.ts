import { owe, Person, Transaction } from './data';


// Calculate debt for each participants
export function calcDebt(participants: Person[], transactions: Transaction[]): Person[] {
    // Initialize debt
    participants.forEach(participant => participant.Debt = 0);

    if (transactions === null) {
        return participants;
    }

    transactions.forEach(transaction => {
        // Calculate negative debt (sum of payed amount)
        transaction.Buyers.forEach(buyer => {
            const matchedParticipant = participants.findIndex(participant => 
                participant.IDPerson === buyer.IDPerson);
            if (matchedParticipant !== -1) {
                (participants[matchedParticipant].Debt as number) -= buyer.Amount;
            } else {
                throw new Error("No corresponding participant");
            }
        });

        // We need to split the rest between all persons who received it.
        // We save the index of person who needs to receive the rest
        // to calculate shares later.
        const receiveRest: number[] = [];

        // We need the total payed amount in order to calculate
        // equal parts share later
        let rest = transaction.Buyers.reduce((prevValue, buyer) => 
            prevValue + buyer.Amount, 0);

        // Calculate positive debt (sum of received amount)
        transaction.For.forEach(forWho => {
            const matchedParticipant = participants.findIndex(participant => 
                participant.IDPerson === forWho.IDPerson);
            if (matchedParticipant !== -1) {
                if (forWho.Rest) {
                    // Save for later
                    receiveRest.push(matchedParticipant);
                    // console.log("hello",matchedParticipant)
                } else {
                    (participants[matchedParticipant].Debt as number) += forWho.Amount;
                    rest -= forWho.Amount;
                }
            } else {
                throw new Error("No corresponding participant");
            }
        });

        // Now we calculate debts for persons who payed the rest
        // Each one receive an equal part of the rest
        if (receiveRest.length !== 0) {
            const equalPartRest = rest / receiveRest.length
            receiveRest.forEach(personIndex => {
                (participants[personIndex].Debt as number) += equalPartRest;
            })
        }
    });

    // Make persons with the biggest debt first
    participants.sort((personA, personB) => (personB.Debt as number) - (personA.Debt as number));

    // Return a new object
    return [...participants];
}

// Calculate who needs to give money to who
export function calcOwe(participants: Person[]): owe[] {
    if (!participants[0].Debt) {
        throw new Error("Calculate debt first");
    }
    
    const owe: owe[] = [];

    // Participants should already be sorted by debt
    // We want the ones with biggest debts to refund the one with the smallest one
    participants.forEach(participantPosDebt => {
        if (participantPosDebt.Debt as number > 0) {
            let debtToBalance = participantPosDebt.Debt as number;
            
            // Give the money to a person who has a negative debt, starting from the end
            participants.slice().reverse().forEach(participantNegDebt => {
                if (debtToBalance === 0) return

                if (participantNegDebt.Debt as number < 0){
                
                    if (participantNegDebt.Debt as number + debtToBalance > 0) {
                        // Cannot give all the money at once
                        // Give the maximum amount and save the rest
                        // for another person
                        owe.push({
                            who: participantPosDebt.Name,
                            amount: Math.abs(participantNegDebt.Debt as number),
                            toWho: participantNegDebt.Name
                        })

                        debtToBalance = (debtToBalance + (participantNegDebt.Debt as number));
                        participantPosDebt.Debt = debtToBalance;
                        participantNegDebt.Debt = 0;
                    }
                
                    else {
                        // Give all the money at once
                        owe.push({
                            who: participantPosDebt.Name,
                            amount: debtToBalance,
                            toWho: participantNegDebt.Name
                        })

                        participantPosDebt.Debt = 0;
                        participantNegDebt.Debt = (participantNegDebt.Debt as number) + debtToBalance;
                        debtToBalance = 0;
                    }
                
                }

            })
        }
    })

    return owe;
}
