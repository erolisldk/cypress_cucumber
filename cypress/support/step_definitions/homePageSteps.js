import { Given, When, Then } from '@badeball/cypress-cucumber-preprocessor'
import { clickOnPageElement } from './coomonFunctions'
import {
  selectors,
  environmentURLs,
  environments,
  baseUrl,
  clientConfig,
  mobileDeviceDimensions,
} from "../common/constants"
import {
  checkIfThereAreCertainNumberOfPOIsInTheCurrentLayer,
  clickOnMapElement,
  searchOnPoiNumberOnMap,
  waitUntilMapIdle,
  goHome,
  clickUntilElementAppears,
  clickUntilElementDisappears,
  checkSortOfAnArray,
  arraysEqual,
  ClickUntilTargetTextAppears,
  ClickUntilTargetTextDisappears,
  readPOIsFromCurrentLayerFeaturesList,
  clickOnPageElement,
  doubleClickOnPageElement,
  clickOnAPOINumberOnMap,
  clickOnRandomMapElement,
  setZoomLevel,
} from "../common/commonFunctions"
import { waitUntilSearchResultsArePopulated } from "../search/search"
import "cypress-real-events"
import { recurse } from "cypress-recurse"

Given('I go to home page', () => {
    cy.visit('https://optimum7.com')
  })


  When('I click on the {string} button', function (pageElement) {
    clickOnPageElement(pageElement)

  })


  Then('I should see youtube video', () => {
    iframe_selector = 'body > iframe:nth-child(115)'
    element_to_find_selector = "input[type='text']"

cy.frameLoaded(iframe_selector)
cy.wait(5000)
      
cy.iframe()
   .get("//a[@aria-label='Close (Esc)']//*[name()='svg']").should('be.visible')
  })
 


When('I enter valid username and password', () => {
  cy.fixture('users.json').then((users) => {
    cy.get('input[name=username]').type(users.valid.username)
    cy.get('input[name=password]').type(users.valid.password)
  })
})

When('I click on login button' , () => {
   cy.get('button[type=submit]').click()
})

Then('I should logged in and redirected to dashboard page', () => {
  cy.get('p.oxd-userdropdown-name').should('be.visible')
})

When ('I enter invalid username and password', () => {
  cy.fixture('users.json').then((users) => {
    cy.get('input[name=username]').type(users.invalid.username)
    cy.get('input[name=password]').type(users.invalid.password)
  })
})

Then('I should see invalid credentials message', () => {
  cy.contains('Invalid credentials').should('be.visible')
})

// When('I enter {string} in username field', (username) => {
//     cy.get('input[name=username]').type(username)
// })

// When('I enter {string} in password field', (password) => {
//     cy.get('input[name=password]').type(password)
// })

// When('I enter {int} in password field', (password) => {
//     cy.get('input[name=password]').type(password)
// })
When(/I enter "(.*)" in (username|password) field/, (text, field) => {
    cy.get(`input[name=${field}]`).type(text)
})

