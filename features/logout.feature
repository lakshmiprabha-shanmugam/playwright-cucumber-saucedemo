@logout
Feature: Logout

  Background:
    Given I am logged in as "standard_user" with password "secret_sauce"

  @smoke
  Scenario: Successful logout
    When I open the burger menu
    And I click logout
    Then I should be redirected to the login page

  @regression
  Scenario: Cannot access inventory after logout
    When I open the burger menu
    And I click logout
    And I try to access the inventory page directly
    Then I should be redirected to the login page