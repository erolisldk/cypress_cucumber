Feature: HomePage features

  Scenario: Verify homepage content
    Given I go to home page
    When I enter "Admin" in username field
    And I enter "admin123" in password field
    # And I enter 123 in password field
    And I click on login button
    Then I should logged in and redirected to dashboard page
  
  Scenario: Verify invalid login
    Given I am in login page
    When I enter invalid username and password
	And I click on login button
    Then I should see invalid credentials message