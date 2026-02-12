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
import { beforeEach, describe, expect } from "vitest";

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
    it("should update income data on successful API call", async () => {
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

  describe("validation integration", () => {
    it("should validate wage before API call", async () => {
      // Arrange: Setup mock data
      const income = { wage: -100, otherIncome: 0 };
      // Act & Assert: Call the function and check API was not called due to validation
      await expect(updateIncome(income)).rejects.toThrow(
        "Wage amount must be more or equal to 0",
      );
      expect(axios.post).not.toHaveBeenCalled();
    });
  });

  describe("API errors", () => {
    it("should throw an error when the API call fails", async () => {
      // Arrange: Setup data and mock rejection
      const income = { wage: 1120, otherIncome: 50 };
      axios.post.mockRejectedValue(new Error("Network error"));

      // Act & Assert: Call the function and set expected resonse
      await expect(updateIncome(income)).rejects.toThrow(
        "There was an error saving your income",
      );
    });
  });
});

// updateHomeExpense tests
describe("updateHomeExpense", () => {
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
    it("should update home expense data on successful API call", async () => {
      // Arrange: Setup mock response and data to be sent
      const homeExpense = {
        mortgage: 1230,
        councilTax: 115.57,
        homeInsurance: 19.99,
      };
      const mockResponseData = [{ success: true, id: 123 }];
      axios.post.mockResolvedValue({ data: mockResponseData });

      // Act: Call the function
      const result = await updateHomeExpense(homeExpense);

      // Assert: Check results
      expect(result).toEqual(mockResponseData);
      expect(axios.post).toHaveBeenCalledWith(
        expect.stringContaining("/api/home_expense"),
        { homeExpense },
        {
          headers: {
            Authorization: "Bearer mock-token-123",
          },
        },
      );
    });

    it("should handle home expense with zero values", async () => {
      // Arrange: Setup mock response and data to be sent
      const homeExpense = {
        mortgage: 1230,
        councilTax: 115.57,
        homeInsurance: 0,
      };
      const mockResponseData = [{ success: true }];
      axios.post.mockResolvedValue({ data: mockResponseData });

      // Act: Call the function
      const result = await updateHomeExpense(homeExpense);

      // Assert: Call should be successful
      expect(result).toEqual(mockResponseData);
    });
  });

  describe("validation integration", () => {
    it("should validate council tax before API call", async () => {
      // Arrange: Setup mock data
      const homeExpense = {
        mortgage: 1230,
        councilTax: -1000,
        homeInsurance: 19.99,
      };
      // Act & Assert: Call the function and check API was not called due to validation
      await expect(updateHomeExpense(homeExpense)).rejects.toThrow(
        "Council Tax amount must be more or equal to 0",
      );
      expect(axios.post).not.toHaveBeenCalled();
    });
  });

  describe("API errors", () => {
    it("should throw an error when the API call fails", async () => {
      // Arrange: Setup data and mock rejection
      const homeExpense = {
        mortgage: 1230,
        councilTax: 115.57,
        homeInsurance: 19.99,
      };
      axios.post.mockRejectedValue(new Error("Network error"));

      // Act & Assert: Call the function and set expected resonse
      await expect(updateHomeExpense(homeExpense)).rejects.toThrow(
        "There was an error saving your home expense",
      );
    });
  });
});

// updateUtilities tests
describe("updateUtilities", () => {
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
    it("should update utilities data on successful API call", async () => {
      // Arrange: Setup mock response data to be sent
      const utilities = {
        gas: 80,
        electricity: 125.45,
        water: 49.99,
      };
      const mockResponseData = [{ success: true, id: 123 }];
      axios.post.mockResolvedValue({ data: mockResponseData });

      // Act: Call the function
      const result = await updateUtilities(utilities);

      // Assert: Check results
      expect(result).toEqual(mockResponseData);
      expect(axios.post).toHaveBeenCalledWith(
        expect.stringContaining("/api/utilities"),
        { utilities },
        {
          headers: {
            Authorization: "Bearer mock-token-123",
          },
        },
      );
    });

    it("should handle utilities with zero values", async () => {
      // Arrange: Setup mock response data to be sent
      const utilities = {
        gas: 80,
        electricity: 125.45,
        water: 49.99,
      };
      const mockResponseData = [{ success: true }];
      axios.post.mockResolvedValue({ data: mockResponseData });

      // Act: Call the function
      const result = await updateUtilities(utilities);

      // Assert: Call should be successful
      expect(result).toEqual(mockResponseData);
    });
  });

  describe("validation integration", () => {
    it("should validate water before API call", async () => {
      // Arrange: Setup mock data
      const utilities = {
        gas: 80,
        electricity: 125.45,
        water: "Water",
      };
      // Act & Assert: Call the function and check API was not called due to validation
      await expect(updateUtilities(utilities)).rejects.toThrow(
        "Enter a number for your Water",
      );
      expect(axios.post).not.toHaveBeenCalled();
    });
  });

  describe("API errors", () => {
    it("should throw an error when the API call fails", async () => {
      // Arrange: Setup data and mock rejection
      const utilities = {
        gas: 80,
        electricity: 125.45,
        water: 49.99,
      };
      axios.post.mockRejectedValue(new Error("Network error"));

      // Act & Assert: Call the function and set expected resonse
      await expect(updateUtilities(utilities)).rejects.toThrow(
        "There was an error saving your utilities",
      );
    });
  });
});

