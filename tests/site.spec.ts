import { expect, test } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.route('https://unpkg.com/@elevenlabs/convai-widget-embed', route => route.fulfill({
    contentType: 'text/javascript',
    body: `customElements.define('elevenlabs-convai', class extends HTMLElement {
      connectedCallback() {
        const root = this.attachShadow({mode: 'open'});
        setTimeout(() => {
          if (!this.isConnected) return;
          const launch = document.createElement('button');
          launch.textContent = 'Call Mike';
          launch.className = 'rounded-compact-sheet';
          launch.onclick = () => {
            const overlay = document.createElement('div');
            overlay.className = 'overlay';
            overlay.style.cssText = 'position:fixed;inset:0;z-index:100;background:#0005';
            overlay.innerHTML = '<section role="dialog" aria-label="Calling assistant"><button>End Conversation</button><p>Ready to call</p></section>';
            root.append(overlay);
          };
          root.append(launch);
        }, 350);
      }
    });`,
  }));
});

for (const width of [320, 375, 430, 700, 768, 980, 1024, 1440]) {
  test(`layout and CTA remain contained at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto('/');
    const sizes = await page.evaluate(() => {
      const card = document.querySelector('.roofing-assistant-card')!.getBoundingClientRect();
      const button = document.querySelector('.agent-call')!.getBoundingClientRect();
      const label = document.querySelector('.agent-button-label')!.getBoundingClientRect();
      return { pageWidth: document.documentElement.scrollWidth, viewport: innerWidth, cardRight: card.right,
        buttonRight: button.right, labelRight: label.right, buttonLeft: button.left, labelLeft: label.left };
    });
    expect(sizes.pageWidth).toBeLessThanOrEqual(sizes.viewport + 1);
    expect(sizes.buttonRight).toBeLessThanOrEqual(sizes.cardRight);
    expect(sizes.labelRight).toBeLessThanOrEqual(sizes.buttonRight);
    expect(sizes.labelLeft).toBeGreaterThanOrEqual(sizes.buttonLeft);
  });
}

test('anchors, local assets, form validation and console', async ({ page, request }) => {
  const errors: string[] = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.goto('/');
  const brokenAnchors = await page.locator('a[href^="#"]').evaluateAll(links => links
    .map(link => link.getAttribute('href')!.slice(1)).filter(id => !document.getElementById(id)));
  expect(brokenAnchors).toEqual([]);
  for (const path of ['/roofing-hero.jpg', '/empire-state-roofing-logo.png', '/og.png', '/icon.png', '/apple-icon.png']) {
    expect((await request.get(path)).ok(), path).toBeTruthy();
  }
  expect(await page.locator('form').evaluate(form => (form as HTMLFormElement).checkValidity())).toBe(false);
  await page.getByLabel('Full name').fill('Test Visitor');
  await page.getByLabel('Phone number').fill('2125550173');
  await page.getByLabel('Email address').fill('test@example.com');
  await page.getByLabel('ZIP code').fill('10001');
  await page.getByLabel('How can we help?').selectOption('Roof Repair');
  expect(await page.locator('form').evaluate(form => (form as HTMLFormElement).checkValidity())).toBe(true);
  expect(errors).toEqual([]);
});

for (const closeWith of ['escape', 'outside', 'close button'] as const) {
  test(`assistant opens and closes using ${closeWith}`, async ({ page }) => {
    await page.goto('/');
    const trigger = page.getByRole('button', { name: 'Call Mike — Our AI Roofing Assistant', exact: true });
    await trigger.click();
    await expect(page.getByRole('dialog', { name: 'Calling assistant' })).toBeVisible();
    if (closeWith === 'escape') await page.keyboard.press('Escape');
    else if (closeWith === 'outside') await page.locator('elevenlabs-convai .overlay').click({ position: { x: 5, y: 5 } });
    else await page.getByRole('button', { name: 'Close calling assistant' }).click();
    await expect(page.getByRole('dialog', { name: 'Calling assistant' })).toHaveCount(0);
    await expect(trigger).toBeFocused();
    await trigger.click();
    await expect(page.getByRole('dialog', { name: 'Calling assistant' })).toBeVisible();
  });
}

test('desktop depth responds to the pointer without breaking controls or overflowing', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto('/');
  const card = page.locator('.roofing-assistant-card');
  const initialPosition = await card.boundingBox();
  await card.hover({ position: { x: 35, y: 35 } });
  await expect(card).toHaveAttribute('data-depth-active', 'true');
  await expect.poll(() => card.evaluate(element => getComputedStyle(element).transform)).not.toBe('matrix(1, 0, 0, 1, 0, 0)');
  expect(await card.evaluate(element => element.scrollWidth <= element.clientWidth)).toBe(true);
  await page.getByRole('button', { name: 'Call Mike — Our AI Roofing Assistant', exact: true }).click();
  await expect(page.getByRole('dialog', { name: 'Calling assistant' })).toBeVisible();
  await page.keyboard.press('Escape');
  await page.mouse.move(1, 1);
  await expect(card).not.toHaveAttribute('data-depth-active');
  await expect.poll(async () => Math.abs((await card.boundingBox())!.y - initialPosition!.y)).toBeLessThan(1);

  for (const selector of ['.service-card', '.why-visual', '.problem-grid article', '.process-grid article', '.review-grid blockquote', '.area-list > div']) {
    const surface = page.locator(selector).first();
    await surface.hover({ position: { x: 30, y: 30 } });
    await expect(surface).toHaveAttribute('data-depth-active', 'true');
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBe(true);
  }
});

test('reduced motion disables depth and responds when the preference changes', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto('/');
  const card = page.locator('.roofing-assistant-card');
  await card.hover({ position: { x: 30, y: 30 } });
  await expect(card).toHaveAttribute('data-depth-active', 'true');
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await expect(card).not.toHaveAttribute('data-depth-active');
  expect(await card.evaluate(element => getComputedStyle(element).transform)).toBe('none');
  expect(await page.locator('.hero-image').evaluate(element => getComputedStyle(element).transform)).toBe('none');
  await page.getByRole('button', { name: 'Call Mike — Our AI Roofing Assistant', exact: true }).click();
  await expect(page.getByRole('dialog', { name: 'Calling assistant' })).toBeVisible();
  await page.keyboard.press('Escape');
});

test.describe('touch devices', () => {
  test.use({ hasTouch: true, isMobile: true });
  for (const width of [390, 820]) {
    test(`touch at ${width}px keeps the panel still and controls usable`, async ({ page }) => {
      await page.setViewportSize({ width, height: 1000 });
      await page.goto('/');
      const card = page.locator('.roofing-assistant-card');
      await card.scrollIntoViewIfNeeded();
      await card.tap({ position: { x: 25, y: 25 } });
      await expect(card).not.toHaveAttribute('data-depth-active');
      expect(await card.evaluate(element => getComputedStyle(element).transform)).toBe('none');
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBe(true);
      await page.getByRole('button', { name: 'Call Mike — Our AI Roofing Assistant', exact: true }).tap();
      await expect(page.getByRole('dialog', { name: 'Calling assistant' })).toBeVisible();
      await page.getByRole('button', { name: 'Close calling assistant' }).tap();
      await expect(page.getByRole('dialog', { name: 'Calling assistant' })).toHaveCount(0);
      await page.getByLabel('Full name').fill('Test Visitor');
      await expect(page.getByLabel('Full name')).toHaveValue('Test Visitor');
    });
  }
});

test('one roofing background follows a reversible scroll path without shifting content', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto('/');
  const scene = page.locator('.roof-scroll-scene');
  const camera = scene.locator('.roof-scroll-camera');
  await expect(scene).toHaveCount(1);
  const transformations: string[] = [];
  let firstScroll = 0;
  for (const [index, selector] of ['.services-section', '.process-section', '.areas-section'].entries()) {
    await page.locator(selector).scrollIntoViewIfNeeded();
    await expect(scene).toHaveAttribute('data-visible', 'true');
    await page.waitForTimeout(300);
    if (index === 0) firstScroll = await page.evaluate(() => scrollY);
    transformations.push(await camera.evaluate(element => getComputedStyle(element).transform));
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(1440);
    expect(await scene.evaluate(element => getComputedStyle(element).pointerEvents)).toBe('none');
  }
  expect(new Set(transformations).size).toBe(3);
  await page.evaluate(top => window.scrollTo({ top, behavior: 'instant' }), firstScroll);
  await page.waitForTimeout(350);
  expect(await camera.evaluate(element => getComputedStyle(element).transform)).toBe(transformations[0]);
  const content = page.locator('.service-grid');
  const before = await content.boundingBox();
  await scene.evaluate(element => { element.style.display = 'none'; });
  expect(await content.boundingBox()).toEqual(before);
});

test('reduced-motion roofing backdrop stays still across light sections', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  const camera = page.locator('.roof-scroll-camera');
  await page.locator('.services-section').scrollIntoViewIfNeeded();
  const first = await camera.evaluate(element => getComputedStyle(element).transform);
  await page.locator('.areas-section').scrollIntoViewIfNeeded();
  expect(await camera.evaluate(element => getComputedStyle(element).transform)).toBe(first);
});

test('phone background uses a small pan and omits the foreground layer', async ({ browser }) => {
  const context = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
  const page = await context.newPage();
  await page.goto('http://127.0.0.1:3001');
  await page.locator('.services-section').scrollIntoViewIfNeeded();
  const camera = page.locator('.roof-scroll-camera');
  const first = await camera.boundingBox();
  await expect(page.locator('.roof-scroll-foreground')).toBeHidden();
  await page.locator('.areas-section').scrollIntoViewIfNeeded();
  await page.waitForTimeout(100);
  const last = await camera.boundingBox();
  expect(Math.abs(last!.y - first!.y)).toBeLessThanOrEqual(24);
  expect(last!.width).toBe(first!.width);
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(390);
  await context.close();
});
