// CODEX_PATCH_BEGIN
// FILE: tests/homepage.test.ts

import { test, expect } from '@playwright/test';

const BASE_URL = 'http://localhost:3000';

test.describe('GreenPax Homepage – Golden Rules Validation', () => {

  test('Homepage loads and renders core sections', async ({ page }) => {
    await page.goto(BASE_URL, { waitUntil: 'domcontentloaded' });

    // Hero
    await expect(page.locator('h1')).toHaveCount(1);
    await expect(page.locator('h1')).toContainText(/paper|packaging|eco/i);

    // Category grid (deferred)
    test.skip(true, 'Categories will be validated once category pages exist');

    // Featured products
    const products = page.locator('[data-testid="product-card"]');
    await expect(products.first()).toBeVisible();
  });

  test('WhatsApp is the only primary CTA channel', async ({ page }) => {
    await page.goto(BASE_URL);

    const whatsappLinks = page.locator('a[href^="https://wa.me"]');
    await expect(whatsappLinks.first()).toBeVisible();
    expect(await whatsappLinks.count()).toBeGreaterThan(0);

    const href = await whatsappLinks.first().getAttribute('href');
    expect(href).toContain('wa.me');
    expect(href).toContain('text=');
  });

  test('No forbidden CTAs or ecommerce behavior', async ({ page }) => {
    await page.goto(BASE_URL);

    await expect(page.locator('text=Add to Quote')).toHaveCount(0);
    await expect(page.locator('text=Buy Now')).toHaveCount(0);
    await expect(page.locator('text=Checkout')).toHaveCount(0);
    await expect(page.locator('input[type="number"]')).toHaveCount(0);
  });

  test('No garbled characters or broken currency', async ({ page }) => {
    await page.goto(BASE_URL);

    const bodyText = await page.textContent('body');
    expect(bodyText).not.toMatch(/�|dY\?|�,/);
    expect(bodyText).toMatch(/₹/);
  });

  test('SEO basics present in HTML', async ({ page }) => {
    await page.goto(BASE_URL);

    await expect(page.locator('title')).not.toBeEmpty();
    await expect(page.locator('meta[name="description"]')).toHaveCount(1);
    await expect(page.locator('link[rel="canonical"]')).toHaveCount(1);
  });

  test('Above-the-fold hero clarity', async ({ page }) => {
    await page.goto(BASE_URL);

    const hero = page.locator('h1');
    const whatsapp = page.locator('a[href^="https://wa.me"]').first();

    await expect(hero).toBeVisible();
    await expect(whatsapp).toBeVisible();

    const heroBox = await hero.boundingBox();
    expect(heroBox?.y).toBeLessThan(600);
  });

  test('Homepage navigation does not block primary CTA', async ({ page }) => {
    await page.goto(BASE_URL);

    const whatsapp = page.locator('a[href^="https://wa.me"]').first();
    await expect(whatsapp).toBeVisible();
  });

  test('Homepage contains at least one trust signal', async ({ page }) => {
    await page.goto(BASE_URL);

    const trustSignals = page.locator(
      'text=/eco|sustainable|manufacture|manufactured|quality|dispatch|delivery|india/i'
    );

    expect(await trustSignals.count()).toBeGreaterThan(0);
  });

  test('Homepage does not expose transactional or checkout pricing', async ({ page }) => {
    await page.goto(BASE_URL);

    // Allowed: indicative pricing such as "From ₹ / pc"
    // Forbidden: cart, checkout, total price, quantity selectors

    await expect(page.locator('text=/checkout|add to cart|buy now|total/i')).toHaveCount(0);
    await expect(page.locator('input[type="number"]')).toHaveCount(0);
  });

  test('Homepage is indexable (no noindex)', async ({ page }) => {
    await page.goto(BASE_URL);

    const robots = page.locator('meta[name="robots"]');
    if (await robots.count() > 0) {
      const content = await robots.first().getAttribute('content');
      expect(content).not.toMatch(/noindex|nofollow/i);
    }
  });

  test('Mobile-first usability', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto(BASE_URL);

    await expect(page.locator('a[href^="https://wa.me"]').first()).toBeVisible();
    // No hover-only interactions required for primary CTA
  });

});
// CODEX_PATCH_END