// updateServicesAndSubscriptions tests
describe("updateServicesAndSubscriptions", () => {
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
    it("should update services and subscriptions data on successful API call", async () => {
      // Arrange: Setup mock response and services and subscriptions data to be sent
      const servicesAndSubscriptions = {
        phone: 35,
        broadband: 37.82,
        subscriptions: 9.99,
      };
      const mockResponseData = [{ success: true, id: 123 }];
      axios.post.mockResolvedValue({ data: mockResponseData });

      // Act: Call the function
      const result = await updateServicesAndSubscriptions(
        servicesAndSubscriptions,
      );

      // Assert: Check results
      expect(result).toEqual(mockResponseData);
      expect(axios.post).toHaveBeenCalledWith(
        expect.stringContaining("/api/servicesandsubscriptions"),
        { servicesAndSubscriptions },
        {
          headers: {
            Authorization: "Bearer mock-token-123",
          },
        },
      );
    });

    it("should handle services and subscriptions with zero values", async () => {
      // Arrange: Setup mock response and data to be sent
      const utilities = {
        gas: 0,
        electricity: 185.45,
        water: 49.99,
      };
      const mockResponseData = [{ success: true }];
      axios.post.mockResolvedValue({ data: mockResponseData });

      // Act: Call the function
      const result = await updateUtilities(utilities);

      // Assert: Call should be successful
      expect(result).toEqual(mockResponseData);
    });
  });

  describe("validation integration", () => {
    it("should validate water before API call", async () => {
      // Arrange: Setup mock data
      const utilities = {
        gas: 80,
        electricity: 125.45,
        water: "Water",
      };
      // Act & Assert: Call the function and check API was not called due to validation
      await expect(updateUtilities(utilities)).rejects.toThrow(
        "Enter a number for your Water",
      );
      expect(axios.post).not.toHaveBeenCalled();
    });
  });

  describe("API errors", () => {
    it("should throw an error when the API call fails", async () => {
      // Arrange: Setup data and mock rejection
      const servicesAndSubscriptions = {
        phone: 35,
        broadband: 37.82,
        subscriptions: 9.99,
      };
      axios.post.mockRejectedValue(new Error("Network error"));

      // Act & Assert: Call the function and set expected resonse
      await expect(
        updateServicesAndSubscriptions(servicesAndSubscriptions),
      ).rejects.toThrow(
        "There was an error saving your services and subscriptions",
      );
    });
  });
});

// updateTransportAndTravel tests
describe("updateTransportAndTravel", () => {
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
    it("should update transport and travel data on successful API call", async () => {
      // Arrange: Setup mock response and services and subscriptions data to be sent
      const transportAndTravel = {
        vehicleInsurance: 35,
        roadTax: 37.82,
        fuel: 9.99,
        breakdownCover: 9.99,
        MOTAndServices: 9.99,
        railAndBus: 9.99,
      };
      const mockResponseData = [{ success: true, id: 123 }];
      axios.post.mockResolvedValue({ data: mockResponseData });

      // Act: Call the function
      const result = await updateTransportAndTravel(transportAndTravel);

      // Assert: Check results
      expect(result).toEqual(mockResponseData);
      expect(axios.post).toHaveBeenCalledWith(
        expect.stringContaining("/api/transportandtravel"),
        { transportAndTravel },
        {
          headers: {
            Authorization: "Bearer mock-token-123",
          },
        },
      );
    });

    it("should handle services and subscriptions with zero values", async () => {
      // Arrange: Setup mock response and data to be sent
      const transportAndTravel = {
        vehicleInsurance: 0,
        roadTax: 0,
        fuel: 0,
        breakdownCover: 0,
        MOTAndServices: 0,
        railAndBus: 9.99,
      };
      const mockResponseData = [{ success: true }];
      axios.post.mockResolvedValue({ data: mockResponseData });

      // Act: Call the function
      const result = await updateTransportAndTravel(transportAndTravel);

      // Assert: Call should be successful
      expect(result).toEqual(mockResponseData);
    });
  });

  describe("validation integration", () => {
    it("should validate road tax before API call", async () => {
      // Arrange: Setup mock data
      const transportAndTravel = {
        vehicleInsurance: 35,
        roadTax: -37.82,
        fuel: 9.99,
        breakdownCover: 9.99,
        MOTAndServices: 9.99,
        railAndBus: 9.99,
      };
      // Act & Assert: Call the function and check API was not called due to validation
      await expect(
        updateTransportAndTravel(transportAndTravel),
      ).rejects.toThrow("Road Tax amount must be more or equal to 0");
      expect(axios.post).not.toHaveBeenCalled();
    });
  });

  describe("API errors", () => {
    it("should throw an error when the API call fails", async () => {
      // Arrange: Setup data and mock rejection
      const transportAndTravel = {
        vehicleInsurance: 35,
        roadTax: 37.82,
        fuel: 9.99,
        breakdownCover: 9.99,
        MOTAndServices: 9.99,
        railAndBus: 9.99,
      };
      axios.post.mockRejectedValue(new Error("Network error"));

      // Act & Assert: Call the function and set expected resonse
      await expect(
        updateTransportAndTravel(transportAndTravel),
      ).rejects.toThrow(
        "There was an error saving your transport and travel costs",
      );
    });
  });
});

