export const incomeSchema = {
  body: {
    type: "object",
    required: ["income"],
    properties: {
      income: {
        type: "object",
        properties: {
          wage: { type: "number", minimum: 0, maximum: 99999999.99 },
          otherIncome: { type: "number", minimum: 0, maximum: 99999999.99 },
        },
      },
    },
  },
};

export const homeExpenseSchema = {
  body: {
    type: "object",
    required: ["homeExpense"],
    properties: {
      homeExpense: {
        type: "object",
        properties: {
          mortgage: { type: "number", minimum: 0, maximum: 99999999.99 },
          councilTax: { type: "number", minimum: 0, maximum: 99999999.99 },
          homeInsurance: { type: "number", minimum: 0, maximum: 99999999.99 },
        },
      },
    },
  },
};

export const utilitiesSchema = {
  body: {
    type: "object",
    required: ["utilities"],
    properties: {
      utilities: {
        type: "object",
        properties: {
          gas: { type: "number", minimum: 0, maximum: 99999999.99 },
          electricity: { type: "number", minimum: 0, maximum: 99999999.99 },
          water: { type: "number", minimum: 0, maximum: 99999999.99 },
        },
      },
    },
  },
};

export const servicesAndSubscriptionsSchema = {
  body: {
    type: "object",
    required: ["servicesAndSubscriptions"],
    properties: {
      servicesAndSubscriptions: {
        type: "object",
        properties: {
          phone: { type: "number", minimum: 0, maximum: 99999999.99 },
          broadband: { type: "number", minimum: 0, maximum: 99999999.99 },
          subscriptions: { type: "number", minimum: 0, maximum: 99999999.99 },
        },
      },
    },
  },
};

export const transportAndTravelSchema = {
  body: {
    type: "object",
    required: ["transportAndTravel"],
    properties: {
      transportAndTravel: {
        type: "object",
        properties: {
          vehicleInsurance: {
            type: "number",
            minimum: 0,
            maximum: 99999999.99,
          },
          roadTax: { type: "number", minimum: 0, maximum: 99999999.99 },
          fuel: { type: "number", minimum: 0, maximum: 99999999.99 },
          breakdownCover: { type: "number", minimum: 0, maximum: 99999999.99 },
          MOTAndServices: { type: "number", minimum: 0, maximum: 99999999.99 },
          railAndBus: { type: "number", minimum: 0, maximum: 99999999.99 },
        },
      },
    },
  },
};

export const personalSchema = {
  body: {
    type: "object",
    required: ["personal"],
    properties: {
      personal: {
        type: "object",
        properties: {
          clothingAndFootwear: {
            type: "number",
            minimum: 0,
            maximum: 99999999.99,
          },
          hairdressing: { type: "number", minimum: 0, maximum: 99999999.99 },
        },
      },
    },
  },
};

export const petsSchema = {
  body: {
    type: "object",
    required: ["pets"],
    properties: {
      pets: {
        type: "object",
        properties: {
          petFood: { type: "number", minimum: 0, maximum: 99999999.99 },
          insurance: { type: "number", minimum: 0, maximum: 99999999.99 },
        },
      },
    },
  },
};

export const foodAndShoppingSchema = {
  body: {
    type: "object",
    required: ["foodAndShopping"],
    properties: {
      foodAndShopping: {
        type: "object",
        properties: {
          supermarketShopping: {
            type: "number",
            minimum: 0,
            maximum: 99999999.99,
          },
          mealsOut: { type: "number", minimum: 0, maximum: 99999999.99 },
        },
      },
    },
  },
};

export const accountsAndSavingsSchema = {
  body: {
    type: "object",
    required: ["accountsAndSavings"],
    properties: {
      accountsAndSavings: {
        type: "object",
        properties: {
          accountFees: { type: "number", minimum: 0, maximum: 99999999.99 },
          savings: { type: "number", minimum: 0, maximum: 99999999.99 },
        },
      },
    },
  },
};
