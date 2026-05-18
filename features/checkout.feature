Feature: Checkout

  Background:
    Given I am logged in as "standard_user" with password "secret_sauce"

  @smoke
  Scenario: Complete a purchase successfully
    When I add "Sauce Labs Backpack" to the cart
    And I go to the cart
    And I proceed to checkout
    And I enter first name "John" last name "Doe" zip "10001"
    And I click continue
    And I click finish
    Then I should see "Thank you for your order!"

  @regression
  Scenario: Checkout with missing first name
    When I add "Sauce Labs Backpack" to the cart
    And I go to the cart
    And I proceed to checkout
    And I enter first name "" last name "Doe" zip "10001"
    And I click continue
    Then I should see checkout error "First Name is required"

  @regression
  Scenario: Checkout with missing last name
    When I add "Sauce Labs Backpack" to the cart
    And I go to the cart
    And I proceed to checkout
    And I enter first name "John" last name "" zip "10001"
    And I click continue
    Then I should see checkout error "Last Name is required"

  @regression
  Scenario: Checkout with missing zip code
    When I add "Sauce Labs Backpack" to the cart
    And I go to the cart
    And I proceed to checkout
    And I enter first name "John" last name "Doe" zip ""
    And I click continue
    Then I should see checkout error "Postal Code is required"

  @regression
  Scenario: Verify order summary before finishing
    When I add "Sauce Labs Backpack" to the cart
    And I go to the cart
    And I proceed to checkout
    And I enter first name "John" last name "Doe" zip "10001"
    And I click continue
    Then I should see "Sauce Labs Backpack" in the order summary
    And I should see the payment information
    And I should see the total price