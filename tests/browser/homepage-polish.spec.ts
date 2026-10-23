import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

for (const [width, height] of [
  [1440, 900],
  [1280, 800],
  [768, 1024],
  [390, 844],
  [360, 800],
]) {
  test(`homepage polish at ${width} × ${height}`, async ({ page }) => {
    const errors: string[] = [];
    page.on("pageerror", (error) => errors.push(error.message));
    page.on("console", (message) => {
      if (message.type() === "error") errors.push(message.text());
    });
    await page.setViewportSize({ width, height });
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/");
    const evidence = page.getByRole("complementary", {
      name: "Example connection evidence",
    });
    const evidenceHeight = (await evidence.boundingBox())!.height;
    for (const domain of [
      "polar-shop.example 1 shared signal",
      "nova-outlet.example 2 shared signals",
    ]) {
      await page.getByRole("button", { name: domain, exact: true }).click();
      expect((await evidence.boundingBox())!.height).toBeCloseTo(
        evidenceHeight,
        0,
      );
    }
    const polar = page.getByRole("button", {
      name: "polar-shop.example 1 shared signal",
      exact: true,
    });
    await polar.focus();
    await page.keyboard.press("ArrowUp");
    await expect(
      page.getByRole("button", {
        name: "nova-outlet.example 2 shared signals",
        exact: true,
      }),
    ).toBeFocused();
    await page.keyboard.press("ArrowDown");
    await expect(polar).toBeFocused();
    await expect(evidence.getByRole("heading")).toHaveText(
      "polar-shop.example",
    );
    await evidence
      .getByRole("button", { name: "Matching returns policy" })
      .click();
    await expect(evidence.getByText(/Common templates/)).toBeVisible();
    await evidence
      .getByRole("button", { name: "Matching returns policy" })
      .click();
    await page
      .getByRole("button", {
        name: "nova-outlet.example 2 shared signals",
        exact: true,
      })
      .click();

    const preview = page.getByRole("region", {
      name: "Investigation walkthrough",
    });
    const previewHeight = (await preview.boundingBox())!.height;
    const stages = page.getByLabel("Investigation stages");
    for (const name of [/02 Look/, /03 Follow/, /04 Keep/, /01 Start/]) {
      await stages.getByRole("button", { name }).click();
      expect((await preview.boundingBox())!.height).toBeCloseTo(
        previewHeight,
        0,
      );
      await expect(preview.getByRole("heading")).toHaveCount(1);
    }
    expect(
      await page.evaluate(() => document.documentElement.scrollWidth),
    ).toBe(width);
    // Verify layout, not concealment by an outer clipping container.
    expect(
      await page
        .locator("main")
        .evaluate((main) => getComputedStyle(main.parentElement!).overflowX),
    ).toBe("visible");
    if (width <= 560) {
      await page.getByRole("button", { name: "Open menu" }).click();
      const nav = page.getByRole("navigation", { name: "Main navigation" });
      await expect(
        nav.getByRole("link", { name: "The investigation" }),
      ).toBeVisible();
      await expect(
        nav.getByRole("link", { name: "Our approach" }),
      ).toBeVisible();
      await page.keyboard.press("Escape");
      await expect(nav).toBeHidden();
      await expect(
        page.getByRole("button", { name: "Open menu" }),
      ).toBeFocused();
      await page.getByRole("button", { name: "Open menu" }).click();
      await nav.getByRole("link", { name: "Check a website" }).click();
      await expect(page.getByLabel("Domain or website URL")).toBeFocused();
      await expect(nav).toBeHidden();
    } else {
      const zoom = page.getByRole("button", { name: "Zoom in", exact: true });
      expect((await zoom.boundingBox())!.height).toBeGreaterThanOrEqual(44);
      await zoom.click();
      await zoom.click();
      await expect(zoom).toBeDisabled();
      await page.getByRole("button", { name: "Reset example view" }).click();
      await expect(page.getByLabel("Example zoom level")).toHaveText("100%");
    }
    await page.getByRole("heading", { level: 1 }).scrollIntoViewIfNeeded();
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.screenshot({
      path: `docs/screenshots/home-${width}x${height}.png`,
      fullPage: true,
      caret: "initial",
    });
    expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
    expect(errors).toEqual([]);
  });
}

test("homepage loading, failed examples, and retry keep the existing search functional", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  let release: () => void = () => {};
  const pending = new Promise<void>((resolve) => {
    release = resolve;
  });
  await page.route("**/api/check", async (route) => {
    await pending;
    await route.fulfill({
      status: 503,
      json: { error: "Example temporarily unavailable. Please try again." },
    });
  });
  await page.getByRole("button", { name: "View example report" }).click();
  await expect(
    page.getByRole("button", { name: "Checking…", exact: true }),
  ).toBeDisabled();
  await expect(
    page.getByRole("button", { name: "View example report" }),
  ).toBeDisabled();
  release();
  const input = page.getByLabel("Domain or website URL");
  await expect(input).toBeFocused();
  await expect(
    page.getByRole("alert").filter({ hasText: "Check incomplete" }),
  ).toContainText("Example temporarily unavailable");
  await page.unroute("**/api/check");
  await input.fill("aurora-deals.example");
  await input.press("Enter");
  await expect(page).toHaveURL("/report");
  await expect(
    page.getByRole("heading", { name: "aurora-deals.example", exact: true }),
  ).toBeVisible();
});
