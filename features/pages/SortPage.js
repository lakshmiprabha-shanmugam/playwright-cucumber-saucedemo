export class SortPage {
  constructor(page) {
    this.page = page;

    this.sortDropdown     = page.locator('[data-test="product-sort-container"]');
    this.productNames     = page.locator('.inventory_item_name');
    this.productPrices    = page.locator('.inventory_item_price');
    this.inventoryItems   = page.locator('.inventory_item');
  }

  // ─── Actions ──────────────────────────────────────────────────────────────

  async sortBy(option) {
    await this.sortDropdown.waitFor({ state: 'visible' });
    await this.sortDropdown.selectOption({ label: option });
  }

  // ─── Helpers ──────────────────────────────────────────────────────────────

  async getFirstProductName() {
    return await this.productNames.first().innerText();
  }

  async getLastProductName() {
    return await this.productNames.last().innerText();
  }

  async getProductCount() {
    return await this.inventoryItems.count();
  }

  async getAllProductNames() {
    return await this.productNames.allInnerTexts();
  }

  async getAllProductPrices() {
    const priceTexts = await this.productPrices.allInnerTexts();
    // Strip "$" and convert to numbers for comparison
    return priceTexts.map(p => parseFloat(p.replace('$', '')));
  }
}