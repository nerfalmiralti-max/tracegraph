import { test, expect, type Page } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

async function assertEnglish(page: Page) {
  await expect(page.locator("html")).toHaveAttribute("lang", "en-US");
  const productText = await page.locator("body").evaluate((element) => {
    const attributes = Array.from(
      element.querySelectorAll("[aria-label], [title], [placeholder]"),
    ).flatMap((item) =>
      ["aria-label", "title", "placeholder"].map(
        (name) => item.getAttribute(name) || "",
      ),
    );
    return (element as HTMLElement).innerText + attributes.join(" ");
  });
  expect(productText).not.toMatch(/[\u0400-\u04ff]/);
}

test("English covers direct entry, reports, sources, graph, and validation", async ({
  page,
}) => {
  for (const route of ["/", "/about", "/report", "/network"]) {
    await page.goto(route);
    await assertEnglish(page);
  }
  await page.goto("/");
  for (const value of [
    "",
    "file:///example",
    "https://user:password@example.com",
    "127.0.0.1",
    "service.local",
    "bad_domain.example",
  ]) {
    await page.getByLabel("Domain or website URL").fill(value);
    await page
      .getByRole("button", { name: "Check website", exact: true })
      .click();
    await expect(
      page.getByRole("alert").filter({ hasText: "Check incomplete" }),
    ).toBeVisible();
    await assertEnglish(page);
  }
  await page.getByRole("button", { name: "View example report" }).click();
  await expect(page).toHaveURL("/report");
  for (const name of ["Overview", "Evidence", "Technical details"]) {
    await page.getByRole("tab", { name }).click();
    for (const summary of await page.locator("summary").all())
      await summary.click();
    await assertEnglish(page);
  }
  await page
    .getByRole("link", { name: "Network explorer", exact: true })
    .click();
  await expect(page).toHaveURL("/network");
  await page.locator("summary").first().click();
  await assertEnglish(page);
  await page.getByRole("button", { name: "List view" }).click();
  await expect(page.locator(".relationship-list")).toBeVisible();
  await assertEnglish(page);
});

test("narrow layouts and long domain names stay within the viewport", async ({
  page,
}) => {
  for (const width of [320, 540, 768, 1024]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/");
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
    await page
      .getByLabel("Domain or website URL")
      .fill(`${"a".repeat(63)}.example`);
    await page
      .getByRole("button", { name: "Check website", exact: true })
      .click();
    await expect(page).toHaveURL("/report");
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
    await page.getByRole("tab", { name: "Technical details" }).click();
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
  }
  await page.goto("/about");
  expect
    .soft((await new AxeBuilder({ page }).analyze()).violations)
    .toEqual([]);
});
