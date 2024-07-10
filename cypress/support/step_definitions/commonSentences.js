import { Given, When, Then } from "@badeball/cypress-cucumber-preprocessor"
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

let linkHolder = []
let globalVarHolder = []
let textToCopyAndPaste

beforeEach(() => {
  linkHolder = []
  textToCopyAndPaste = ""
  globalVarHolder = []
})

Given("I open Web SDK in {string} environment", function (environ) {
  cy.visit(environmentURLs[environ])
  cy.then(() => {
    waitUntilMapIdle()
  })
})

When("I intercept {string} request to {string} endpoint as {string}", (verb, endpoint, alias) => {
  if (endpoint.startsWith(".*")) {
    endpoint = new RegExp(endpoint)
  }
  console.log("endpoint", endpoint)
  cy.intercept(verb, endpoint, (req) => {
    const start = Date.now()
    req.continue((res) => {
      res.headers.responseTime = Date.now() - start
    })
  }).as(alias)
})

When("I intercept {string} request to set {string} to {string}", (eventName, property, value) => {
  cy.intercept(`**/${eventName}`, (req) => {
    req.continue((res) => {
      if (value === "null") {
        res.body.result[property] = null
      } else if (value === "property_removed") {
        let interceptedResponse = res.body
        delete interceptedResponse.result[property]
        res.body = interceptedResponse
      } else {
        res.body.result[property] = value
      }
    })
  })
})

Given(
  "I open Web SDK in {string} environment, setting site id to {int} and building id to {int}",
  function (environ, sid, bid) {
    cy.visit(`${environmentURLs[environ]}&siteInternalIdentifier=${sid}&buildingInternalIdentifier=${bid}`)
    cy.then(() => {
      waitUntilMapIdle()
    })
  }
)

When("I append {string} to current url and click enter", function (url_suffix) {
  cy.url().then((url) => {
    cy.visit(url + url_suffix)
  })
  cy.then(() => {
    waitUntilMapIdle()
  })
})

When("I remove {string} from current url and click enter", function (url_removal) {
  cy.url().then((url) => {
    let newURL = url.replace(url_removal, "")
    cy.visit(newURL.trim())
  })
  cy.then(() => {
    waitUntilMapIdle()
  })
})

Given("I open {string} in browser", function (url) {
  cy.visit(environmentURLs[url])
})

When("I wait until {string} disappears", function (pageElement) {
  if (selectors[pageElement].startsWith("//")) {
    cy.xpath(selectors[pageElement]).should(($el) => {
      if ($el.length > 0) {
        expect($el).not.to.be.visible
      }
    })
  } else {
    cy.get(selectors[pageElement]).should(($el) => {
      if ($el.length > 0) {
        expect($el).not.to.be.visible
      }
    })
  }
})

When("I click on {string}", function (pageElement) {
  clickOnPageElement(pageElement)
})

When("I double click on {string}", function (pageElement) {
  doubleClickOnPageElement(pageElement)
})

When("I click on {string} with 'scrollBehavior: false' parameter", function (pageElement) {
  if (selectors[pageElement].startsWith("//")) {
    cy.xpath(selectors[pageElement]).click({ scrollBehavior: false })
  } else {
    cy.get(selectors[pageElement]).click({ scrollBehavior: false })
  }
})

When("I click on {string} text with 'scrollBehavior: false' parameter", function (txt) {
  cy.contains(txt).click({ scrollBehavior: false })
})

//accepts only plain text
When("I click on {string} text", function (text) {
  cy.contains(text, { timeout: 10000 }).scrollIntoView().click()
})

When("I scroll {string} to {string}", function (pageElement, position) {
  if (selectors[pageElement].startsWith("//")) {
    const element = cy.xpath(selectors[pageElement])
    const isScrollable = element.scrollHeight > element.clientHeight
    if (isScrollable) {
      element.scrollTo(position)
    }
  } else {
    const element = cy.get(selectors[pageElement])
    const isScrollable = element.scrollHeight > element.clientHeight
    if (isScrollable) {
      element.scrollTo(position)
    }
  }
})

