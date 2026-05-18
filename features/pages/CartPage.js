export class CartPage {

    constructor(page) {
        this.page = page;
        //Invent (product) page locator
        this.cartBadge = page.locator(".shopping_cart_badge")
        this.cartIcon = page.locator(".shopping_cart_link")
        this.inventoryItems = page.locator(".inventory_item")
        //Cart page locators
        this.cartItems = page.locator(".cart_item")
        this.cartItemsNames = page.locator(".inventory_item_name")
        this.continueShoppingBtn = page.locator("#continue-shopping")
    }

    //Helpers
    /**
      * Returns the "Add to cart" / "Remove" button for a product by its visible name.
      * Works on the inventory page only.
      */
    getButtonForProduct(productName) {
        return this.inventoryItems
            .filter({ hasText: productName })
            .locator('button')
    }

    /**
       * Returns a cart item row by product name (cart page).
       */
    getCartItemByName(productName) {
        return this.cartItems
            .filter({ hasText: productName });

    }
    // ─── Actions ──────────────────────────────────────────────────────────────

    async addToCart(productName) {
        const btn = this.getButtonForProduct(productName);
        await btn.waitFor({ state: 'visible' })
        await btn.click();
    }
    async removeFromProductList(productName) {
        const btn = this.getButtonForProduct(productName);
        await btn.waitFor({ state: 'visible' });
        await btn.click();
    }
    async goToCart() {
        await this.cartIcon.click();
    }

    async goBackToProducts() {
        await this.continueShoppingBtn.click();

    }

}

