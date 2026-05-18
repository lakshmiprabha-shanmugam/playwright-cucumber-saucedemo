Feature: Shopping Cart

Background:
    Given I am logged in as "standard_user" with password "secret_sauce"

@smoke
Scenario: Add single item to cart
    When I add "Sauce Labs Backpack" to the cart
    Then the cart badge should show "1"
    Then the button for "Sauce Labs Backpack" should say "Remove"

@smoke
Scenario: Add multiple item to cart
    When I add "Sauce Labs Backpack" to the cart
    And I add "Sauce Labs Bike Light" to the cart
    Then the cart badge should show "2"

@regression
Scenario: Remove an item using the Remove button on product list
    When I add "Sauce Labs Backpack" to the cart
   And I remove "Sauce Labs Backpack" from the product list
    Then the cart button should not be visible
    And the button for "Sauce Labs Backpack" should say "Add to cart"
    
@regression
Scenario: Cart persists after navigating away
    When I add "Sauce Labs Backpack" to the cart
    And I navigate to the cart page
    And I go back to the product page
    Then the cart badge should show "1"
