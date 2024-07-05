Feature: Analytic Events

  Background: Load landing page
    Given I intercept sdk-config request of "MockAirport" and enable Web SDK events and set timeouts
    Given I open Web SDK in "MockAirport" environment
    Given I should verify starting events are fired
    Given I click on "Boston Logan Airport" on the map

  @WSDK-1 #(start sdk, use sdk session timeout, poi-interaction, display-map)
  Scenario:  As a Web SDK user, I should verify start-sdk, use-sdk, display-map, poi-interaction,change-language events are fired with relevant parameters under various conditions
    When I append "&buildingInternalIdentifier=7&levelIndex=2&highlightPoiIdentifier=7844bd00-8dfb-4e02-bd30-352badd1e157&shouldEnableLanguageSelector=true" to current url and click enter
    And I should verify "start-sdk" event is fired
    And I should verify "sid" parameter of the "start-sdk" event matches with the "2" value
    And I should verify "bid" parameter of the "start-sdk" event matches with the "7" value
    And I should verify "lvl" parameter of the "start-sdk" event matches with the "2" value
    And I should verify "_clientInternalIdentifier" parameter of the "start-sdk" event matches with the "6ffab402-4805-42dd-bf7c-9c90c36a2ed3" value
    Then I should verify "display-map" event is fired
    And I should verify "sid" parameter of the "display-map" event matches with the "2" value
    And I should verify "bid" parameter of the "display-map" event matches with the "7" value
    And I should verify "lvl" parameter of the "display-map" event matches with the "2" value
    Then I should verify "poi-interaction" event is fired with "selected" actionStatus and "integration" origin
    And I should verify "fid" parameter of the "poi-interaction" event matches with the "7844bd00-8dfb-4e02-bd30-352badd1e157" value
    When language changed to "German" via language selector
    Then I should verify "change-language" event is fired with "German" language parameter
    Then language changed to "English" via language selector
    Then I wait until "webSessionTimeoutInSec" has expired
    When I move the mouse vertically
    Then I should verify sessionId of the new "use-sdk" event is different from the sessionId of the previous "use-sdk" event

  @WSDK-2 #(map-interaction, poi interaction)
  Scenario: As a Web SDK user, I should verify poi-interaction event is fired, When I click on a poi on the map and create a path
    When I append "&buildingInternalIdentifier=9&levelIndex=1&initialZoomLevel=20" to current url and click enter
    And I click on "Security Check" on the map
    Then I should verify "poi-interaction" event is fired with "selected" actionStatus and "map-click" origin
    And I should verify "name" parameter of the "poi-interaction" event matches with the "Security Check" value
    And I click on "Take me there Button - POI Details Modal"
    Then I should verify "poi-interaction" event is fired with "selected" actionStatus and "navigation" origin
    And I click on "Logan Express" on the map
    Then I click on "Show Directions Button"
    Then I should verify "poi-interaction" event is fired with "selected" actionStatus and "navigation" origin
    Then I interact with the map
    And I should verify "map-interaction" event is fired
    And I should verify "sid" parameter of the "map-interaction" event matches with the "2" value

  @WSDK-3 #(poi interaction, quick-access/category)
  Scenario: As a Web SDK user, I should verify poi-interaction and quick-access events are fired, When I click on a poi on the category panel
    When I click on "Shopping" text
    Then I should verify "quick-access" event is fired with "selected" actionStatus
    And I should verify "category" parameter of the "quick-access" event matches with the "Shopping" value
    And I should verify "resultCount" parameter of the "quick-access" event matches with the "61" value
    When I click on "Details Button - Active POI Card"
    Then I should verify "poi-interaction" event is fired with "selected" actionStatus and "categories" origin
    And I should verify "name" parameter of the "poi-interaction" event matches with the "NewsLink" value

  @WSDK-4 #(search)
  Scenario: As a Web SDK user, I should verify search and poi-interaction events are fired, When I perform a search and click on a search result
    When I search for "Invalid Text"
    Then "No results found" text should be displayed
    Then I should verify "search" event is fired
    And I should verify "searchTerm" parameter of the "search" event matches with the "Invalid Text" value
    And I should verify "resultCount" parameter of the "search" event matches with the "0" value
    When I search for "Baggage Claim"
    And I wait for "2" seconds
    And I should verify "search" event is fired
    And I should verify "searchTerm" parameter of the "search" event matches with the "Baggage Claim" value
    And I should verify "resultCount" parameter of the "search" event matches with the "32" value
    And I click on "First UnGrouped Search Result"
    Then I should verify "poi-interaction" event is fired with "selected" actionStatus and "search" origin
    And I should verify "name" parameter of the "poi-interaction" event matches with the "Baggage Claim" value

  @WSDK-5 #(get-direction)
  Scenario: As a Web SDK user, I should verify get-directions events are fired, When I create different routes
    Given I append "&buildingInternalIdentifier=7&levelIndex=2&highlightPoiIdentifier=7844bd00-8dfb-4e02-bd30-352badd1e157&shouldEnableLanguageSelector=true" to current url and click enter
    When I create successful route
    Then I should verify "get-directions" event is fired with "successful" actionStatus
    And I click on "Close Directions" text
    When I create unsuccessful route
    Then I should verify "get-directions" event is fired with "unsuccessful" actionStatus

  @WSDK-6 #(sessionId Change)
  Scenario: As a Web SDK user, I should verify event session id changes, When I wait idle for "WebSessionTimeoutInSec" seconds
    Given I clear all events
    When I append "&buildingInternalIdentifier=9&levelIndex=1" to current url and click enter
    Then I should verify "use-sdk" event is fired with "session-start" actionStatus
    And I remember the "sessionId" as "sessionId-1" from "use-sdk" event with "session-start" actionStatus
    And I remember the "deviceId" as "deviceId-1" from "use-sdk" event with "session-start" actionStatus
    Then I should verify "display-map" event is fired
    Then I interact with the map
    And I should verify "map-interaction" event is fired
    And I check all events' "deviceId" is equal to "deviceId-1"
    And I clear all events
    And I wait until "webSessionTimeoutInSec" has expired
    Then I interact with the map
    Then I should verify "use-sdk" event is fired with "session-start" actionStatus
    And I remember the "sessionId" as "sessionId-2" from "use-sdk" event with "session-start" actionStatus
    And I remember the "deviceId" as "deviceId-2" from "use-sdk" event with "session-start" actionStatus
    And I should verify "map-interaction" event is fired
    When I click on "Eyewear" text
    Then I should verify "quick-access" event is fired with "selected" actionStatus
    And I check all events' "sessionId" is equal to "sessionId-2"
    Then I should verify analytics event "sessionId-1" is not equal to "sessionId-2"
    Then I should verify analytics event "deviceId-1" is equal to "deviceId-2"

  @WSDK-7 #check PWS-1151 for details
  Scenario Outline: As a Web SDK user, I should be ble to enable/disable events, When I enable/disable relevant analytics configuration parameters
    Given I intercept sdk-config request of MockOffice and set "areWebSDKEventsEnabled" to "<setting-1>" and set "isEnabled" to "<setting-2>"
    Given I start monitoring analytic event requests
    When I open Web SDK in "MockOffice" environment
    And I wait until "Search Input" appears
    Then I should verify analytic events are "<result>"
    Examples:
      | setting-1 | setting-2 | result    |
      | true      | true      | fired     |
      | true      | false     | fired     |
      | true      | not set   | fired     |
      | false     | true      | not fired |
      | false     | false     | not fired |
      | false     | not set   | not fired |
      | not set   | true      | fired     |
      | not set   | false     | not fired |
      | not set   | not set   | not fired |
      
  @WSDK-8 #error handling
  @skip @manual
  Scenario:Web SDK should queue events When internet connection is down
    Given I remember the "deviceId" as "deviceId-1" from "use-sdk" event with "session-start" actionStatus
    Given I remember the "timestamp" as "timestamp-1" from last event
    Given I do not have internet connection
    When I interact with the map
    And I click on "Dining" text
    Then WebSDK queue events
    When I get internet connection back
    And I open event hub
    And I check events after "timestamp-1" in event hub
    Then I should verify "map-interaction" event is saved to event hub
    And I should verify "quick-access" event is saved to event hub with "selected" actionStatus
    And I should verify "category" parameter of the "quick-access" event matches with the "Dining" value
    And I should verify "resultCount" parameter of the "quick-access" event matches with the "xxx" value
    And I check all events' "deviceId" is equal to "deviceId-1"
    

  @WSDK-9 #error handling
  @skip @manual
  Scenario:Web SDK should queue events When browser is closed with unsend events
    Given I remember the "deviceId" as "deviceId-1" from "use-sdk" event with "session-start" actionStatus
    Given I remember the "timestamp" as "timestamp-1" from last event
    Given I do not have internet connection
    When I interact with the map
    And I close browser before "map-interaction" event is sent
    And I wait for "30" seconds
    And I open Web SDK in "MockAirport" environment
    And I open event hub
    And I check events after "timestamp-1" in event hub
    Then I should verify "map-interaction" event is saved to event hub
    And I check all events' "deviceId" is equal to "deviceId-1"

  @WSDK-10 #error handling
  @skip @manual
  Scenario:Web SDK should not send events When the web application cannot acquire content due to connectivity issues
    Given I remember the "timestamp" as "timestamp-1" from last event
    Given I do not have stable internet connection
    Given The content is not acquire
    When I interact with the map
    And I click on "Dining" text
    And I get internet connection back
    And I open event hub
    And I check events after "timestamp-1" in event hub
    Then I should verify there is no event saved after "timestamp-1"

  @WSDK-11 #error handling
  @skip @manual
  Scenario:Web SDK should queue events When event hub returns 400 error codes
    Given I remember the "deviceId" as "deviceId-1" from "use-sdk" event with "session-start" actionStatus
    Given I remember the "timestamp" as "timestamp-1" from last event
    Given I intercept sdk-config request and change token of event hub with an invalid token
    When I interact with the map
    And I click on "Dining" text
    Then WebSDK queue events
    When I refresh the page
    And I open event hub
    And I check events after "timestamp-1" in event hub
    Then I should verify "map-interaction" event is saved to event hub
    And I should verify "quick-access" event is saved to event hub with "selected" actionStatus
    And I should verify "category" parameter of the "quick-access" event matches with the "Dining" value
    And I should verify "resultCount" parameter of the "quick-access" event matches with the "xxx" value
    And I check all events' "deviceId" is equal to "deviceId-1"

  @WSDK-12 #poi-interaction multiple highlighted poi see PWS-1313 for details
  Scenario: Web SDK should send poi-interaction event when user clicks on category poi numbers on the map
    Given I click on "Terminal E" on the map
    Given I click on "Exits" text
    When I click on a random poi number on the map
    Then I should verify "poi-interaction" event is fired with "selected" actionStatus and "map-click" origin

  @WSDK-13
  Scenario Outline: Web SDK should not send poi-interaction event, When I open Web SDK, select a category and highlight the POIs in the category list
    When I click on "Clothing" text
    Then I should verify "quick-access" event is fired with "selected" actionStatus
    And I should verify "category" parameter of the "quick-access" event matches with the "Clothing" value
    And I should verify "resultCount" parameter of the "quick-access" event matches with the "5" value
    And I should verify "poi-interaction" event is not fired
    When I click on each POI card option in "POI List" in order
    And I should verify "poi-interaction" event is not fired
    When I click on "Details Button - Active POI Card"
    Then I should verify "poi-interaction" event is fired with "selected" actionStatus and "categories" origin
    And I should verify "name" parameter of the "poi-interaction" event matches with the name of the selected POI card

  @WSDK-14
  Scenario Outline: Web SDK should not send poi-interaction event, When I open Web SDK in a mobile device in portrait mode, select a category and slide and highlight the POIs in the carousel
    Given I intercept sdk-config request of "MockOffice" and enable Web SDK events and set timeouts
    Given using device "<device>" in "portrait" mode
    When I open Web SDK in "MockOffice" environment with the given "<device>" configuration
    When I click on "Dining" text
    Then I should verify "quick-access" event is fired with "selected" actionStatus
    And I should verify "category" parameter of the "quick-access" event matches with the "Dining" value
    And I should verify "resultCount" parameter of the "quick-access" event matches with the "9" value
    And I should verify "poi-interaction" event is not fired
    When I click on each POI card option in "Carousel" in order
    Then I should be able to highlight each POI in the carousel
    And I should verify "poi-interaction" event is not fired
    Then I click on previous POI card options in Carousel in order
    And I should verify "poi-interaction" event is not fired
    When I click on "Details Button - POI Carousel"
    Then I should verify "poi-interaction" event is fired with "selected" actionStatus and "categories" origin
    And I should verify "name" parameter of the "poi-interaction" event matches with the name of the selected POI card
    When I swipe "Draggable Line - Mobile POI Details Modal" from "bottom" to "top"
    Then I should verify "poi-interaction" event is fired with "details" actionStatus and "categories" origin
    And I should verify "name" parameter of the "poi-interaction" event matches with the name of the selected POI card
    When I wait for "2" seconds
    And I swipe "Draggable Line - Mobile POI Details Modal" from "top" to "bottom"
    
    Examples:
        | device                   |
        | iPhone 12 Pro            |
        | Samsung Galaxy S20 Ultra |