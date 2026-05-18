Feature: Product Detail Page

  Background:
    Given I am logged in as "standard_user" with password "secret_sauce"

  @smoke
  Scenario: View product detail page
    When I click on product "Sauce Labs Backpack"
    Then I should be on the product detail page
    And the product name should be "Sauce Labs Backpack"
    And the product price should be "$29.99"
    And I should see a product description

  @smoke
  Scenario: Navigate back to products page from detail page
    When I click on product "Sauce Labs Backpack"
    And I click the back button
    Then I should be on the products page

  @regression
  Scenario: Add product to cart from detail page
    When I click on product "Sauce Labs Backpack"
    And I add the product to cart from detail page
    Then the cart badge should show "1"
    And the button should say "Remove"

  @regression
  Scenario: Remove product from cart on detail page
    When I click on product "Sauce Labs Backpack"
    And I add the product to cart from detail page
    And I remove the product from cart on detail page
    Then the cart badge should not be visible
    And the button should say "Add to cart"

  @regression
  Scenario Outline: Verify details of multiple products
    When I click on product "<product>"
    Then the product name should be "<product>"
    And the product price should be "<price>"

    Examples:
      | product                  | price   |
      | Sauce Labs Backpack      | $29.99  |
      | Sauce Labs Bike Light    | $9.99   |
      | Sauce Labs Bolt T-Shirt  | $15.99  |
      | Sauce Labs Fleece Jacket | $49.99  |
      | Sauce Labs Onesie        | $7.99   |