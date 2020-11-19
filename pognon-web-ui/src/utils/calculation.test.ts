import { calcOwe } from "./calculation"

test('test calcOwe', () => {
    let participants = [
        {Name: "mario", Debt: 100},
        {Name: "luigi", Debt: -50},
        {Name: "peach", Debt: -50}
    ]

    let expectedResult = [
    {who: "mario", amount: 50, toWho: "peach"},
    {who: "mario", amount: 50, toWho: "luigi"}
    ]

    let owe = calcOwe(participants);
    console.log(owe);
    expect(owe).toEqual(expectedResult);

    participants = [
        {Name: "dk", Debt: 200},
        {Name: "mario", Debt: 100},
        {Name: "toad", Debt: 58.75},
        {Name: "peach", Debt: -26.35},
        {Name: "luigi", Debt: -32.40},
        {Name: "bowser", Debt: -300}
    ]

    expectedResult = [
       {who: "dk", amount: 200, toWho: "bowser"},
       {who: "mario", amount: 100, toWho: "bowser"},
       {who: "toad", amount: 32.40, toWho: "luigi"},
       {who: "toad", amount: 26.35, toWho: "peach"}
    ]

    owe = calcOwe(participants);
    console.log(owe);
    expect(owe).toEqual(expectedResult);
});
