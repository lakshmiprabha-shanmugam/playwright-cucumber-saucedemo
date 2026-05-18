Feature: Login to SauceDemo

Background:
    Given I am on the login page

@smoke
Scenario: Successful login

    When I enter username "standard_user"
    And I enter password "secret_sauce"
    And I click on login button
    Then user should see the products page

@regression
Scenario: Login with empty credentials
    When I enter username ""
    And I enter password ""
    And I click on login button
    Then user should see the error "Username is required"   


Scenario: Login without username
    When I enter username ""
    And I enter password "secret_sauce"
    And I click on login button
    Then user should see the error "Username is required"


Scenario: Login without password
    When I enter username "standard_user"
    And I enter password ""
    And I click on login button
    Then user should see the error "Password is required"

Scenario: Login with invalid credentials
    When I enter username "standard_uer"
    And I enter password "secret_sauce"
    And I click on login button
    Then user should see the error "Username and password do not match any user in this service"

