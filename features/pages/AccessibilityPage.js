import { injectAxe } from 'axe-playwright';

export class AccessibilityPage {
  constructor(page) {
    this.page = page;
  }

  // ─── Inject axe-core into the page ────────────────────────────────────────

  async injectAxe() {
    await injectAxe(this.page);
  }

  // ─── Run full Section 508 audit ───────────────────────────────────────────

  async checkAccessibility(options = {}) {
    await injectAxe(this.page);

    const defaultOptions = {
      runOnly: {
        type: 'tag',
        // section508 — US federal standard
        // wcag2a, wcag2aa — international standard (covers most of 508)
        values: ['section508', 'wcag2a', 'wcag2aa'],
      },
      // Collect all violations, don't throw immediately
      resultTypes: ['violations'],
    };

    const results = await this.page.evaluate(
      async (opts) => {
        return await window.axe.run(document, opts);
      },
      { ...defaultOptions, ...options }
    );

    return results.violations;
  }

  // ─── Format violations for readable output ────────────────────────────────

  formatViolations(violations) {
    if (violations.length === 0) return 'No violations found';

    return violations.map(v => {
      const nodes = v.nodes.map(n =>
        `    Element : ${n.target}\n    HTML    : ${n.html}\n    Fix     : ${n.failureSummary}`
      ).join('\n\n');

      return [
        `Rule    : ${v.id}`,
        `Impact  : ${v.impact.toUpperCase()}`,
        `Desc    : ${v.description}`,
        `Help    : ${v.helpUrl}`,
        `Nodes   :\n${nodes}`,
      ].join('\n');
    }).join('\n\n─────────────────────────────────\n\n');
  }

  // ─── Specific 508 checks ──────────────────────────────────────────────────

  async checkImagesHaveAltText() {
    const images = await this.page.locator('img').all();
    const violations = [];

    for (const img of images) {
      const alt = await img.getAttribute('alt');
      const src = await img.getAttribute('src');
      if (alt === null || alt === undefined) {
        violations.push(`Image missing alt attribute: ${src}`);
      }
    }
    return violations;
  }

  async checkKeyboardNavigation(selectors) {
    const results = [];
    for (const selector of selectors) {
      await this.page.focus(selector);
      const focused = await this.page.evaluate((sel) => {
        return document.activeElement.matches(sel);
      }, selector);
      results.push({ selector, focusable: focused });
    }
    return results;
  }

  async checkHeadingStructure() {
    return await this.page.evaluate(() => {
      const headings = Array.from(document.querySelectorAll('h1, h2, h3, h4, h5, h6'));
      return headings.map(h => ({
        level: h.tagName,
        text : h.innerText.trim(),
      }));
    });
  }

  async getPageTitle() {
    return await this.page.title();
  }
}