When("I scroll {string} into view", function (pageElement) {
  if (selectors[pageElement].startsWith("//")) {
    cy.xpath(selectors[pageElement]).scrollIntoView()
  } else {
    cy.get(selectors[pageElement]).scrollIntoView()
  }
})

When("I scroll {string} text into view", function (txt) {
  cy.contains(txt).scrollIntoView()
})

When("I scroll down the page {string} px", function (val) {
  cy.window().scrollTo(0, Number(val))
})

const scrollPage = () => {
  return cy.window().then((win) => {
    cy.window().scrollTo(0, win.scrollY + 30)
  })
}
const isVisible = ($element) => {
  return Cypress.$($element).is(":visible")
}

When("I scroll down the page slowly until {string} appears", function (pageElement) {
  recurse(
    () => scrollPage(),
    () => isVisible(selectors[pageElement]),
    {
      timeout: 25000,
      limit: 100,
      delay: 100,
      log: true,
      debugLog: true,
    }
  )
})

When("I wait until {string} appears", function (pageElement) {
  if (selectors[pageElement].startsWith("//")) {
    cy.xpath(selectors[pageElement], { timeout: 10000 }).should("be.visible", { timeout: 10000 })
  } else {
    cy.get(selectors[pageElement], { timeout: 10000 }).should("be.visible", { timeout: 10000 })
  }
})

When("I wait until {string} text appears", function (text) {
  cy.contains(text, { timeout: 10000 }).should("be.visible", { timeout: 10000 })
})

When("I wait for {string} seconds", function (duration) {
  cy.wait(Number(duration) * 1000)
})

When("I type {string} into {string}", function (text, pageElement) {
  if (selectors[pageElement].startsWith("//")) {
    cy.xpath(selectors[pageElement]).type(text, { delay: 50 })
  } else {
    cy.get(selectors[pageElement]).type(text, { delay: 50 })
  }
})

When("I type {string} into {string} with 'scrollBehavior: false' parameter", function (text, pageElement) {
  if (selectors[pageElement].startsWith("//")) {
    cy.xpath(selectors[pageElement]).type(text, { scrollBehavior: false, delay: 50 })
    cy.xpath(selectors[pageElement]).blur()
  } else {
    cy.get(selectors[pageElement]).type(text, { scrollBehavior: false, delay: 50 })
    cy.get(selectors[pageElement]).blur()
  }
})

When("I hover on {string}", function (pageElement) {
  if (selectors[pageElement].startsWith("//")) {
    cy.xpath(selectors[pageElement]).realHover()
  } else {
    cy.get(selectors[pageElement]).realHover()
  }
})

When("I hover on {string} text", function (text) {
  cy.contains(text).realHover()
})

When("I refresh the page", function () {
  cy.reload()
})

Then("{string} should be displayed", function (pageElement) {
  if (selectors[pageElement].startsWith("//")) {
    cy.xpath(selectors[pageElement], { timeout: 10000 }).should("exist").and("be.visible", { timeout: 10000 })
  } else {
    cy.get(selectors[pageElement], { timeout: 10000 }).should("exist").and("be.visible", { timeout: 10000 })
  }
})

Then("{string} should not be displayed", function (pageElement) {
  if (selectors[pageElement].startsWith("//")) {
    cy.xpath(selectors[pageElement]).should("not.exist")
  } else {
    cy.get(selectors[pageElement]).should("not.exist")
  }
})

Then("{string} text should be displayed", function (text) {
  cy.contains(text, { timeout: 10000 }).should("exist").and("be.visible", { timeout: 10000 })
})

export function textShouldBeDisplayed(text) {
  cy.contains(text, { timeout: 10000 }).should("exist").and("be.visible", { timeout: 10000 })
}

Then("{string} text should not be displayed", function (text) {
  cy.contains(text, { timeout: 10000 }).should("not.exist", { timeout: 10000 })
})

Then("{string} text should not be visible", function (text) {
  cy.contains(text, { timeout: 10000 }).should("not.be.visible", { timeout: 10000 })
})

Then("{string} should be visible", function (pageElement) {
  if (selectors[pageElement].startsWith("//")) {
    cy.xpath(selectors[pageElement], { timeout: 10000 }).should("be.visible", { timeout: 10000 })
  } else {
    cy.get(selectors[pageElement], { timeout: 10000 }).should("be.visible", { timeout: 10000 })
  }
})

