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
import { beforeEach, describe } from "vitest";

// External dependancy mock setup
vi.mock("axios");
vi.mock("./src/supabaseClient.js", () => ({
  supabase: {
    auth: {
      getSession: vi.fn(),
    },
  },
}));

// Validation tests
describe("validateField", () => {
  describe("when value is invalid", () => {
    it("should throw an error when value is null", () => {
      expect(() => validateField(null, "income")).toThrow(
        "Enter a number for your income",
      );
    });
    it("should throw an error when value is less than zero", () => {
      expect(() => validateField(-0.99999, "income")).toThrow(
        "income amount must be more or equal to 0",
      );
    });
    it("should throw an error when value is more than 99999999.99", () => {
      expect(() => validateField(99999999.999, "income")).toThrow(
        "Please enter an accurate amount, the figure is too high",
      );
    });
  });

  describe("when value is valid", () => {
    it("should not throw an error when value within bounds", () => {
      expect(() => validateField(100.5, "income")).not.toThrow();
    });
    it("should not throw an error when value is 0", () => {
      expect(() => validateField(0, "income")).not.toThrow();
    });
    (it("should not throw an error when at maximum boundary"),
      () => {
        expect(() => validateField(99999999.99, "income")).not.toThrow();
      });
  });
});

// getBudgetData tests
describe("getBudgetData", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    // Setup default auth mock called in getAuthHeaders
    supabase.auth.getSession.mockResolvedValue({
      data: {
        session: {
          access_token: "mock-token-123",
        },
      },
    });
  });

  it("should return budget data on successful API call", async () => {
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

  it("should throw an error when API call fails", async () => {
    // Arrange: Setup mock to reject
    axios.get.mockRejectedValue(new Error("Network error"));

    // Act & Assert: Call should throw error
    await expect(getBudgetData()).rejects.toThrow(
      "There was an error getting your stored budget figures",
    );
  });
});

// updateIncome tests
describe("updateIncome", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Setup default auth mock called in getAuthHeaders
    supabase.auth.getSession.mockResolvedValue({
      data: {
        session: {
          access_token: "mock-token-123",
        },
      },
    });
  });

  describe("successful updates", () => {
    it("should update budget data on successful API call", async () => {
      // Arrange: Setup mock response and income data to be sent
      const income = { wage: 3000, otherIncome: 99.5 };
      const mockResponseData = [{ success: true, id: 123 }];
      axios.post.mockResolvedValue({ data: mockResponseData });

      // Act: Call the function
      const result = await updateIncome(income);

      // Assert: Check results
      expect(result).toEqual(mockResponseData);
      expect(axios.post).toHaveBeenCalledWith(
        expect.stringContaining("/api/income"),
        { income },
        {
          headers: {
            Authorization: "Bearer mock-token-123",
          },
        },
      );
    });

    it("should handle income with zero values", async () => {
      // Arrange: Setup mock response and income data to be sent
      const income = { wage: "0", otherIncome: 0 };
      const mockResponseData = [{ success: true }];
      axios.post.mockResolvedValue({ data: mockResponseData });

      // Act: Call the function
      const result = await updateIncome(income);

      // Assert: Call should be successful
      expect(result).toEqual(mockResponseData);
    });
  });

  describe("API errors", () => {
    (it("should throw an error when the API call fails"),
      // Arrange: Setup data and mock rejection
      async () => {
        const income = { wage: 1120, otherIncome: 50 };
        axios.post.mockRejectedValue(new Error("Network error"));

        // Act & Assert: Call the function and set expected resonse
        await expect(updateIncome(income)).rejects.toThrow(
          "There was an error saving your income",
        );
      });
  });
});
