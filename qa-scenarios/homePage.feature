Feature: HomePage features

  Scenario: Verify homepage content
    Given I go to home page
    When I click on the "Get Your 90-Day..." button
    Then I should see youtube video