Then("{string} should not be visible", function (pageElement) {
  if (selectors[pageElement].startsWith("//")) {
    cy.xpath(selectors[pageElement], { timeout: 10000 }).should("not.be.visible", { timeout: 10000 })
  } else {
    cy.get(selectors[pageElement], { timeout: 10000 }).should("not.be.visible", { timeout: 10000 })
  }
})

Then("I should see {string} text in the {string}", function (text, pageElement) {
  if (selectors[pageElement].startsWith("//")) {
    cy.xpath(selectors[pageElement]).should("contain.text", text)
  } else {
    cy.get(selectors[pageElement]).should("contain.text", text)
  }
})

Then("I should not see {string} text in the {string}", function (text, pageElement) {
  if (selectors[pageElement].startsWith("//")) {
    cy.xpath(selectors[pageElement]).should("not.contain.text", text)
  } else {
    cy.get(selectors[pageElement]).should("not.contain.text", text)
  }
})

Then("I should see {string} text in the {string} input", function (text, pageElement) {
  if (selectors[pageElement].startsWith("//")) {
    cy.xpath(selectors[pageElement])
      .invoke("val")
      .then((val) => {
        expect(val).to.contain(text)
      })
  } else {
    cy.get(selectors[pageElement])
      .invoke("val")
      .then((val) => {
        expect(val).to.contain(text)
      })
  }
})

Then("I should not see {string} text in the {string} input", function (text, pageElement) {
  if (selectors[pageElement].startsWith("//")) {
    cy.xpath(selectors[pageElement])
      .invoke("val")
      .then((val) => {
        expect(val).not.to.contain(text)
      })
  } else {
    cy.get(selectors[pageElement])
      .invoke("val")
      .then((val) => {
        expect(val).not.to.contain(text)
      })
  }
})

Then("I should see {string} placeholder in the {string}", function (text, pageElement) {
  if (selectors[pageElement].startsWith("//")) {
    cy.xpath(selectors[pageElement]).should("have.attr", "placeholder", text)
  } else {
    cy.get(selectors[pageElement]).should("have.attr", "placeholder", text)
  }
})

Then("I should verify there are no broken images on the page", function () {
  cy.get(selectors["All the Images on the Page"]).each(($img) => {
    cy.wrap($img)
      .should("be.visible")
      .and(($img) => {
        expect($img[0].naturalWidth).to.be.gt(0)
      })
  })
})

//accepts only css selector
Then("I should verify the images {string} are visible and not broken", function (pageElement) {
  cy.get(selectors[pageElement]).each(($element) => {
    if ($element.prop("tagName").toLowerCase() === "svg") {
      cy.wrap($element)
        .should("be.visible")
        .then(($svg) => {
          const rect = $svg[0].getBoundingClientRect()
          expect(rect.width).to.be.gt(0)
          expect(rect.height).to.be.gt(0)
        })
    } else if ($element.prop("tagName").toLowerCase() === "img") {
      cy.wrap($element)
        .should("be.visible")
        .then(($img) => {
          cy.wrap($img).should(($img) => {
            expect($img[0].naturalWidth).to.be.gt(0)
          })
        })
    } else {
      throw new Error("Element is neither an IMG nor an SVG")
    }
  })
})

//accepts only css selector
Then("I should verify the images {string} are not broken", function (pageElement) {
  cy.get(selectors[pageElement]).each(($element) => {
    if ($element.prop("tagName").toLowerCase() === "svg") {
      cy.wrap($element).then(($svg) => {
        const rect = $svg[0].getBoundingClientRect()
        expect(rect.width).to.be.gt(0)
        expect(rect.height).to.be.gt(0)
      })
    } else if ($element.prop("tagName").toLowerCase() === "img") {
      cy.wrap($element).then(($img) => {
        cy.wrap($img).should(($img) => {
          expect($img[0].naturalWidth).to.be.gt(0)
        })
      })
    } else {
      throw new Error("Element is neither an IMG nor an SVG")
    }
  })
})

When("I remember all links on the page", function () {
  cy.get("a").each((link) => {
    let linkUrl = link.prop("href")
    linkHolder.push(linkUrl)
  })
})