// updatePersonal tests
describe("updatePersonal", () => {
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
    it("should update personal data on successful API call", async () => {
      // Arrange: Setup mock response and income data to be sent
      const personal = { clothingAndFootwear: 100, hairdressing: 23 };
      const mockResponseData = [{ success: true, id: 123 }];
      axios.post.mockResolvedValue({ data: mockResponseData });

      // Act: Call the function
      const result = await updatePersonal(personal);

      // Assert: Check results
      expect(result).toEqual(mockResponseData);
      expect(axios.post).toHaveBeenCalledWith(
        expect.stringContaining("/api/personal"),
        { personal },
        {
          headers: {
            Authorization: "Bearer mock-token-123",
          },
        },
      );
    });

    it("should handle personal costs with zero values", async () => {
      // Arrange: Setup mock response and income data to be sent
      const personal = { clothingAndFootwear: 100, hairdressing: 0 };
      const mockResponseData = [{ success: true }];
      axios.post.mockResolvedValue({ data: mockResponseData });

      // Act: Call the function
      const result = await updatePersonal(personal);

      // Assert: Call should be successful
      expect(result).toEqual(mockResponseData);
    });
  });

  describe("validation integration", () => {
    it("should validate wage before API call", async () => {
      // Arrange: Setup mock data
      const personal = { clothingAndFootwear: false, hairdressing: 23 };
      // Act & Assert: Call the function and check API was not called due to validation
      await expect(updatePersonal(personal)).rejects.toThrow(
        "Enter a number for your Clothing and Footwear",
      );
      expect(axios.post).not.toHaveBeenCalled();
    });
  });

  describe("API errors", () => {
    it("should throw an error when the API call fails", async () => {
      // Arrange: Setup data and mock rejection
      const personal = { clothingAndFootwear: 100, hairdressing: 23 };
      axios.post.mockRejectedValue(new Error("Network error"));

      // Act & Assert: Call the function and set expected resonse
      await expect(updatePersonal(personal)).rejects.toThrow(
        "There was an error saving your personal costs",
      );
    });
  });
});

// updatePets tests
describe("updatePets", () => {
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
    it("should update pets data on successful API call", async () => {
      // Arrange: Setup mock response and income data to be sent
      const pets = { petFood: 50, insurance: 23 };
      const mockResponseData = [{ success: true, id: 123 }];
      axios.post.mockResolvedValue({ data: mockResponseData });

      // Act: Call the function
      const result = await updatePets(pets);

      // Assert: Check results
      expect(result).toEqual(mockResponseData);
      expect(axios.post).toHaveBeenCalledWith(
        expect.stringContaining("/api/pets"),
        { pets },
        {
          headers: {
            Authorization: "Bearer mock-token-123",
          },
        },
      );
    });

    it("should handle pets costs with zero values", async () => {
      // Arrange: Setup mock response and income data to be sent
      const pets = { petFood: 50, insurance: 0 };
      const mockResponseData = [{ success: true }];
      axios.post.mockResolvedValue({ data: mockResponseData });

      // Act: Call the function
      const result = await updatePets(pets);

      // Assert: Call should be successful
      expect(result).toEqual(mockResponseData);
    });
  });

  describe("validation integration", () => {
    it("should validate wage before API call", async () => {
      // Arrange: Setup mock data
      const pets = { petFood: "Yes", insurance: 23 };
      // Act & Assert: Call the function and check API was not called due to validation
      await expect(updatePets(pets)).rejects.toThrow(
        "Enter a number for your Pet Food",
      );
      expect(axios.post).not.toHaveBeenCalled();
    });
  });

  describe("API errors", () => {
    it("should throw an error when the API call fails", async () => {
      // Arrange: Setup data and mock rejection
      const pets = { petFood: 100, insurance: 23 };
      axios.post.mockRejectedValue(new Error("Network error"));

      // Act & Assert: Call the function and set expected resonse
      await expect(updatePets(pets)).rejects.toThrow(
        "There was an error saving your pet costs",
      );
    });
  });
});
