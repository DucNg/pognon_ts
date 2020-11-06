import { Person, Transaction } from './data'

export function calcDebt(participants: Person[], transactions: Transaction[]): Person[] {
    // Initialize debt
    participants.forEach(participant => participant.Debt = 0);

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

        // Calculate positive debt (sum of received amount)
        transaction.For.forEach(forWho => {
            const matchedParticipant = participants.findIndex(participant => 
                participant.IDPerson === forWho.IDPerson);
            if (matchedParticipant !== -1) {
                (participants[matchedParticipant].Debt as number) += forWho.Amount;
            } else {
                throw new Error("No corresponding participant")
            }
        });
    });
    return participants;
}