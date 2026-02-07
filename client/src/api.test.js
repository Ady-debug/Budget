import { validateField } from "../api";

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
