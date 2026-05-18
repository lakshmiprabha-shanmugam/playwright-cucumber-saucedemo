Feature: Sort Products

  Background:
    Given I am logged in as "standard_user" with password "secret_sauce"

  @smoke
  Scenario Outline: Sort products by option
    When I sort products by "<option>"
    Then the first product should be "<first_product>"
    And the last product should be "<last_product>"

    Examples:
      | option              | first_product                    | last_product                     |
      | Name (A to Z)       | Sauce Labs Backpack              | Test.allTheThings() T-Shirt (Red)      |
      | Name (Z to A)       | Test.allTheThings() T-Shirt (Red)      | Sauce Labs Backpack              |
      | Price (low to high) | Sauce Labs Onesie                | Sauce Labs Fleece Jacket         |
      | Price (high to low) | Sauce Labs Fleece Jacket         | Sauce Labs Onesie                |

  @regression
  Scenario: Default sort is Name A to Z
    Then the first product should be "Sauce Labs Backpack"
    And the last product should be "Test.allTheThings() T-Shirt (Red)"

  @regression
  Scenario Outline: Verify product count stays the same after sorting
    When I sort products by "<option>"
    Then there should be "6" products on the page

    Examples:
      | option              |
      | Name (A to Z)       |
      | Name (Z to A)       |
      | Price (low to high) |
      | Price (high to low) |