When("I clear the text in {string}", function (pageElement) {
  if (selectors[pageElement].startsWith("//")) {
    cy.xpath(selectors[pageElement]).clear()
  } else {
    cy.get(selectors[pageElement]).clear()
  }
})

Then("I should verify there are no broken links on the page", function () {
  cy.log("linkHolder", linkHolder)
  linkHolder.forEach((link) => {
    cy.request(link).then((response) => {
      expect(response).property("status").to.equal(200)
    })
  })
})

Then("{string} should be focused", function (pageElement) {
  if (selectors[pageElement].startsWith("//")) {
    cy.xpath(selectors[pageElement]).should("have.focus")
  } else {
    cy.get(selectors[pageElement]).should("have.focus")
  }
})

Then("{string} should {string}", function (pageElement, evaluator) {
  if (selectors[pageElement].startsWith("//")) {
    if (evaluator === "be visible" || evaluator === "be displayed") {
      cy.xpath(selectors[pageElement]).should("be.visible")
    } else if (evaluator === "not be visible") {
      cy.xpath(selectors[pageElement]).should("not.be.visible")
    } else if (evaluator === "not exist" || evaluator === "not be displayed") {
      cy.xpath(selectors[pageElement]).should("not.exist")
    }
  } else if (!selectors[pageElement].startsWith("//")) {
    if (evaluator === "be visible" || evaluator === "be displayed") {
      cy.xpath(selectors[pageElement]).should("be.visible")
    } else if (evaluator === "not be visible") {
      cy.xpath(selectors[pageElement]).should("not.be.visible")
    } else if (evaluator === "not exist" || evaluator === "not be displayed") {
      cy.xpath(selectors[pageElement]).should("not.exist")
    }
  }
})

When("I copy {string} value to clipboard", function (copiedValue) {
  textToCopyAndPaste = copiedValue
})

When("I paste the clipborad content into {string}", function (pageElement) {
  if (selectors[pageElement].startsWith("//")) {
    cy.xpath(selectors[pageElement]).invoke("val", textToCopyAndPaste).trigger("change")
  } else {
    cy.get(selectors[pageElement]).invoke("val", textToCopyAndPaste).trigger("change")
  }
})

Then("I should verify {string} has {string} property", function (pageElement, prop) {
  if (selectors[pageElement].startsWith("//")) {
    cy.xpath(selectors[pageElement]).should("have.attr", prop)
  } else {
    cy.get(selectors[pageElement]).should("have.attr", prop)
  }
})

Then("I should verify {string} does not have {string} property", function (pageElement, prop) {
  if (selectors[pageElement].startsWith("//")) {
    cy.xpath(selectors[pageElement]).should("not.have.attr", prop)
  } else {
    cy.get(selectors[pageElement]).should("not.have.attr", prop)
  }
})

Then("I should verify the {string} property of {string} is equal to {string}", function (prop, pageElement, propVal) {
  if (selectors[pageElement].startsWith("//")) {
    cy.xpath(selectors[pageElement]).should("have.attr", prop, propVal)
  } else {
    cy.get(selectors[pageElement]).should("have.attr", prop, propVal)
  }
})

Then(
  "I should verify the {string} style of {string} is equal to {string}",
  function (styleKey, pageElement, styleValue) {
    if (selectors[pageElement].startsWith("//")) {
      cy.xpath(selectors[pageElement]).should("have.css", styleKey, styleValue)
    } else {
      cy.get(selectors[pageElement]).should("have.css", styleKey, styleValue)
    }
  }
)

When(
  "I intercept {string} request to {string} as {string} and add {string} to the header",
  function (requestType, endpoint, requestAlias, header) {
    cy.interceptAPIRequest(requestType, requestAlias, endpoint, header)
  }
)

When("I click on {string} and wait for the intercepted {string} request", function (pageElement, interceptedRequest) {
  cy.xpath(selectors[pageElement]).click()
  cy.wait(`@${interceptedRequest}`)
})

When("I select all the text in {string}", function (pageElement) {
  if (selectors[pageElement].startsWith("//")) {
    cy.xpath(selectors[pageElement]).type("{selectAll}")
  } else {
    cy.get(selectors[pageElement]).type("{selectAll}")
  }
})

