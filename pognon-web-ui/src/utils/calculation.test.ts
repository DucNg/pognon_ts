import { calcDebt } from "./calculation"

test('test calcOwe', () => {
    let participants = [
        {IDPerson: 1, Name: "mario", Debt: 100},
        {IDPerson: 2, Name: "luigi", Debt: -50},
        {IDPerson: 3, Name: "peach", Debt: -50}
    ]

    let transactions = [{
        IDTransaction: 1,
        Buyers: [
            {IDPerson: 2, Amount: 50, Rest: false},
            {IDPerson: 3, Amount: 50, Rest: false},
        ],
        For: [
            {IDPerson: 1, Amount: 0, Rest: true}
        ],
        Reason: ""
    }]

    let expectedResult = [
        {IDPerson: 1, Name: "mario", Debt: 100, Owe:
        [
            {amount: 50, toWho: "peach"},
            {amount: 50, toWho: "luigi"}
        ]
        },
        {IDPerson: 2, Name: "luigi", Debt: -50},
        {IDPerson: 3, Name: "peach", Debt: -50}
    ]

    calcDebt(participants, transactions);
    expect(participants).toEqual(expectedResult);

    participants = [
        {IDPerson: 1, Name: "dk", Debt: 200},
        {IDPerson: 2, Name: "mario", Debt: 100},
        {IDPerson: 3, Name: "toad", Debt: 58.75},
        {IDPerson: 4, Name: "peach", Debt: -26.35},
        {IDPerson: 5, Name: "luigi", Debt: -32.40},
        {IDPerson: 6, Name: "bowser", Debt: -300}
    ]

    transactions = [
        {
            IDTransaction: 2,
            Buyers: [{IDPerson: 6, Amount: 300, Rest: false}],
            For: [
                {IDPerson: 1, Amount: 200, Rest: false},
                {IDPerson: 2, Amount: 100, Rest:  false}
            ],
            Reason: ""
        },
        {
            IDTransaction: 3,
            Buyers: [
                {IDPerson: 5, Amount: 32.40, Rest: false},
                {IDPerson: 4, Amount: 26.35, Rest: false}
            ],
            For: [{IDPerson: 3, Amount: 0, Rest: true}],
            Reason: ""
        }
    ]

    expectedResult = [
        {IDPerson: 1, Name: "dk", Debt: 200, Owe:
            [{amount: 200, toWho: "bowser"}]
        },
        {IDPerson: 2, Name: "mario", Debt: 100, Owe:
            [{amount: 100, toWho: "bowser"}]
        },
        {IDPerson: 3, Name: "toad", Debt: 58.75, Owe:[
            {amount: 32.40, toWho: "luigi"},
            {amount: 26.35, toWho: "peach"}
        ]},
        {IDPerson: 4, Name: "peach", Debt: -26.35},
        {IDPerson: 5, Name: "luigi", Debt: -32.40},
        {IDPerson: 6, Name: "bowser", Debt: -300}
    ]

    calcDebt(participants, transactions);
    expect(participants).toEqual(expectedResult);
});
