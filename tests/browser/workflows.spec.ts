import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

// Provider branches use complete response fixtures; these are UI tests, not live intelligence.
for (const scenario of [
  {
    status: "listed",
    verdict: "known_threat",
    label: "Match found",
    heading: "Known threat match",
    types: ["MALWARE"],
  },
  {
    status: "not_listed",
    verdict: "insufficient_data",
    label: "No match found",
    heading: "Insufficient evidence",
    types: [],
  },
  {
    status: "unavailable",
    verdict: "insufficient_data",
    label: "Source unavailable",
    heading: "Insufficient evidence",
    types: [],
  },
]) {
  test(`provider response fixture: ${scenario.status} is presented without overstating safety`, async ({
    page,
  }) => {
    await page.route("**/api/check", (route) =>
      route.fulfill({
        json: {
          domain: "provider-test.example",
          demo: false,
          connections: [],
          signals: [],
          reputation: { status: scenario.status, types: scenario.types },
          status: scenario.verdict,
          note: "API response fixture, not a live check.",
        },
      }),
    );
    await page.goto("/");
    await page
      .getByLabel("Domain or website URL", { exact: true })
      .fill("provider-test.example");
    await page
      .getByRole("button", { name: "Check website", exact: true })
      .click();
    await expect(page).toHaveURL("/report");
    await expect(
      page.getByRole("heading", { name: scenario.heading }),
    ).toBeVisible();
    await expect(
      page.locator(".source-row").getByText(scenario.label, { exact: true }),
    ).toBeVisible();
    if (scenario.types.length)
      await expect(page.getByText("Threat types: MALWARE")).toBeVisible();
    expect
      .soft((await new AxeBuilder({ page }).analyze()).violations)
      .toEqual([]);
  });
}

test("pending requests disable resubmission and failed refresh preserves the previous report", async ({
  page,
}) => {
  await page.goto("/");
  await page.getByRole("button", { name: "View example report" }).click();
  await expect(page).toHaveURL("/report");
  let release: () => void = () => {};
  const pending = new Promise<void>((resolve) => {
    release = resolve;
  });
  await page.route("**/api/check", async (route) => {
    await pending;
    await route.abort("failed");
  });
  await page.getByRole("button", { name: "Check again" }).click();
  await expect(
    page.getByRole("button", { name: "Check again" }),
  ).toBeDisabled();
  await expect(page.getByText("Checking available sources…")).toBeVisible();
  release();
  await expect(
    page.getByRole("alert").filter({ hasText: "Check incomplete" }),
  ).toBeVisible();
  await expect(
    page.getByRole("heading", { name: "aurora-deals.example", exact: true }),
  ).toBeVisible();
  await expect(page.getByRole("button", { name: "Check again" })).toBeEnabled();
});

