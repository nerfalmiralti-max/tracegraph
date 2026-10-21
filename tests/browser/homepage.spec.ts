import { test, expect } from "@playwright/test";

test("public homepage has a usable search and keyboard-operable investigation preview", async ({
  page,
}) => {
  await page.goto("/");
  await expect(page.locator(".sidebar")).toHaveCount(0);
  const heading = page.getByRole("heading", { level: 1 });
  const size = await heading.evaluate((element) =>
    parseFloat(getComputedStyle(element).fontSize),
  );
  expect(size).toBeGreaterThanOrEqual(48);
  expect(size).toBeLessThanOrEqual(60);
  const search = await page.locator(".search-control").boundingBox();
  expect(search!.width).toBeGreaterThan(450);
  expect(search!.height).toBeGreaterThanOrEqual(64);
  const graph = await page
    .locator("svg[aria-label='Example domain connections']")
    .boundingBox();
  expect(graph!.x).toBeGreaterThan(search!.x + search!.width);

  await page
    .getByRole("button", {
      name: "Inspect matching returns policy connection to polar-shop.example",
      exact: true,
    })
    .focus();
  await page.keyboard.press("Enter");
  const evidence = page.getByLabel("Example connection evidence", {
    exact: true,
  });
  await expect(evidence.getByRole("heading")).toHaveText("polar-shop.example");
  await expect(
    evidence.getByText(/Common templates could also explain a match/),
  ).toBeVisible();

  await page.getByRole("button", { name: "Zoom in", exact: true }).click();
  await expect(page.getByLabel("Example zoom level")).toHaveText("120%");
  const scene = page.getByTestId("homepage-graph-scene");
  const before = await scene.getAttribute("transform");
  await page
    .getByRole("group", { name: "Example domain connections", exact: true })
    .focus();
  await page.keyboard.press("ArrowRight");
  await expect(scene).not.toHaveAttribute("transform", before!);
  await page.getByRole("button", { name: "Reset example view" }).click();
  await expect(page.getByLabel("Example zoom level")).toHaveText("100%");
  await expect(scene).toHaveAttribute(
    "transform",
    "translate(0 0) translate(340 215) scale(1) translate(-340 -215)",
  );

  await page.setViewportSize({ width: 390, height: 844 });
  await expect(
    page.locator("svg[aria-label='Example domain connections']"),
  ).toBeHidden();
  await page
    .getByRole("button", {
      name: "nova-outlet.example 2 shared signals",
      exact: true,
    })
    .click();
  await expect(evidence.getByRole("heading")).toHaveText("nova-outlet.example");
  await page
    .getByRole("button", { name: /04 Keep the uncertainty in view/ })
    .click();
  await page.getByRole("button", { name: "Explore example network" }).click();
  await expect(page).toHaveURL("/network");
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
});
