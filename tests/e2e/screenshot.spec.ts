import { expect, test } from "@playwright/test";

test("captures the recruiter-inspectable overview", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { name: /green connector/i })).toBeVisible();
  await page.screenshot({ path: "docs/screenshots/activation-proof-overview.png", fullPage: true });
});

test("captures the completed workflow at the minimum supported width", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/workspace");
  await page.getByRole("button", { name: "Seal synthetic contract" }).click();
  await page.getByRole("button", { name: "Run 24 controls" }).click();
  await expect(page.getByRole("heading", { name: "All expected controls behaved correctly" })).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth)).toBe(true);
  await page.screenshot({ path: "docs/screenshots/activation-proof-workspace-mobile.png", fullPage: true });
});
