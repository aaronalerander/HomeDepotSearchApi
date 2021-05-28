// puppeteer-extra is a drop-in replacement for puppeteer,
// it augments the installed puppeteer with plugin functionality

var TEST_ITEM = "showerhead";
var TEST_ITEM_SPLIT = TEST_ITEM.split(" ");

var SEARCH_PARAMETER = "";

if (TEST_ITEM_SPLIT.length < 2) {
  var item = TEST_ITEM_SPLIT[0];
  SEARCH_PARAMETER = SEARCH_PARAMETER.concat(item);
} else {
  for (i = 0; i < TEST_ITEM_SPLIT.length; i++) {
    if (i === TEST_ITEM_SPLIT.length - 1) {
      SEARCH_PARAMETER = SEARCH_PARAMETER.concat(TEST_ITEM_SPLIT[i]);
    } else {
      SEARCH_PARAMETER = SEARCH_PARAMETER.concat(TEST_ITEM_SPLIT[i]);
      SEARCH_PARAMETER = SEARCH_PARAMETER.concat("%20");
    }

    console.log(TEST_ITEM_SPLIT[i]);
  }
}

SEARCH_PARAMETER = SEARCH_PARAMETER.concat("&filter=43j");
console.log(SEARCH_PARAMETER);

var url = "https://www.homedepot.ca/search?q=";
url = url.concat(SEARCH_PARAMETER);
console.log(url);

//https://www.homedepot.ca/search?q=dewalt%20drill&filter=43j
//dewalt&filter=43j
//dewalt%20drill&filter=43j
//dewalt%20power%20drill&filter=43j

const puppeteer = require("puppeteer-extra");

// add stealth plugin and use defaults (all evasion techniques)
const StealthPlugin = require("puppeteer-extra-plugin-stealth");
puppeteer.use(StealthPlugin());

// puppeteer usage as normal
puppeteer.launch({ headless: false }).then(async (browser) => {
  const page = await browser.newPage();

  await page.goto(
    url
    //"https://www.homedepot.ca/search?q="
    //"https://www.homedepot.ca/product/mr-fothergill-s-seeds-dill-bouquet-organic-seeds/1000767058"
  );

  /*
  await page.waitForSelector(".acl-input.ng-untouched.ng-pristine.ng-valid", {
    visible: false,
  });

  await page.type(
    ".acl-input.ng-untouched.ng-pristine.ng-valid",
    "dewalt drill"
  );

  await page.keyboard.press("Enter");

  await page.waitForNavigation({ waitUntil: "load" });

  await page.waitForSelector(".hdca-checkbox__faux-checkbox", {
    visible: false,
  });

  await page.click(".hdca-checkbox__faux-checkbox", { button: "left" });


    */

  await page.waitForSelector(
    ".acl-product-card__title--product-name.ng-star-inserted",
    {
      visible: false,
    }
  );

  await page.click(".acl-product-card__title--product-name.ng-star-inserted", {
    button: "left",
  });

  /*
  await page.waitForTimeout(5000);

  await page.waitForSelector(
    ".acl-mx--xx-small.acl-display--hide.md:acl-display--inline-block",
    {
      visible: false,
    }
  );

  const location = await page.evaluate(
    () =>
      document.querySelector(
        "acl-mx--xx-small acl-display--hide md:acl-display--inline-block"
      ).innerHTML
  );

  console.log(location);


  */

  //await page.waitForTimeout(5000);

  await page.waitForSelector("#canvas"); // wait for the selector to load
  const element = await page.$("#canvas"); // declare a variable with an ElementHandle
  await page.setViewport({
    width: 1440,
    height: 10000, // set whatever you want
  });
  await element.screenshot({ /*fullPage: true,*/ path: "item.png" }); // take screenshot element in puppeteer

  var inner_html = await page.evaluate(
    () =>
      document.getElementsByClassName(
        "acl-display--flex acl-flex--column md:acl-flex--row acl-mr--x-small"
      )[0].lastElementChild.innerText
  );

  inner_html = inner_html.replace("|", "");
  console.log(inner_html);

  await page.screenshot({ path: "testresult.png", fullPage: true });

  await page.waitForTimeout(600000);

  await browser.close();
  console.log(`All done, check the screenshot. ✨`);
});

///document.getElementsByClassName("acl-display--flex acl-flex--column md:acl-flex--row acl-mr--x-small")[0].lastElementChild.innerText;
