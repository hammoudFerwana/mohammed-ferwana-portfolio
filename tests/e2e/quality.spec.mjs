import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const OK_ROUTES = [
  '/',
  '/projects',
  '/projects/insurflow',
  '/projects/teamline',
  '/about',
  '/experience',
  '/contact',
];

const NOT_FOUND_ROUTES = [
  '/projects/saios-academy',
  '/projects/pal-store',
  '/does-not-exist',
];

const ALL_ROUTES = [...OK_ROUTES, ...NOT_FOUND_ROUTES];

const VIEWPORTS = [
  { name: 'mobile', width: 390, height: 844 },
  { name: 'desktop', width: 1440, height: 900 },
];

const THEMES = ['dark', 'light'];

async function collectHiddenTextFailures(page) {
  return page.evaluate(() => {
    const failures = [];
    const elements = document.querySelectorAll('body *');
    for (const el of elements) {
      const tag = el.tagName;
      if (tag === 'SCRIPT' || tag === 'STYLE' || tag === 'NOSCRIPT' || tag === 'SVG' || el.closest('svg') || el.closest('[aria-hidden="true"]')) {
        continue;
      }

      const hasDirectText = Array.from(el.childNodes).some(
        (node) => node.nodeType === Node.TEXT_NODE && node.textContent.trim().length > 0
      );
      if (!hasDirectText) continue;

      const style = getComputedStyle(el);
      if (style.display === 'none' || style.visibility === 'hidden') continue;
      if (el.closest(':disabled, [aria-disabled="true"]')) continue;

      const rect = el.getBoundingClientRect();
      if (rect.width <= 1 || rect.height <= 1) continue;

      // Skip screen-reader-only visually hidden clips (e.g. .sr-only)
      if (style.clip === 'rect(0px, 0px, 0px, 0px)' || style.clipPath === 'inset(50%)') {
        continue;
      }

      let node = el;
      let minOpacity = 1;
      while (node && node !== document.documentElement) {
        const op = parseFloat(getComputedStyle(node).opacity);
        if (!Number.isNaN(op) && op < minOpacity) {
          minOpacity = op;
        }
        node = node.parentElement;
      }

      if (minOpacity <= 0.9) {
        failures.push({
          tag: tag.toLowerCase(),
          text: el.textContent.trim().slice(0, 60),
          opacity: minOpacity,
        });
      }
    }
    return failures;
  });
}

