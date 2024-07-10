import * as constants from "./constants"
import { recurse } from "cypress-recurse"
import { selectors } from "../support/step_definitions/constants"

export function goHome(options) {
    let url = constants.baseUrl
    let queryString = Object.entries(constants.clientConfig)
      .map(([key, value]) => key + "=" + value)
      .join("&")
      if (queryString.length > 0) {
        url += "?" + queryString
      }
    
      if (options?.shouldFailConfig) {
        cy.intercept("GET", "**/sdk-configurations/latest.json?**", { forceNetworkError: true }).as("reset-password-mock1")
        cy.intercept("GET", "**/configurations/sdk-configurations", { forceNetworkError: true }).as("reset-password-mock")
      }
    
      cy.visit(url)
    
      if (!options?.shouldNotWaitForSDK && !options?.shouldFailConfig) {
        waitUntilSdkInit()
      }
    
      if (!options?.shouldNotWaitForMapReady && !options?.shouldFailConfig) {
        waitUntilMapReady()
      }
    }

    export function haveMatchingWords(sentence1, sentence2) {
        const words1 = sentence1.toLowerCase().replace(/,/g, "").split(" ")
        const words2 = sentence2.toLowerCase().replace(/,/g, "").split(" ")
        for (const word1 of words1) {
          if (words2.includes(word1)) {
            return true
          }
        }
        return false
      }

      export function clickOnPageElement(pageElement) {
        if (selectors[pageElement].startsWith("//")) {
          cy.xpath(selectors[pageElement]).click()
        } else {
          cy.get(selectors[pageElement]).click()
        }
      }

      export function doubleClickOnPageElement(pageElement) {
        if (selectors[pageElement].startsWith("//")) {
          cy.xpath(selectors[pageElement]).dblclick()
        } else {
          cy.get(selectors[pageElement]).dblclick()
        }
      }

      export function typeTextIntoSearchBar(text) {
        cy.get(selectors["Search Input"]).type(text, { delay: 50 })
      }


      export function isMobileDevice(device) {
        const listOfMobileDevices = ["iphone", "samsung", "pixel", "android"]
        return listOfMobileDevices.some((mobileDevice) => device.toLowerCase().includes(mobileDevice))
      }

