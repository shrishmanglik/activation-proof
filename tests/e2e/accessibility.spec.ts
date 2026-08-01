import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

test("overview and completed workspace have no serious axe violations", async ({ page }) => {
  await page.goto("/");
  const overview = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"]).analyze();
  expect(overview.violations.filter((violation) => ["serious", "critical"].includes(violation.impact ?? ""))).toEqual([]);

  await page.goto("/workspace");
  await page.getByRole("button", { name: "Seal synthetic contract" }).click();
  await page.getByRole("button", { name: "Run 24 controls" }).click();
  await expect(page.getByRole("heading", { name: "All expected controls behaved correctly" })).toBeVisible();
  const workspace = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"]).analyze();
  expect(workspace.violations.filter((violation) => ["serious", "critical"].includes(violation.impact ?? ""))).toEqual([]);
});