test.describe('Portfolio quality gates', () => {
  for (const theme of THEMES) {
    for (const viewport of VIEWPORTS) {
      test.describe(`${theme} theme @ ${viewport.width}x${viewport.height}`, () => {
        test.use({ viewport: { width: viewport.width, height: viewport.height } });

        for (const route of ALL_ROUTES) {
          const is404Route = NOT_FOUND_ROUTES.includes(route);

          test(`${route} passes overflow, network, console, axe, and reduced-motion checks`, async ({ page, baseURL }) => {
            const origin = new URL(baseURL).origin;
            const consoleErrors = [];
            const failedSameOrigin = [];

            page.on('console', (msg) => {
              if (msg.type() === 'error') {
                const isExpected404Console =
                  is404Route &&
                  msg.text().includes('404 (Not Found)') &&
                  (!msg.location()?.url || new URL(msg.location().url).pathname === route);
                if (!isExpected404Console) {
                  consoleErrors.push(msg.text());
                }
              }
            });
            page.on('pageerror', (err) => {
              consoleErrors.push(err.message);
            });
            page.on('requestfailed', (req) => {
              if (req.url().startsWith(origin)) {
                failedSameOrigin.push(`${req.method()} ${req.url()} (${req.failure()?.errorText || 'failed'})`);
              }
            });
            page.on('response', (res) => {
              const url = res.url();
              if (!url.startsWith(origin)) return;
              const isExpected404Doc =
                is404Route &&
                res.request().resourceType() === 'document' &&
                new URL(url).pathname === route &&
                res.status() === 404;
              if (!isExpected404Doc && res.status() >= 400) {
                failedSameOrigin.push(`${res.status()} ${url}`);
              }
            });

            await page.addInitScript((selectedTheme) => {
              localStorage.setItem('hz-theme', selectedTheme);
            }, theme);

            await page.emulateMedia({ reducedMotion: 'reduce' });

            const response = await page.goto(route, { waitUntil: 'load' });
            expect(response).not.toBeNull();
            expect(response.status()).toBe(is404Route ? 404 : 200);

            await page.evaluate(() => document.fonts.ready);
            await page.waitForTimeout(350);

            const appliedTheme = await page.evaluate(() => document.documentElement.dataset.theme);
            expect(appliedTheme).toBe(theme);

            // a. No horizontal overflow
            const overflow = await page.evaluate(() => ({
              scrollWidth: document.documentElement.scrollWidth,
              innerWidth: window.innerWidth,
            }));
            expect(
              overflow.scrollWidth,
              `Horizontal overflow on ${route} (${theme}, ${viewport.width}x${viewport.height})`
            ).toBeLessThanOrEqual(overflow.innerWidth);

            // d. Hidden-text check under reducedMotion: 'reduce'
            const hiddenText = await collectHiddenTextFailures(page);
            expect(hiddenText, `Hidden text elements on ${route}: ${JSON.stringify(hiddenText)}`).toEqual([]);

            // c. Axe accessibility scan (zero serious or critical violations)
            const axeResults = await new AxeBuilder({ page }).analyze();
            const seriousOrCritical = axeResults.violations.filter(
              (v) => v.impact === 'serious' || v.impact === 'critical'
            );
            expect(
              seriousOrCritical,
              `Axe serious/critical violations on ${route} (${theme}): ${JSON.stringify(
                seriousOrCritical.map((v) => ({ id: v.id, impact: v.impact, nodes: v.nodes.map((n) => n.html) })),
                null,
                2
              )}`
            ).toEqual([]);

            // b. Console errors and same-origin failed requests
            expect(consoleErrors, `Console errors on ${route}: ${consoleErrors.join('; ')}`).toEqual([]);
            expect(failedSameOrigin, `Failed same-origin requests on ${route}: ${failedSameOrigin.join('; ')}`).toEqual([]);
          });
        }
      });
    }
  }

  test('internal links across all 200 routes return 200', async ({ page, request, baseURL }) => {
    const origin = new URL(baseURL).origin;
    const internalPaths = new Set();

    for (const route of OK_ROUTES) {
      await page.goto(route, { waitUntil: 'domcontentloaded' });
      const hrefs = await page.evaluate(() =>
        Array.from(document.querySelectorAll('a[href]')).map((a) => a.getAttribute('href'))
      );

      for (const href of hrefs) {
        if (!href || href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('tel:')) {
          continue;
        }
        if (href.startsWith('/')) {
          const clean = href.split('#')[0] || '/';
          internalPaths.add(clean);
        } else if (href.startsWith(origin)) {
          const parsed = new URL(href);
          internalPaths.add(parsed.pathname || '/');
        }
      }
    }

    expect(internalPaths.size).toBeGreaterThan(0);

    for (const pathname of internalPaths) {
      const res = await request.get(pathname);
      expect(res.status(), `Internal link ${pathname} expected 200`).toBe(200);
    }
  });

  test('theme toggle switches data-theme and persists after reload', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.addInitScript(() => {
      if (!sessionStorage.getItem('hz-test-seeded')) {
        localStorage.removeItem('hz-theme');
        sessionStorage.setItem('hz-test-seeded', '1');
      }
    });

    await page.goto('/', { waitUntil: 'load' });
    const initialTheme = await page.evaluate(() => document.documentElement.dataset.theme);
    expect(['dark', 'light']).toContain(initialTheme);

    const toggleButton = page.locator('[data-theme-toggle]:visible').first();
    await expect(toggleButton).toBeVisible();
    await toggleButton.click();

    const expectedNext = initialTheme === 'dark' ? 'light' : 'dark';
    await expect.poll(() => page.evaluate(() => document.documentElement.dataset.theme)).toBe(expectedNext);
    const stored = await page.evaluate(() => localStorage.getItem('hz-theme'));
    expect(stored).toBe(expectedNext);

    await page.reload({ waitUntil: 'domcontentloaded' });
    const afterReload = await page.evaluate(() => document.documentElement.dataset.theme);
    expect(afterReload).toBe(expectedNext);
  });

  test('core routes render all visible text at opacity > 0.9 with JavaScript disabled', async ({ browser }) => {
    const context = await browser.newContext({
      javaScriptEnabled: false,
      viewport: { width: 1440, height: 900 },
    });
    const page = await context.newPage();
    try {
      for (const route of ['/', '/about', '/experience', '/projects']) {
        const res = await page.goto(route, { waitUntil: 'domcontentloaded' });
        expect(res?.status(), `Expected 200 for ${route} with JS disabled`).toBe(200);
        const hiddenText = await collectHiddenTextFailures(page);
        expect(
          hiddenText,
          `Hidden text with JS disabled on ${route}: ${JSON.stringify(hiddenText)}`
        ).toEqual([]);
      }
    } finally {
      await context.close();
    }
  });

  test('server HTML of / renders Mohammed Ferwana in h1 without inline opacity:0', async ({ request, browser }) => {
    const res = await request.get('/');
    expect(res.status()).toBe(200);
    const html = await res.text();
    expect(html).toMatch(/<h1[^>]*>[^<]*Mohammed Ferwana[^<]*<\/h1>/);

    const context = await browser.newContext({ javaScriptEnabled: false });
    const page = await context.newPage();
    try {
      await page.setContent(html, { waitUntil: 'domcontentloaded' });
      const h1Check = await page.evaluate(() => {
        const h1 = document.querySelector('h1');
        if (!h1) return { found: false, text: '', badAncestors: [] };
        const badAncestors = [];
        let node = h1;
        while (node && node !== document.documentElement) {
          const inlineStyle = node.getAttribute('style') || '';
          if (/opacity\s*:\s*0(?:\s*;|$)/i.test(inlineStyle)) {
            badAncestors.push({ tag: node.tagName.toLowerCase(), style: inlineStyle });
          }
          node = node.parentElement;
        }
        return {
          found: true,
          text: h1.textContent.trim(),
          badAncestors,
        };
      });

      expect(h1Check.found).toBe(true);
      expect(h1Check.text).toBe('Mohammed Ferwana');
      expect(h1Check.badAncestors).toEqual([]);
    } finally {
      await context.close();
    }
  });

  test('home hero displays live Gaza clock and Unsplash photo credit', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/', { waitUntil: 'load' });

    const clockTime = page.locator('[data-gaza-time]');
    await expect(clockTime).toBeVisible();
    await expect(clockTime).not.toHaveText('--:--');

    const displayedTime = (await clockTime.textContent())?.trim();
    const now = new Date();
    const formatter = new Intl.DateTimeFormat('en-GB', {
      timeZone: 'Asia/Gaza',
      hour: '2-digit',
      minute: '2-digit',
    });
    const currentGazaTime = formatter.format(now);
    const previousMinuteGazaTime = formatter.format(new Date(now.getTime() - 60_000));
    expect([currentGazaTime, previousMinuteGazaTime]).toContain(displayedTime);

    const creditLink = page.locator(
      'a[href="https://unsplash.com/photos/a-view-of-a-sunset-over-a-body-of-water-EMH4vCucw-A"]'
    );
    await expect(creditLink).toBeVisible();
    await expect(creditLink).toHaveAttribute('target', '_blank');
    await expect(creditLink).toHaveAttribute('rel', /noopener/);
  });

  test('contact form submits JSON payload to Formspree and shows success state', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    const capturedRequests = [];

    await page.route('https://formspree.io/f/myewyldg', async (route) => {
      const request = route.request();
      capturedRequests.push({
        method: request.method(),
        url: request.url(),
        body: request.postDataJSON(),
      });
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ ok: true }),
      });
    });

    await page.goto('/contact', { waitUntil: 'load' });
    await page.fill('#contact-name', 'Alex Recruiter');
    await page.fill('#contact-email', 'alex@example.com');
    await page.fill('#contact-subject', 'Backend Engineer Role');
    await page.fill('#contact-message', 'Hello Mohammed, we would like to schedule an interview.');

    const submitButton = page.locator('button[type="submit"]');
    await expect(submitButton).toBeEnabled();
    await submitButton.click();

    await expect(page.getByText('Message delivered successfully!')).toBeVisible();
    expect(capturedRequests).toHaveLength(1);
    expect(capturedRequests[0].method).toBe('POST');
    expect(capturedRequests[0].url).toBe('https://formspree.io/f/myewyldg');
    expect(capturedRequests[0].body).toEqual({
      name: 'Alex Recruiter',
      email: 'alex@example.com',
      subject: 'Backend Engineer Role',
      message: 'Hello Mohammed, we would like to schedule an interview.',
    });
  });
});
