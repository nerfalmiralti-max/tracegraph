import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test("finite graph entrance, hover paths, scroll storytelling, and reduced-motion fallback", async ({
  page,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto("/");
  const heading = page.getByRole("heading", { level: 1 });
  await expect(heading).toHaveText("See the connections.Question the unknown.");
  const edge = page.locator('path[data-connection="polar-shop.example"]');
  await expect.poll(() => edge.getAttribute("stroke-dasharray")).toBe("1 1");
  const polar = page.getByRole("button", {
    name: "polar-shop.example 1 shared signal",
    exact: true,
  });
  await polar.hover();
  await expect(edge).toHaveAttribute("data-highlighted", "true");
  await expect(edge).toHaveCSS("opacity", "1");
  await expect(
    page.locator('path[data-connection="nova-outlet.example"]').first(),
  ).toHaveAttribute("data-highlighted", "false");
  await polar.click();
  const evidence = page.getByLabel("Example connection evidence", {
    exact: true,
  });
  await expect(evidence.getByRole("heading")).toHaveText("polar-shop.example");
  await evidence
    .getByRole("button", { name: "Matching returns policy" })
    .click();
  await expect(evidence.getByText(/Common templates/)).toBeVisible();

  const stages = page.getByLabel("Investigation stages");
  const preview = page.getByRole("region", {
    name: "Investigation walkthrough",
  });
  await stages
    .getByRole("button", { name: /02 Look at/ })
    .scrollIntoViewIfNeeded();
  await stages.getByRole("button", { name: /02 Look at/ }).click();
  await expect(preview.getByRole("heading")).toHaveText("What can we observe?");
  await expect(preview.getByText(/^Shared banner image/)).toBeVisible();
  await preview.getByRole("button", { name: "Next step" }).click();
  await expect(preview.getByRole("heading")).toHaveText(
    "One website. Two possible leads.",
  );
  await expect(preview.getByText("polar-shop.example")).toBeVisible();
  await preview.hover();
  const beforeScroll = await page.evaluate(() => window.scrollY);
  await page.mouse.wheel(0, -250);
  // Wheel input is asynchronous; don't race it with the following programmatic scroll.
  await expect
    .poll(() => page.evaluate(() => window.scrollY))
    .toBeLessThan(beforeScroll);
  await stages
    .getByRole("button", { name: /04 Keep/ })
    .evaluate((element) => element.scrollIntoView({ block: "center" }));
  await expect(stages.getByRole("button", { name: /04 Keep/ })).toHaveAttribute(
    "aria-pressed",
    "true",
  );
  await expect(
    preview.locator('[aria-hidden="false"]').getByText("Not established"),
  ).toBeVisible();
  expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);

  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await expect(page.locator("header")).toHaveCSS("animation-name", "none");
  await expect(page.locator("[data-entrance]").first()).toHaveCSS(
    "transform",
    "none",
  );
  await expect(page.locator("[data-entrance]").first()).toHaveCSS(
    "opacity",
    "1",
  );
  await expect
    .poll(() =>
      page.evaluate(
        () =>
          document.getAnimations().filter((a) => a.playState === "running")
            .length,
      ),
    )
    .toBe(0);
  await page.emulateMedia({ forcedColors: "active" });
  await expect(heading).toBeVisible();
  expect(errors).toEqual([]);
});