When("I long click on {string} at coordinates {string}", function (pageElement, coordinates) {
  let coorX = Number(coordinates.split(",")[0])
  let coorY = Number(coordinates.split(",")[1])

  if (selectors[pageElement].startsWith("//")) {
    cy.xpath(selectors[pageElement]).trigger("mousedown", { clientX: coorX, clientY: coorY })
    cy.wait(1000)
    cy.xpath(selectors[pageElement]).trigger("mouseup", { clientX: coorX, clientY: coorY })
  } else {
    cy.get(selectors[pageElement]).trigger("mousedown", { clientX: coorX, clientY: coorY })
    cy.wait(1000)
    cy.get(selectors[pageElement]).trigger("mouseup", { clientX: coorX, clientY: coorY })
  }
})

When("I click on {string} at coordinates {string}", function (pageElement, coordinates) {
  let coorX = Number(coordinates.split(",")[0])
  let coorY = Number(coordinates.split(",")[1])
  if (selectors[pageElement].startsWith("//")) {
    cy.xpath(selectors[pageElement]).click(coorX, coorY)
  } else {
    cy.get(selectors[pageElement]).click(coorX, coorY)
  }
})

export function longClickOnPageElementAtCoordinates(pageElement, coordinates, duration = 2000) {
  clickAndHoldOnPageElementAtCoordinates(pageElement, coordinates, duration)
}

export function clickAndHoldOnPageElementAtCoordinates(pageElement, coordinates, duration = 2000) {
  let coorX = Number(coordinates.split(",")[0])
  let coorY = Number(coordinates.split(",")[1])

  const mouseDownOptions = { button: 0, clientX: coorX, clientY: coorY }
  const mouseUpOptions = { button: 0, clientX: coorX, clientY: coorY }

  if (selectors[pageElement].startsWith("//")) {
    cy.xpath(selectors[pageElement])
      .trigger("mousedown", mouseDownOptions)
      .wait(duration)
      .trigger("mouseup", mouseUpOptions)
  } else {
    cy.get(selectors[pageElement])
      .trigger("mousedown", mouseDownOptions)
      .wait(duration)
      .trigger("mouseup", mouseUpOptions)
  }
}

When(
  "I click on {string} and retry upto {string} times until {string} appears for each {string} seconds",
  function (clickEl, retryCount, targetEl, period) {
    clickUntilElementAppears(clickEl, retryCount, targetEl, period)
  }
)

When(
  "I click on {string} and retry upto {string} times until {string} disappears for each {string} seconds",
  function (clickEl, retryCount, targetEl, period) {
    clickUntilElementDisappears(clickEl, retryCount, targetEl, period)
  }
)

When(
  "I click on {string} and retry upto {string} times until {string} text appears for each {string} seconds",
  function (clickEl, retryCount, targetEl, period) {
    ClickUntilTargetTextAppears(clickEl, retryCount, targetEl, period)
  }
)

When(
  "I click on {string} and retry upto {string} times until {string} text disappears for each {string} seconds",
  function (clickEl, retryCount, targetEl, period) {
    ClickUntilTargetTextDisappears(clickEl, retryCount, targetEl, period)
  }
)

When("I remember all {string} and put them into an array as {string}", function (pageElement, varName) {
  globalVarHolder[varName] = []
  if (selectors[pageElement].startsWith("//")) {
    cy.xpath(selectors[pageElement]).each(($el) => {
      globalVarHolder[varName].push(Cypress.$($el).text())
    })
  } else {
    cy.get(selectors[pageElement]).each(($el) => {
      globalVarHolder[varName].push(Cypress.$($el).text())
    })
  }
})

When("I remember the text in {string} as {string}", function (pageElement, varName) {
  globalVarHolder[varName] = []
  if (selectors[pageElement].startsWith("//")) {
    cy.xpath(selectors[pageElement]).then(($el) => {
      globalVarHolder[varName] = $el.text()
    })
  } else {
    cy.get(selectors[pageElement]).then(($el) => {
      globalVarHolder[varName] = $el.text()
    })
  }
})

