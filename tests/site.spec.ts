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
