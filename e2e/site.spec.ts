import { expect, test } from "@playwright/test";

test("English and Italian editorial routes render", async ({ page }) => {
  await page.goto("/en");
  await expect(page.getByRole("heading", { level: 1 })).toContainText("Your life");
  await page.goto("/it/plans");
  await expect(page.getByRole("heading", { level: 1 })).toContainText("Una promessa");
});

test("language switch preserves the current route", async ({ page, isMobile }) => {
  await page.goto("/en/how-it-works");
  if (isMobile) await page.getByText("Menu", { exact: true }).click();
  await page.getByRole("link", { name: "Italiano" }).click();
  await expect(page).toHaveURL(/\/it\/how-it-works$/);
  await expect(page.getByRole("heading", { level: 1 })).toContainText("condizione di oggi");
});

test("quiet suspension skips Lucid Dream configuration and survives refresh", async ({ page }) => {
  await page.goto("/en/enroll");
  await page.getByRole("button", { name: "Continue" }).click();
  await page.getByLabel("Preferred display name").fill("David");
  await page.getByRole("button", { name: "Continue" }).click();
  await page.getByRole("button", { name: "Continue" }).click();
  await page.getByLabel("Quiet suspension").check();
  await page.getByRole("button", { name: "Continue" }).click();
  await expect(page.getByRole("heading", { name: "Select your continuity safeguards." })).toBeVisible();
  await page.reload();
  await expect(page.getByRole("heading", { name: "Select your continuity safeguards." })).toBeVisible();
});

test("Lucid Dream path generates a local bilingual PDF", async ({ page }) => {
  await page.goto("/en/enroll");
  await page.getByRole("button", { name: "Continue" }).click();
  await page.getByRole("button", { name: "Continue" }).click();
  await page.getByRole("button", { name: "Continue" }).click();
  await page.getByLabel("Lucid Dream").check();
  await page.getByRole("button", { name: "Continue" }).click();
  await page.getByLabel("Memory anchor").fill("The morning after the rain");
  await page.getByRole("button", { name: "Continue" }).click();
  await page.getByLabel("Open coast").check();
  await page.getByLabel("Serene").check();
  await page.getByRole("button", { name: "Continue" }).click();
  await page.getByRole("button", { name: "Continue" }).click();
  await page.getByRole("checkbox", { name: "I understand this is a non-binding fictional specimen and not a medical or legal contract." }).check();
  const downloadPromise = page.waitForEvent("download");
  await page.getByRole("button", { name: "Download bilingual dossier" }).click();
  const download = await downloadPromise;
  expect(download.suggestedFilename()).toMatch(/^life-extension-LE-\d{6}\.pdf$/);
});
