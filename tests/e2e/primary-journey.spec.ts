import { expect, test } from "@playwright/test";

test("runs the primary synthetic assurance journey end to end", async ({ page }) => {
  await page.goto("/workspace");
  await expect(page.getByRole("heading", { name: /prove the control/i })).toBeVisible();
  await page.getByRole("button", { name: "Seal synthetic contract" }).click();
  await expect(page.getByText(/REVIEW_READY/)).toBeVisible();
  await page.getByRole("button", { name: "Run 24 controls" }).click();
  await expect(page.getByRole("heading", { name: "All expected controls behaved correctly" })).toBeVisible();
  await expect(page.getByText("24/24 expectations met")).toBeVisible();
  await expect(page.getByText("0 external calls")).toBeVisible();
  await expect(page.getByText("CV-R4", { exact: true }).first()).toBeVisible();
  await page.getByRole("button", { name: "Replay sealed handoff" }).click();
  await expect(page.getByText("DETERMINISTIC_REPLAY_MATCH")).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth)).toBe(true);
});

test("keyboard users can reach and run the primary action", async ({ page }) => {
  await page.goto("/workspace");
  await page.keyboard.press("Tab");
  await expect(page.getByRole("link", { name: "Skip to content" })).toBeFocused();
  await page.getByRole("button", { name: "Seal synthetic contract" }).focus();
  await page.keyboard.press("Enter");
  await expect(page.getByText(/REVIEW_READY/)).toBeVisible();
  await page.getByRole("button", { name: "Run 24 controls" }).focus();
  await page.keyboard.press("Enter");
  await expect(page.getByRole("heading", { name: "All expected controls behaved correctly" })).toBeVisible();
});

test("recovers from contract sealing and replay failures without replacing evidence", async ({ page }) => {
  await page.goto("/workspace");
  await page.getByRole("button", { name: "Seal synthetic contract" }).click();
  await expect(page.getByText(/REVIEW_READY/)).toBeVisible();
  await page.getByRole("button", { name: "Run 24 controls" }).click();
  await expect(page.getByText("24/24 expectations met")).toBeVisible();
  const acceptedContractDigest = await page.getByTestId("contract-digest").textContent();
  const acceptedBundleDigest = await page.getByTestId("bundle-digest").textContent();

  let resealAttempts = 0;
  await page.route("**/api/v1/journey-contracts", async (route) => {
    resealAttempts += 1;
    if (resealAttempts === 1) await route.fulfill({ status: 200, contentType: "application/json", body: "{" });
    else await route.continue();
  });
  await page.locator('input[name="journeyKey"]').fill("renewal-assurance-revised");
  await page.getByRole("button", { name: "Seal synthetic contract" }).click();
  await expect(page.getByText(/The contract could not be sealed/)).toBeVisible();
  await expect(page.getByTestId("contract-digest")).toHaveText(acceptedContractDigest!);
  await expect(page.getByTestId("bundle-digest")).toHaveText(acceptedBundleDigest!);
  await expect(page.getByRole("button", { name: "Download JSON handoff" })).toBeVisible();
  await page.getByRole("button", { name: "Seal synthetic contract" }).click();
  await expect(page.getByText(/REVIEW_READY/)).toBeVisible();
  await expect(page.getByTestId("contract-digest")).not.toHaveText(acceptedContractDigest!);
  await page.getByRole("button", { name: "Run 24 controls" }).click();
  await expect(page.getByText("24/24 expectations met")).toBeVisible();
  const revisedBundleDigest = await page.getByTestId("bundle-digest").textContent();
  expect(revisedBundleDigest).not.toBe(acceptedBundleDigest);

  let replayAttempts = 0;
  await page.route("**/api/v1/handoff-bundles/replay", async (route) => {
    replayAttempts += 1;
    if (replayAttempts === 1) await route.fulfill({ status: 200, contentType: "application/json", body: "{" });
    else await route.continue();
  });
  await page.getByRole("button", { name: "Replay sealed handoff" }).click();
  await expect(page.getByText(/Retain the original evidence/)).toBeVisible();
  await expect(page.getByTestId("bundle-digest")).toHaveText(revisedBundleDigest!);
  await expect(page.getByRole("button", { name: "Download JSON handoff" })).toBeVisible();
  await page.getByRole("button", { name: "Retry handoff replay" }).click();
  await expect(page.getByText("DETERMINISTIC_REPLAY_MATCH")).toBeVisible();
  await expect(page.getByTestId("bundle-digest")).toHaveText(revisedBundleDigest!);
});