test("search, report, evidence, graph selection and filters use the existing API", async ({
  page,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  const exampleEvidence = page.getByLabel("Example connection evidence", {
    exact: true,
  });
  await page
    .getByRole("button", {
      name: "polar-shop.example 1 shared signal",
      exact: true,
    })
    .click();
  await expect(
    exampleEvidence.getByRole("heading", { name: "polar-shop.example" }),
  ).toBeVisible();
  await expect(
    exampleEvidence.getByText("Matching returns policy"),
  ).toBeVisible();
  await expect(exampleEvidence.getByText("Shared banner image")).toHaveCount(0);
  await page
    .getByRole("button", {
      name: "nova-outlet.example 2 shared signals",
      exact: true,
    })
    .click();
  await page.screenshot({
    path: "docs/screenshots/home-desktop.png",
    fullPage: true,
    caret: "initial",
  });
  expect
    .soft((await new AxeBuilder({ page }).analyze()).violations)
    .toEqual([]);
  await page.getByRole("button", { name: "View example report" }).click();
  await expect(page).toHaveURL("/report");
  await expect(
    page.getByRole("heading", { name: "aurora-deals.example", exact: true }),
  ).toBeVisible();
  await expect(page.getByText("Not queried · demo")).toBeVisible();
  await page.screenshot({
    path: "docs/screenshots/report-desktop.png",
    fullPage: true,
    caret: "initial",
  });
  expect
    .soft((await new AxeBuilder({ page }).analyze()).violations)
    .toEqual([]);
  await page.getByRole("tab", { name: "Overview" }).focus();
  await page.keyboard.press("ArrowRight");
  await expect(page.getByRole("tab", { name: "Evidence" })).toHaveAttribute(
    "aria-selected",
    "true",
  );
  await page.locator("summary").first().click();
  await expect(page.getByText("hero-image-demo")).toBeVisible();
  await page
    .getByRole("link", { name: "Network explorer", exact: true })
    .click();
  await expect(page).toHaveURL("/network");
  await page.getByRole("button", { name: "Zoom in" }).click();
  await expect(page.getByLabel("Zoom level", { exact: true })).toHaveText(
    "120%",
  );
  await page.getByRole("button", { name: "Reset view" }).click();
  const canvas = page.getByRole("group", { name: "Graph canvas", exact: true });
  const scene = page.locator(".graph-scene");
  const initialTransform = await scene.getAttribute("transform");
  await canvas.focus();
  await page.keyboard.press("ArrowRight");
  await expect(scene).not.toHaveAttribute("transform", initialTransform!);
  await page.keyboard.press("Home");
  await expect(scene).toHaveAttribute("transform", initialTransform!);
  const bounds = await canvas.boundingBox();
  if (!bounds) throw new Error("Graph canvas is not visible");
  await page.mouse.move(bounds.x + bounds.width / 2, bounds.y + 30);
  await page.mouse.down();
  await page.mouse.move(bounds.x + bounds.width / 2 + 65, bounds.y + 55, {
    steps: 4,
  });
  await page.mouse.up();
  await expect(scene).not.toHaveAttribute("transform", initialTransform!);
  await page.getByRole("button", { name: "Reset view" }).click();
  await expect(scene).toHaveAttribute("transform", initialTransform!);
  await page
    .getByRole("button", {
      name: "Inspect connection to polar-shop.example: Shared text",
      exact: true,
    })
    .focus();
  await page.keyboard.press("Enter");
  await expect(
    page
      .getByRole("complementary", { name: "Selected connection evidence" })
      .getByRole("heading", { name: "polar-shop.example" }),
  ).toBeVisible();
  await expect(
    page.getByText("No verified connections in this dataset"),
  ).toBeVisible();
  await page
    .getByRole("button", {
      name: "polar-shop.example Shared signals: 1",
      exact: true,
    })
    .click();
  await expect(
    page
      .getByRole("complementary", { name: "Selected connection evidence" })
      .getByRole("heading", { name: "polar-shop.example" }),
  ).toBeVisible();
  await page.getByLabel("Signal type").selectOption("asset");
  await expect(
    page.getByRole("status").filter({ hasText: "Connections:" }),
  ).toHaveText("Connections: 1 / 2");
  await expect(
    page
      .getByRole("complementary", { name: "Selected connection evidence" })
      .getByRole("heading", { name: "nova-outlet.example" }),
  ).toBeVisible();
  await page.getByLabel("Find a related domain").fill("polar");
  await expect(
    page.getByRole("heading", { name: "No matching connections" }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Clear filters" }).click();
  await page.screenshot({
    path: "docs/screenshots/network-desktop.png",
    fullPage: true,
    caret: "initial",
  });
  expect
    .soft((await new AxeBuilder({ page }).analyze()).violations)
    .toEqual([]);
  await page.getByRole("link", { name: "Back to report", exact: true }).click();
  await expect(
    page.getByRole("heading", { name: "aurora-deals.example", exact: true }),
  ).toBeVisible();
  await expect(page).toHaveURL("/report");
  await page.reload();
  await expect(
    page.getByRole("heading", { name: "No investigation yet" }),
  ).toBeVisible();
  expect(errors).toEqual([]);
});

test("invalid input and absent data never become a safe verdict", async ({
  page,
}) => {
  await page.goto("/");
  await page
    .getByLabel("Domain or website URL", { exact: true })
    .fill("http://127.0.0.1");
  await page
    .getByRole("button", { name: "Check website", exact: true })
    .click();
  await expect(
    page.getByRole("alert").filter({ hasText: "Check incomplete" }),
  ).toBeVisible();
  await page
    .getByLabel("Domain or website URL", { exact: true })
    .fill("unknown.example");
  await page
    .getByRole("button", { name: "Check website", exact: true })
    .click();
  await expect(page).toHaveURL("/report");
  await expect(
    page.getByRole("heading", { name: "Insufficient evidence" }),
  ).toBeVisible();
  await expect(
    page.locator(".source-row").getByText("Not connected", { exact: true }),
  ).toBeVisible();
  await expect(
    page.getByText("No connections in the available dataset"),
  ).toBeVisible();
  await page.getByRole("link", { name: "Explore network" }).click();
  await expect(
    page.getByRole("heading", { name: "No connections to explore" }),
  ).toBeVisible();
});

test("mobile and tablet remain readable with an accessible relationship list", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await page.screenshot({
    path: "docs/screenshots/home-mobile.png",
    fullPage: true,
    caret: "initial",
  });
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
  expect
    .soft((await new AxeBuilder({ page }).analyze()).violations)
    .toEqual([]);
  await page.getByRole("button", { name: "View example report" }).click();
  await expect(page).toHaveURL("/report");
  await page.screenshot({
    path: "docs/screenshots/report-mobile.png",
    fullPage: true,
    caret: "initial",
  });
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
  expect
    .soft((await new AxeBuilder({ page }).analyze()).violations)
    .toEqual([]);
  await page.getByRole("link", { name: "Explore network" }).click();
  await expect(page.locator(".graph-viewport")).toBeHidden();
  await page
    .getByRole("button", {
      name: "polar-shop.example Shared signals: 1",
      exact: true,
    })
    .click();
  await expect(
    page.getByRole("heading", { name: "polar-shop.example", exact: true }),
  ).toBeVisible();
  await page.screenshot({
    path: "docs/screenshots/network-mobile.png",
    fullPage: true,
    caret: "initial",
  });
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
  expect
    .soft((await new AxeBuilder({ page }).analyze()).violations)
    .toEqual([]);
  await page.setViewportSize({ width: 820, height: 1180 });
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
  await page.screenshot({
    path: "docs/screenshots/network-tablet.png",
    fullPage: true,
    caret: "initial",
  });
});
