import { describe, expect, it } from "vitest";
import { getCopy, localizePath } from "@/lib/i18n";

function shape(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(shape);
  if (value && typeof value === "object") {
    return Object.fromEntries(Object.entries(value).map(([key, child]) => [key, shape(child)]));
  }
  return typeof value;
}

describe("bilingual content", () => {
  it("keeps English and Italian dictionaries structurally identical", () => {
    expect(shape(getCopy("it"))).toEqual(shape(getCopy("en")));
  });

  it("preserves the current route when switching language", () => {
    expect(localizePath("it", "/en/how-it-works")).toBe("/it/how-it-works");
    expect(localizePath("en", "/plans")).toBe("/en/plans");
  });
});
