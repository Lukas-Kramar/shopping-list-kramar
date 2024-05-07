export const mockData = [
    {
        listId: "abcdf", ownerId: "123", membersIds: ["234", "345"],
        listName: "První shopping list",
        productsInList: [
            { productName: "Mléko", accomplished: false },
            { productName: "Mouka", accomplished: false },
            { productName: "Pažitka", accomplished: true },
            { productName: "Mléko1", accomplished: true },
            { productName: "Mouka2", accomplished: false },
            { productName: "Pažitka3", accomplished: true },
            { productName: "Mléko4", accomplished: true },
            { productName: "Mouka5", accomplished: false },
            { productName: "Pažitka6", accomplished: true },
        ],
        archived: false,
    },
    {
        listId: "fjowefjweoifj", ownerId: "234", membersIds: ["123", "345", "456"],
        listName: "Shopping list pro všechny",
        productsInList: [
            { productName: "Jablka", accomplished: false },
            { productName: "Citróny", accomplished: true },
            { productName: "Okurka", accomplished: true },
            { productName: "Máslo", accomplished: false }
        ],
        archived: false,
    },
    {
        listId: "aaaaaaaaa", ownerId: "234", membersIds: ["123", "345", "456"],
        listName: "LIst domácí",
        productsInList: [
            { productName: "Jablka", accomplished: true },
            { productName: "Citróny", accomplished: true },
            { productName: "Okurka", accomplished: true },
            { productName: "Máslo", accomplished: true }
        ],
        archived: true,
    }
]