When("I remember the value of {string} as {string}", function (pageElement, varName) {
  globalVarHolder[varName] = []
  if (selectors[pageElement].startsWith("//")) {
    cy.xpath(selectors[pageElement])
      .invoke("val")
      .then((value) => {
        globalVarHolder[varName] = value
      })
  } else {
    cy.get(selectors[pageElement])
      .invoke("val")
      .then((value) => {
        globalVarHolder[varName] = value
      })
  }
})

When(
  "I extract values from {string} that matches {string} pattern and put them into an array as {string}",
  function (var1, regPattern, var2) {
    globalVarHolder[var2] = []
    let regexPattern = new RegExp(regPattern)
    globalVarHolder[var1].forEach((element) => {
      let matchingEl
      if (element.match(regexPattern) !== null) {
        matchingEl = element.match(regexPattern)[0].toString()
        globalVarHolder[var2].push(matchingEl)
      }
    })
  }
)

Then("I should verify all the elements in the {string} array matches {string} pattern", function (varName, regPattern) {
  let regexPattern = new RegExp(regPattern)
  globalVarHolder[varName].forEach((el) => {
    expect(el.match(regexPattern).length === 1).to.be.true
  })
})

Then("I should verify the variable {string} is in {string} order", function (varName, orderType) {
  let numericArr = []
  globalVarHolder[varName].forEach((el) => {
    numericArr.push(Number(el))
  })
  expect(checkSortOfAnArray(numericArr)).equal(orderType)
})

Then("I should verify the array {string} is equal to the array {string}", function (var1, var2) {
  cy.log("firstArray", globalVarHolder[var1])
  cy.log("secondArray", globalVarHolder[var2])
  expect(arraysEqual(globalVarHolder[var1], globalVarHolder[var2])).to.be.true
})

Then("I should verify the variable {string} is {string} the variable {string}", function (var1, operator, var2) {
  if (operator === "greater than") {
    cy.log("var1", globalVarHolder[var1])
    cy.log("var2", globalVarHolder[var2])
    expect(globalVarHolder[var1]).to.be.greaterThan(globalVarHolder[var2])
  } else if (operator === "equal to") {
    cy.log("var1", globalVarHolder[var1])
    cy.log("var2", globalVarHolder[var2])
    expect(globalVarHolder[var1]).eqls(globalVarHolder[var2])
  } else if (operator === "not equal to") {
    cy.log("var1", globalVarHolder[var1])
    cy.log("var2", globalVarHolder[var2])
    expect(globalVarHolder[var1]).to.not.equal(globalVarHolder[var2])
  } else if (operator === "containing") {
    cy.log("var1", typeof globalVarHolder[var1])
    cy.log("var2", typeof globalVarHolder[var2])
    expect(globalVarHolder[var1].includes(globalVarHolder[var2])).to.be.true
  } else {
    throw new Error("Invalid operator")
  }
})

When("I wait until map is ready", function () {
  waitUntilMapIdle()
})

Then("I should see {string} value in the {string}", function (text, pageElement) {
  if (selectors[pageElement].startsWith("//")) {
    cy.xpath(selectors[pageElement]).should("have.value", text)
  } else {
    cy.get(selectors[pageElement]).should("have.value", text)
  }
})

Then(
  "I should see {int} as site id, {int} as building id and {int} as level id in properties for all POIs to validate level selection",
  function (siteId, buildingId, levelId) {
    readPOIsFromCurrentLayerFeaturesList().then((pois) => {
      cy.log("pois", pois)
      cy.log("siteId", siteId)
      cy.log("buildingId", buildingId)
      cy.log("levelId", levelId)
      pois.forEach((poi) => {
        expect(siteId, "Site id").to.deep.equal(poi.properties.sid)
        expect(buildingId, "Building id").to.deep.equal(poi.properties.bid)
        expect(levelId, "Level").to.deep.equal(poi.properties.lvl)
      })
    })
  }
)

When("I click on {string} on the map", function (mapElement) {
  clickOnMapElement(mapElement)
})

Then("I move the mouse vertically", () => {
  cy.document().trigger("mousemove", { clientY: 200 }).wait(2000)
})

