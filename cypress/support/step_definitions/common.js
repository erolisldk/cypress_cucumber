import { And, Given, Then, When } from "@badeball/cypress-cucumber-preprocessor"
import "cypress-wait-until"
import * as constants from "./constants"
import * as functions from "./commonFunctions"

Given("page is reloaded", () => {
  functions.goHome()
})

When("map is idle", function () {
  functions.waitUntilMapIdle()
})

When("floor is {string}", function (floor) {
  functions.changeFloor(floor)
})

Given("user navigates to site {string} building {string}", function (siteId, buildingId) {
  constants.clientConfig.siteInternalIdentifier = siteId
  constants.clientConfig.buildingInternalIdentifier = buildingId
  functions.goHome()
})

Given(
  "user navigates to site {string} building {string} highlighted POI Id {string}",
  function (siteId, buildingId, poiId) {
    constants.clientConfig.siteInternalIdentifier = siteId
    constants.clientConfig.buildingInternalIdentifier = buildingId
    constants.clientConfig.highlightPoiIdentifier = poiId
    functions.goHome()
  }
)

Given("there is an error fetching configuration", function () {
  functions.goHome({ shouldFailConfig: true })
})

Given("user navigates to landing page when {string} option is set to {string}", function (key, value) {
  functions.appendQueryAndVisit(key, value)
})

When("clicked to empty location on map", function () {
  cy.get(constants.pointrMap).click("topRight")
})

When(/zoomed (in|out) to site level/, function () {
  cy.window().then((win) => {
    const mapWidget = win.PointrWebSDK.MapWidget.getInstance()
    const targetZoom = mapWidget.getUiController().getMapViewController().SITE_ZOOM_LEVEL
    mapWidget.zoomTo(targetZoom)
    functions.waitUntilMapIdle()
  })
})

When(/zoomed (in|out) to global level/, function () {
  cy.window().then((win) => {
    const mapWidget = win.PointrWebSDK.MapWidget.getInstance()
    const targetZoom = mapWidget.getUiController().getMapViewController().SITE_ZOOM_LEVEL - 1
    mapWidget.zoomTo(1)
    functions.waitUntilMapIdle()
  })
})

When("{string} is clicked", function (elementName) {
  functions.getCyElement(elementName).click()
})

Then("{string} element should be {string}", function (elem, isVisibleText) {
  const notText = isVisibleText === "visible" ? "" : "not."
  functions.getCyElement(elem).should(notText + "be.visible")
})

//WSDK-29, WSDK-162
When("I click on search bar on top left", function () {
  cy.get(constants.searchInput).click()
})

Given("clear the loaded default site and building", function () {
  delete constants.clientConfig.siteInternalIdentifier
  delete constants.clientConfig.buildingInternalIdentifier
  functions.goHome()
})

//deprecated
// Given("I set category option of the PointrSdk to {string}", function (fileName) {
//   cy.exec("git restore src/index.html")
//     .then((result) => {
//       cy.log("result", result)
//     })
//     .then(() => {
//       functions.OverrideOriginalHtmlFile(fileName)
//     })
//     .then(() => {
//       cy.url().then((url) => {
//         if (url !== "about:blank") {
//           cy.get("#pointr-loading", { timeout: 20000 }).should("not.be.visible")
//         } else {
//           cy.wait(1000)
//         }
//       })
//     })
// })
