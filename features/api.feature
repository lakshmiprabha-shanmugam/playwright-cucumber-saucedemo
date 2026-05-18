Feature: API Testing with Playwright

  @api @smoke
  Scenario: Get a single user successfully
    When I send a GET request to "/users/2"
    Then the response status should be 200
    And the response should contain user id 2
    And the response should contain email "janet.weaver@reqres.in"

  @api @smoke
  Scenario: Get list of users
    When I send a GET request to "/users?page=1"
    Then the response status should be 200
    And the response should have 6 users in the list
    And the response total should be 12

  @api @regression
  Scenario: Get a user that does not exist
    When I send a GET request to "/users/999"
    Then the response status should be 404

  @api @smoke
  Scenario: Create a new user
    When I send a POST request to "/users" with body:
      """
      {
        "name": "John Doe",
        "job": "QA Engineer"
      }
      """
    Then the response status should be 201
    And the response should contain name "John Doe"
    And the response should contain job "QA Engineer"
    And the response should have an id

  @api @regression
  Scenario: Update a user with PUT
    When I send a PUT request to "/users/2" with body:
      """
      {
        "name": "Jane Doe",
        "job": "Senior QA Engineer"
      }
      """
    Then the response status should be 200
    And the response should contain name "Jane Doe"
    And the response should contain job "Senior QA Engineer"
    And the response should have an updatedAt field

  @api @regression
  Scenario: Update a user with PATCH
    When I send a PATCH request to "/users/2" with body:
      """
      {
        "job": "Lead QA Engineer"
      }
      """
    Then the response status should be 200
    And the response should contain job "Lead QA Engineer"

  @api @regression
  Scenario: Delete a user
    When I send a DELETE request to "/users/2"
    Then the response status should be 204

  @api @regression
  Scenario: Register a user successfully
    When I send a POST request to "/register" with body:
      """
      {
        "email": "eve.holt@reqres.in",
        "password": "pistol"
      }
      """
    Then the response status should be 200
    And the response should have a token

  @api @regression
  Scenario: Register fails without password
    When I send a POST request to "/register" with body:
      """
      {
        "email": "eve.holt@reqres.in"
      }
      """
    Then the response status should be 400
    And the response error should be "Missing password"