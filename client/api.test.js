import {
  validateField,
  getBudgetData,
  updateIncome,
  updateHomeExpense,
  updateUtilities,
  updateServicesAndSubscriptions,
  updateTransportAndTravel,
  updatePersonal,
  updatePets,
  updateFoodAndShopping,
  updateAccountsAndSavings,
} from "./api";
import axios from "axios";
import { supabase } from "./src/supabaseClient";

// External dependancy mock setup
vi.mock("axios");
vi.mock("./src/supabaseClient.js", () => ({
  supabase: {
    auth: {
      getSession: vi.fn(),
    },
  },
}));

describe("validateField - Null values", () => {
  it("Should throw an error when the value is null", () => {
    expect(() => validateField(null, "income")).toThrow(
      "Enter a number for your income",
    );
  });
});

describe("validateField - Negative values", () => {
  it("Should throw an error when the value is less than zero", () => {
    expect(() => validateField(-0.99999, "income")).toThrow(
      "income amount must be more or equal to 0",
    );
  });
});

describe("validateField - Max values", () => {
  it("Should throw an error when the value is more than 99999999.99", () => {
    expect(() => validateField(99999999.999, "income")).toThrow(
      "Please enter an accurate amount, the figure is too high",
    );
  });
});

describe("validateField - Valid values", () => {
  it("Should not throw an error when the value within bounds", () => {
    expect(() => validateField(100.5, "income")).not.toThrow();
  });
  it("Should not throw an error when the value is 0", () => {
    expect(() => validateField(0, "income")).not.toThrow();
  });
});

describe("getBudgetData", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // Setup default auth mock called in getAuthHeaders
  supabase.auth.getSession.mockResolvedValue({
    data: {
      session: {
        access_token: "mock-token-123",
      },
    },
  });

  it("Should return budget data on successful API call", async () => {
    // Arrange: Setup mock response
    const mockBudgetData = {
      income: { wage: 3000, otherIncome: 99.5 },
      homeExpense: {
        mortgage: 1290.75,
        councilTax: 99.7,
        homeInsurance: 29.99,
      },
      utilities: { gas: 80.0, electricity: 120, water: 30.99 },
    };
    axios.get.mockResolvedValue({ data: mockBudgetData });

    // Act: Call the function
    const result = await getBudgetData();

    // Assert: Check results
    expect(result).toEqual(mockBudgetData);
    expect(axios.get).toHaveBeenCalledWith(
      expect.stringContaining("/api/budget"),
      {
        headers: {
          Authorization: "Bearer mock-token-123",
        },
      },
    );
    expect(axios.get).toHaveBeenCalledTimes(1);
  });

  it("Should throw an error when API call fails", async () => {
    // Arrange: Setup mock to reject
    axios.get.mockRejectedValue(new Error("Network error"));

    // Act & Assert: Call should throw error
    await expect(getBudgetData()).rejects.toThrow(
      "There was an error getting your stored budget figures",
    );
  });
});
