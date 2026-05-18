@accessibility
Feature: Section 508 Accessibility

  Background:
    Given I am on the login page

  @accessibility @smoke
  Scenario: Login page has no accessibility violations
    Then the page should have no accessibility violations

  @accessibility @smoke
  Scenario: Products page has no accessibility violations
    Given I am logged in as "standard_user" with password "secret_sauce"
    Then the page should have no accessibility violations

  @accessibility @regression
  Scenario: Cart page has no accessibility violations
    Given I am logged in as "standard_user" with password "secret_sauce"
    When I add "Sauce Labs Backpack" to the cart
    And I navigate to the cart page
    Then the page should have no accessibility violations

  @accessibility @regression
  Scenario: Checkout page has no accessibility violations
    Given I am logged in as "standard_user" with password "secret_sauce"
    When I add "Sauce Labs Backpack" to the cart
    And I go to the cart
    And I proceed to checkout
    Then the page should have no accessibility violations

  @accessibility @regression
  Scenario: Product detail page has no accessibility violations
    Given I am logged in as "standard_user" with password "secret_sauce"
    When I click on product "Sauce Labs Backpack"
    Then the page should have no accessibility violations

  @accessibility @regression
  Scenario: Login page keyboard navigation works
    Then I should be able to tab through the login form
    And the username field should be focusable
    And the password field should be focusable
    And the login button should be focusable

  @accessibility @regression
  Scenario: Images have alt text on products page
    Given I am logged in as "standard_user" with password "secret_sauce"
    Then all images should have alt text

  @accessibility @regression
  Scenario: Page has correct heading structure
    Given I am logged in as "standard_user" with password "secret_sauce"
    Then the page should have a main heading