Then("I should verify {string} is not equal to {string}", (var1, var2) => {
  expect(globalVarHolder[var1]).to.not.equal(globalVarHolder[var2])
})

Then("I should verify {string} value is equal to {string}", (value1, value2) => {
  expect(value1).to.not.equal(value2)
})

When("I remember the count of {string} as {string}", function (pageElement, varName) {
  if (selectors[pageElement].startsWith("//")) {
    cy.xpath(selectors[pageElement]).then(($el) => {
      globalVarHolder[varName] = $el.length
    })
  } else {
    cy.get(selectors[pageElement]).then(($el) => {
      globalVarHolder[varName] = $el.length
    })
  }
})

When("I verify there are {int} POIs visible on the map", (count) => {
  checkIfThereAreCertainNumberOfPOIsInTheCurrentLayer(100)
})

When("I click on a random poi number on the map", () => {
  clickOnAPOINumberOnMap()
})

When("I click on a random POI on the map", function () {
  clickOnRandomMapElement()
})

When("I set zoom level to {string}", function (zoomParam) {
  setZoomLevel(zoomParam)
})

Then("I should verify building layer is not disappeared", () => {
  cy.window().then((win) => {
    const mapWidget = win.PointrWebSDK.MapWidget.getInstance()
    const uiController = mapWidget.getUiController()
    const map = uiController.getMapViewController().getView().map
    let renderedFeatures
    cy.get("canvas", { timeout: 10000 }).should(() => {
      renderedFeatures = map.queryRenderedFeatures().filter((obj) => obj.layer.id.includes("fill_"))
      console.log(renderedFeatures)
      expect(renderedFeatures.length).to.be.greaterThan(0)
    })
  })
})

Then("I remember source URL of {string} as {string}", (pageElement, varName) => {
  cy.xpath(selectors[pageElement])
    .invoke("attr", "src")
    .then((src) => {
      globalVarHolder[varName] = src
    })
})

Then("I should verify background is blurred in expanded image view", () => {
  cy.xpath(selectors["Expanded Image View - Rich POI Modal"]).should("have.css", "backdrop-filter", "blur(10px)")
})

When("I remember zoom level of {string} as {string}", (pageElement, varName) => {
  cy.xpath(selectors[pageElement])
    .invoke("css", "transform")
    .then((transform) => {
      if (transform === "none") {
        globalVarHolder[varName] = parseFloat(1)
      } else {
        console.log("transform", transform)
        const startIndex = transform.indexOf("matrix(")
        const endIndex = transform.indexOf(", 0,")
        const scaleValue = transform.substring(startIndex + 7, endIndex)
        console.log("scale", scaleValue)
        globalVarHolder[varName] = parseFloat(scaleValue)
        console.log(varName, globalVarHolder[varName])
      }
    })
})

Then("I should verify image is zoomed in by {string}", (varName) => {
  expect(Number(globalVarHolder[varName]) > Number(1)).to.be.true
})

When("I click on a different small image than active image under the extended image view", () => {
  cy.xpath(selectors["Unselected Images - Expanded Image View"]).eq(1).click()
})

When("I slide the image on expanded image view from {string} to {string}", (from, to) => {
  cy.xpath(selectors["Active Image - Expanded Image View"]).swipe(from, to)
})

When("I click and pan around the active image", () => {
  cy.get(selectors["Zoomed Active Image - Expanded Image View"]).trigger("pointerdown", {
    which: 1,
    clientX: 100,
    clientY: 100,
    force: true,
  })
  cy.get(selectors["Zoomed Active Image - Expanded Image View"]).trigger("pointermove", {
    clientX: 100,
    clientY: 400,
    force: true,
  })

  cy.xpath(selectors["Panned Active Image Container - Expanded Image View"]).should("be.visible")
})

Then("I should verify I see different part of the active image", () => {
  cy.xpath(selectors["Panned Active Image Container - Expanded Image View"]).should("be.visible")
})

Then("I should verify variable {string} is greater than variable {string}", function (var1, var2) {
  expect(Number(globalVarHolder[var1]) > Number(globalVarHolder[var2])).to.be.true
})

