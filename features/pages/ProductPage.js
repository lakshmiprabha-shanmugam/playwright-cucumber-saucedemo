export class ProductPage {
  constructor(page) {
    this.page = page;

    // Inventory (products list) page
    this.productItems    = page.locator('.inventory_item');
    this.pageTitle       = page.locator('.title');

    // Product detail page
    this.detailName      = page.locator('.inventory_details_name');
    this.detailPrice     = page.locator('.inventory_details_price');
    this.detailDesc      = page.locator('.inventory_details_desc');
    this.detailImage     = page.locator('.inventory_details_img');
    this.addToCartBtn    = page.locator('[data-test^="add-to-cart"]');
    this.removeBtn       = page.locator('[data-test^="remove"]');
    this.backButton      = page.locator('[data-test="back-to-products"]');

    // Cart badge — shared across pages
    this.cartBadge       = page.locator('.shopping_cart_badge');
  }

  // ─── Actions ──────────────────────────────────────────────────────────────

  async clickProduct(productName) {
    await this.productItems
      .filter({ hasText: productName })
      .locator('.inventory_item_name')
      .click();
  }

  async clickBackButton() {
    await this.backButton.waitFor({ state: 'visible' });
    await this.backButton.click();
  }

  async addToCartFromDetail() {
    await this.addToCartBtn.waitFor({ state: 'visible' });
    await this.addToCartBtn.click();
  }

  async removeFromCartOnDetail() {
    await this.removeBtn.waitFor({ state: 'visible' });
    await this.removeBtn.click();
  }
}