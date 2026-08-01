import { expect, test } from "@playwright/test";

test("runs the primary synthetic assurance journey end to end", async ({ page }) => {
  await page.goto("/workspace");
  await expect(page.getByRole("heading", { name: /prove the control/i })).toBeVisible();
  await page.getByRole("button", { name: "Run 24 controls" }).click();
  await expect(page.getByRole("heading", { name: "All expected controls behaved correctly" })).toBeVisible();
  await expect(page.getByText("24/24 expectations met")).toBeVisible();
  await expect(page.getByText("0 external calls")).toBeVisible();
  await expect(page.getByText("CV-R4", { exact: true }).first()).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth)).toBe(true);
});

test("keyboard users can reach and run the primary action", async ({ page }) => {
  await page.goto("/workspace");
  await page.keyboard.press("Tab");
  await expect(page.getByRole("link", { name: "Skip to content" })).toBeFocused();
  await page.getByRole("button", { name: "Run 24 controls" }).focus();
  await page.keyboard.press("Enter");
  await expect(page.getByRole("heading", { name: "All expected controls behaved correctly" })).toBeVisible();
});