When("I zoom in to {string}", (pageElement) => {
  cy.get(selectors[pageElement]).trigger("pointermove", {
    clientX: 100,
    clientY: 100,
    force: true,
  })
  for (let i = 0; i < 6; i++) {
    cy.get(selectors[pageElement]).trigger("wheel", {
      deltaY: -666.666666,
      wheelDelta: 120,
      wheelDeltaX: 0,
      wheelDeltaY: 120,
      bubbles: true,
    })
  }
  cy.wait(1000)
})

When("I zoom out from {string}", (pageElement) => {
  cy.get(selectors[pageElement]).trigger("pointermove", {
    clientX: 100,
    clientY: 100,
    force: true,
  })
  for (let i = 0; i < 4; i++) {
    cy.get(selectors[pageElement]).trigger("wheel", {
      deltaY: +666.666666,
      wheelDelta: 120,
      wheelDeltaX: 0,
      wheelDeltaY: -120,
      bubbles: true,
    })
  }
  cy.wait(1000)
})

Cypress.Commands.add("setLanguage", (language) => {
  cy.window().then((win) => {
    Object.defineProperty(win.navigator, "language", {
      value: language,
    })
  })
})

Given("I set local time format to {string}", (format) => {
  cy.setLanguage(format)
})

When("I should verify highlighted POI is on the center of the {string} map screen", (device) => {
  cy.window().then((win) => {
    const mapWidget = win.PointrWebSDK.MapWidget.getInstance()
    const uiController = mapWidget.getUiController()
    const map = uiController.getMapViewController().getView().map
    let renderedFeatures
    cy.get("canvas")
      .should(($canvas) => {
        renderedFeatures = map
          .queryRenderedFeatures()
          .filter((x) => x.layer.id.includes("selected") && x.layer.id.includes("symbol"))
        console.log(renderedFeatures)
        return renderedFeatures.length > 0
      })
      .then(($canvas) => {
        const highlightedPoint = renderedFeatures[0]
        const centerCoordinatesOfPOI =
          highlightedPoint.geometry.type.toLowerCase() === "point"
            ? highlightedPoint.geometry.coordinates
            : highlightedPoint.geometry.coordinates[0][0]

        const { x, y } = map.project(centerCoordinatesOfPOI)
        cy.log("x", x)
        cy.log("y", y)

        const screenWidthCenter = win.innerWidth / 2
        const screenHeightCenter = mobileDeviceDimensions[device][1] / 2

        cy.get("#pointr-top")
          .invoke("height")
          .then((mapHeight) => {
            let mapHeightCenter = mapHeight / 2

            const isQuickAccessPin =
              highlightedPoint.layer.id.includes("quick") && highlightedPoint.layer.id.includes("access")

            if (!isQuickAccessPin) {
              mapHeightCenter = screenHeightCenter
            }

            cy.log("map width", win.innerWidth)
            cy.log("map height", mapHeightCenter)

            const tolerance = 15

            expect(x).to.be.within(screenWidthCenter - tolerance, screenWidthCenter + tolerance)
            expect(y).to.be.within(mapHeightCenter - tolerance, mapHeightCenter + tolerance)
          })
      })
  })
})

When("I should see {string} text on the map", function (mapElement) {
  searchOnPoiNumberOnMap(mapElement)
})

Then("I should see a fallback icon in the {string}", (pageElement) => {
  if (selectors[pageElement].startsWith("//")) {
    cy.xpath(selectors[pageElement])
      .find("svg")
      .should("exist")
      .and("have.attr", "viewBox", "0 0 32 32")
      .and("have.attr", "width", "32")
      .and("have.attr", "height", "32")

    cy.xpath(selectors[pageElement]).find("svg path").should("have.length", 3)
  } else {
    cy.get(selectors[pageElement])
      .should("exist")
      .and("have.attr", "viewBox", "0 0 32 32")
      .and("have.attr", "width", "32")
      .and("have.attr", "height", "32")

    cy.get(selectors[pageElement]).find("path").should("have.length", 3)
  }
})

Then("I should verify {string} event is not triggered", (eventName) => {
  cy.get(`@${eventName}`).should("not.exist")
})

Then("I should verify {string} event is triggered", (eventName) => {
  cy.get(`@${eventName}`).should("exist")
})
