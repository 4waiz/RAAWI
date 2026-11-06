import { expect, test } from '@playwright/test';

for (const path of ['/', '/experience', '/pitch-demo']) {
  test(`no horizontal scroll on ${path} (mobile)`, async ({ page }) => {
    await page.goto(path);
    await page.waitForTimeout(800);
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    expect(overflow).toBeLessThanOrEqual(0);
  });
}

test('mobile Q&A works and the ask bar is reachable', async ({ page }) => {
  await page.goto('/experience');
  await page.getByTestId('ask-input').fill('What is that tower?');
  await page.getByTestId('ask-submit').click();
  await expect(page.getByTestId('answer-text').last()).toContainText('barjeel');
});
