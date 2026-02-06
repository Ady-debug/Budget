import { validateField } from "../api";

describe("validateField - Null values", () => {
  it("should throw an error when the value is null", () => {
    expect(() => validateField(null, "income")).toThrow(
      "Enter a number for your income",
    );
  });
});
