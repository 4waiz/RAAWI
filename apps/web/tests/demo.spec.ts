import { expect, test, type Page } from '@playwright/test';

async function ask(page: Page, q: string) {
  await page.getByTestId('ask-input').fill(q);
  await page.getByTestId('ask-submit').click();
}

function collectErrors(page: Page) {
  const errors: string[] = [];
  page.on('pageerror', (e) => errors.push(e.message));
  page.on('console', (m) => {
    if (m.type() === 'error') errors.push(m.text());
  });
  return errors;
}

test.describe('landing', () => {
  test('renders value proposition, team and CTAs', async ({ page }) => {
    const errors = collectErrors(page);
    await page.goto('/');
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('See the place. Hear its story.');
    await expect(page.getByText('Team Kanban').first()).toBeVisible();
    for (const n of ['Awaiz Ahmed', 'Mohammad Umar', 'Bilal Feroz', 'Huda Mueen']) await expect(page.getByText(n)).toBeVisible();
    await page.getByTestId('cta-enter').click();
    await expect(page).toHaveURL(/\/experience$/);
    await expect(page.getByTestId('ask-input')).toBeVisible();
    expect(errors).toEqual([]);
  });
});

test.describe('core demo path', () => {
  test('LOOK → ASK → UNDERSTAND with sources and follow-up context', async ({ page }) => {
    const errors = collectErrors(page);
    await page.goto('/experience');
    await expect(page.getByTestId('focus-label')).toContainText('Barjeel');
    await ask(page, 'Nazar, what is that tower?');
    const first = page.getByTestId('answer-card').last();
    await expect(first.getByTestId('answer-text')).toContainText('barjeel');
    await expect(first.getByTestId('answer-mode')).toHaveText('Curated knowledge');
    const links = first.getByTestId('source-cards').getByRole('link');
    await expect(links.first()).toHaveAttribute('href', /^https:\/\//);

    await ask(page, 'How did it actually cool the house?');
    await expect(page.getByTestId('answer-card')).toHaveCount(2);
    await expect(page.getByTestId('answer-card').last().getByTestId('answer-text')).toContainText('four sides');
    await expect(page.getByTestId('toggle-airflow')).toHaveAttribute('aria-checked', 'true');

    await ask(page, 'Why?');
    await expect(page.getByTestId('answer-card')).toHaveCount(3);
    await expect(page.getByTestId('answer-card').last().getByTestId('answer-text')).toContainText('every side');
    await expect(page.getByTestId('assistant-state').first()).toHaveAttribute('data-state', 'idle', { timeout: 15000 });
    expect(errors).toEqual([]);
  });

  test('declines off-topic questions instead of guessing', async ({ page }) => {
    await page.goto('/experience');
    await ask(page, "What's the weather tomorrow?");
    await expect(page.getByTestId('answer-confidence').last()).toHaveAttribute('data-confidence', 'declined');
  });

  test('Arabic: RTL layout and Arabic answers', async ({ page }) => {
    await page.goto('/experience');
    await page.getByTestId('lang-toggle').click();
    await expect(page.locator('html')).toHaveAttribute('dir', 'rtl');
    await page.getByTestId('station-dallah-hospitality').click();
    await ask(page, 'يا نظر، ما هذه الدلّة؟');
    const card = page.getByTestId('answer-card').last();
    await expect(card).toHaveAttribute('lang', 'ar');
    await expect(card.getByTestId('answer-text')).toContainText('دلّة');
    await ask(page, 'كيف تُقدَّم القهوة؟');
    await expect(page.getByTestId('answer-card').last().getByTestId('answer-text')).toContainText('فنجان');
  });

  test('naming another landmark moves the scene there', async ({ page }) => {
    await page.goto('/experience');
    await ask(page, 'How many domes does the Sheikh Zayed Grand Mosque have?');
    await expect(page.getByTestId('answer-card').last().getByTestId('answer-text')).toContainText('82 domes');
    await expect(page.getByTestId('focus-label')).toContainText('Sheikh Zayed Grand Mosque');
  });

  test('clear memory empties the transcript', async ({ page }) => {
    await page.goto('/experience');
    await ask(page, 'What is that tower?');
    await expect(page.getByTestId('answer-card')).toHaveCount(1);
    await page.getByTestId('clear-memory').click();
    await expect(page.getByTestId('answer-card')).toHaveCount(0);
  });
});

test.describe('presenter mode', () => {
  test('steps through the scripted demo and resets without reloading', async ({ page }) => {
    const errors = collectErrors(page);
    await page.goto('/pitch-demo');
    await page.evaluate(() => ((window as any).__noReload = true));
    await expect(page.getByTestId('step-counter')).toContainText('Ready');
    await page.keyboard.press('ArrowRight');
    await page.keyboard.press('ArrowRight');
    await expect(page.getByTestId('glasses-frame')).toBeVisible();
    await expect(page.getByTestId('capture-led')).toHaveAttribute('data-on', 'true');
    await page.keyboard.press('ArrowRight');
    await expect(page.getByTestId('step-counter')).toContainText('3 / 8');
    await expect(page.getByTestId('visitor-turn').getByText('scripted prompt')).toBeVisible();
    await expect(page.getByTestId('answer-text').last()).toContainText('barjeel');
    await page.keyboard.press('5');
    await expect(page.getByTestId('answer-text').last()).toContainText('four sides');
    await page.keyboard.press('6');
    await expect(page.locator('html')).toHaveAttribute('dir', 'rtl');
    await expect(page.getByTestId('answer-text').last()).toContainText('دلّة', { timeout: 15000 });
    await page.keyboard.press('8');
    await expect(page.getByTestId('architecture-overlay')).toBeVisible();
    await expect(page.locator('html')).toHaveAttribute('dir', 'ltr');
    await page.keyboard.press('r');
    await expect(page.getByTestId('step-counter')).toContainText('Ready');
    await expect(page.getByTestId('answer-card')).toHaveCount(0);
    expect(await page.evaluate(() => (window as any).__noReload)).toBe(true);
    expect(errors).toEqual([]);
  });

  test('deep link to /pitch-demo works', async ({ page }) => {
    const res = await page.goto('/pitch-demo');
    expect(res?.ok()).toBeTruthy();
    await expect(page.getByTestId('presenter-panel')).toBeVisible();
  });
});

test.describe('privacy & consent', () => {
  test('camera is off by default and vision is honestly unavailable without the API', async ({ page }) => {
    await page.goto('/experience');
    await page.getByTestId('open-camera').click();
    const panel = page.getByTestId('camera-panel');
    await expect(panel.getByText('Camera off')).toBeVisible();
    await panel.getByTestId('capture-scene').click();
    await expect(panel.getByRole('checkbox')).not.toBeChecked();
    await expect(panel.getByTestId('analyse')).toBeDisabled();
    await expect(panel.getByTestId('vision-unavailable')).toBeVisible();
  });

  test('microphone asks for consent before listening', async ({ page }) => {
    await page.goto('/experience');
    const mic = page.getByTestId('mic-button');
    if (await mic.isDisabled()) test.skip(true, 'Speech recognition not available in this browser');
    await mic.click();
    await expect(page.getByRole('dialog', { name: 'Microphone consent' })).toBeVisible();
  });

  test('honest capability labels are shown', async ({ page }) => {
    await page.goto('/experience');
    const badges = page.getByTestId('status-badges');
    await expect(badges).toContainText('Browser simulation');
    await expect(badges).toContainText('Requires API key');
  });

  test('privacy page loads', async ({ page }) => {
    await page.goto('/privacy');
    await expect(page.getByRole('heading', { name: 'Privacy & trust' })).toBeVisible();
  });

  test('unknown routes show a 404 page', async ({ page }) => {
    await page.goto('/no-such-place');
    await expect(page.getByText('404')).toBeVisible();
  });
});
