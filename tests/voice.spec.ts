import { expect, test } from '@playwright/test';
import { noOops, openFresh, tap } from './helpers';

test('the voice warm-up runs through every stage', async ({ page }) => {
  const errs = await openFresh(page);
  await tap(page, '#navWarm');
  await tap(page, '#startvoice');
  let stages = 0;
  while ((await page.locator('[data-vnext="good"]').count()) && stages < 10) {
    if (await page.locator('#vtoggle').count()) {
      await tap(page, '#vtoggle');
      await expect(page.locator('#vphase')).not.toHaveClass(/idle/);
      await tap(page, '#vup');
      await tap(page, '#vtoggle');
    }
    await tap(page, '[data-vnext="good"]');
    stages++;
  }
  expect(stages).toBeGreaterThan(3);
  await expect(page.getByRole('heading', { name: 'Voice warm-up done' })).toBeVisible();
  await noOops(page);
  expect(errs).toEqual([]);
});

test('the range finder finds a range and keeps it', async ({ page }) => {
  const errs = await openFresh(page);
  await tap(page, '#navWarm');
  await tap(page, '[data-go="range"]');
  for (let i = 0; i < 4; i++) {
    await tap(page, '[data-rf="ok"]');
  }
  await tap(page, '[data-rf="no"]');
  for (let i = 0; i < 9; i++) {
    await tap(page, '[data-rf="ok"]');
  }
  await tap(page, '[data-rf="no"]');
  await expect(page.locator('#rfsave')).toBeVisible();
  await tap(page, '#rfsave');
  await expect(page.locator('.bar .tick').filter({ hasText: '–' }).first()).toHaveText('A2 – D♯4');
  await noOops(page);
  expect(errs).toEqual([]);
});
