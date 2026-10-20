import { test, expect } from "@playwright/test";

test("headline wave finishes once, preserves layout, and respects motion and contrast preferences", async ({
  page,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("/");
  const heading = page.getByRole("heading", { level: 1 });
  await expect(heading).toHaveAttribute("data-slot", "wave-text");
  await expect(heading).toHaveCSS("animation-name", "wave-text");
  await expect(heading).toHaveCSS("animation-iteration-count", "1");
  const bounds = await heading.boundingBox();
  await expect
    .poll(
      () =>
        heading.evaluate((element) =>
          Number(
            getComputedStyle(element).getPropertyValue("--wave-text-offset"),
          ),
        ),
      { timeout: 6000 },
    )
    .toBe(200);
  expect(await heading.boundingBox()).toEqual(bounds);
  await expect(heading).toHaveText("Know who you're dealing with.");

  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect(heading).toHaveAttribute("data-state", "static");
  await expect(heading).toHaveCSS("animation-name", "none");
  await expect(heading).toHaveCSS("background-image", "none");
  expect(
    await heading.evaluate(
      (element) => getComputedStyle(element).webkitTextFillColor,
    ),
  ).not.toBe("rgba(0, 0, 0, 0)");

  await page.emulateMedia({
    reducedMotion: "no-preference",
    forcedColors: "active",
  });
  await expect(heading).toHaveCSS("animation-name", "none");
  await expect(heading).toHaveCSS("background-image", "none");
  expect(errors).toEqual([]);
});
