export interface Person {
    IDPerson: number
    Name: string
    Debt: number
}

export interface Purchase {
	IDPerson: number;
	Amount: number;
}

// Transaction is a money transaction for a Pognon
export interface Transaction {
	IDTransaction?: number;
	Pognon?:        Pognon;
	Buyers:        Purchase[]; // The ones who payed and how much
	For:           Purchase[]; // The ones who used the money and how much
	Reason:        string;     // What was payed

	CreatedAt?: Date;
	UpdatedAt?: Date;
}

// Pognon is a list of transactions and participants
export interface Pognon {
	IDPognon:     number;
	PognonHash:   string;
}

// PognonJSON is a structured response to a pongon request
export interface PognonJSON {
    Pognon:       Pognon;
    Participants: Person[];
	Transactions: Transaction[];
}

export interface column {
    id: string;
    label: string;
}

export const columns: column[] = [
    {
        id: "buyers",
        label: "Buyers"
    },
    {
        id: "totalAmount",
        label: "Total amount"
    },
    {
        id: "for",
        label: "For"
    },
    {
        id: "reason",
        label: "Reason"
    },
    {
        id: "date",
        label: "Date"
    }
];