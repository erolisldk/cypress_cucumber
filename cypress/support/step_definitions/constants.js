const baseUrl = "htps://www.optimum7.com"
const DEFAULT_TIMEOUT_DURATION = 60000

const mobileDeviceDimensions = {
    "iPhone 12 Pro": [390, 844],
    "Samsung Galaxy S20 Ultra": [412, 915],
    "Pixel 5": [393, 851],
    "iPhone SE": [375, 667],
    "iPhone XR": [414, 896],
    "Samsung Galaxy A51/71": [412, 914],
    "Samsung Galaxy S8+": [360, 740],
    "Macbook Pro 16": [3546, 2234],
    "iPad 2": [768, 1024],
  }

  const pointrMap = "#pointr-maplibre-map"
const pointrWatermark = "#pointr-logo"
const pointrMobileWatermark = "#pointr-mobile-logo"
const pointrLoading = "#pointr-loading"

const selectors = {
    "Loading Animation": "div#pointr-loading",
    "Search Input": "//input[@id='pointr-search-input']",
    "Get Your 90-Day...": ".elementor-element-26144fe > .elementor-widget-container > .elementor-button-wrapper > .elementor-button",
}

const environmentURLs = {
    LegacyMock:
      "?apiUrl=https://mock-v8.pointr.cloud&clientInternalIdentifier=f33b7170-7ffd-462c-8bde-d536b725ac7d&clientSecret=test&siteInternalIdentifier=2"
}

export {
    baseUrl,
    clientConfig,
    DEFAULT_TIMEOUT_DURATION,
    pointrMap,
    pointrWatermark,
    pointrMobileWatermark,
    pointrLoading,
    searchInput,
    searchBarDefaultText,
    searchResults,
    searchToggleButton,
    zoomInButton,
    zoomOutButton,
    goButton,
    exitButton,
    poiDetails,
    poiNamePoiDetailsModal,
    languages,
    languageSelector,
    languageSelectorButton,
    selectedLanguage,
    selectedLang,
    routeButton,
    navigationButton,
    navigationTitle,
    navigationPrevButton,
    navigationNextButton,
    navigationExitButton,
    navigationEditButton,
    navigationWindow,
    levelSelector,
    levelSelectorTitle,
    levelSelectorTooltip,
    activeLevelSelection,
    activeLevelTitleSelector,
    routeSourceKey,
    startingLocation,
    destinationLocation,
    locationPoints,
    clearIconSearchInput,
    searchResultElements,
    firstResult,
    disabledZoomInButton,
    disabledZoomOutButton,
    searchResultsContainOnlyBuildingNames,
    disappearedExitButton,
    exitSampleBuilding1Button,
    exitSampleSiteButton,
    disabledSearchInput,
    upArrow,
    downArrow,
    allLevels,
    zoomButtonsContainer,
    mobileDeviceDimensions,
    selectors,
    environmentURLs,
    filePaths,
    filePathFinder,
    environments,
    
  }