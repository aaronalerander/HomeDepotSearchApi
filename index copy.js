const puppeteer = require("puppeteer-extra");

// add stealth plugin and use defaults (all evasion techniques)
const StealthPlugin = require("puppeteer-extra-plugin-stealth");

puppeteer.use(StealthPlugin());

var TEST_ITEM = "drywall knife";
var TEST_ITEM_SPLIT = TEST_ITEM.split(" ");

var SEARCH_PARAMETER = "";

if (TEST_ITEM_SPLIT.length < 2) {
  var item = TEST_ITEM_SPLIT[0];
  SEARCH_PARAMETER = SEARCH_PARAMETER.concat(item);
} else {
  for (let i = 0; i < TEST_ITEM_SPLIT.length; i++) {
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

puppeteer
  .use(StealthPlugin())
  .launch({ headless: true })
  .then(async (browser) => {
    const page = await browser.newPage();

    await page.setViewport({
      width: 1280,
      height: 800,
    });

    await page.setRequestInterception(true);

    page.on("request", (req) => {
      if (
        req.resourceType() == "stylesheet" ||
        req.resourceType() == "font" ||
        req.resourceType() == "image"
      ) {
        req.abort();
      } else {
        req.continue();
      }
    });

    console.log(url);
    await page.goto(url);

    await page.waitForTimeout(1095);

    await page.evaluate((_) => {
      window.scrollBy(0, window.innerHeight * 2);
    });

    await page.waitForSelector(
      ".acl-product-card__title--product-name.ng-star-inserted",
      {
        visible: false,
      }
    );

    await page.click(
      ".acl-product-card__title--product-name.ng-star-inserted",
      {
        button: "left",
      }
    );

    //await page.waitForSelector(".acl-image__image.ng-star-inserted", {
    //  visible: true,
    //});
    //await page.waitForSelector(
    //  ".acl-mb--medium.acl-product-card-group.acl-product-card-group--is-grid.ng-star-inserted"
    //);

    //await page.waitForNavigation({ waitUntil: "load" });
    //await page.waitForTimeout(5000);
    //await page.click(".acl-product-card__title-link.ng-star-inserted", {
    //button: "left",
    //});

    //await page.waitForSelector("#canvas"); // wait for the selector to load
    //const element = await page.$("#canvas"); // declare a variable with an ElementHandle
    //await page.$("#canvas"); // declare a variable with an ElementHandle

    /*await page.setViewport({
    width: 1440,
    height: 10000, // set whatever you want
  });*/

    //await element.screenshot({ /*fullPage: true,*/ path: "item.png" }); // take screenshot element in puppeteer

    /*var inner_html = await page.evaluate(
    () =>
      document.getElementsByClassName(
        "acl-display--flex acl-flex--column md:acl-flex--row acl-mr--x-small"
      )[0].lastElementChild!.innerText
  );*/

    //await page.waitForNavigation({ waitUntil: "load" });
    //await page.waitForTimeout(1000);

    //await page.waitForSelector(
    // ".acl-display--flex.acl-flex--column.md:acl-flex--row.acl-mr--x-small"
    //);

    await page.waitForTimeout(1095);

    var inner_html = await page.evaluate(
      () =>
        document.getElementsByClassName(
          "acl-display--flex acl-flex--column md:acl-flex--row acl-mr--x-small"
        )[0].lastElementChild.innerText
    );

    //inner_html.innerText;

    //inner_html = await inner_html.innerText.replace("|", "");
    inner_html = await inner_html.replace("|", "");
    console.log(inner_html);

    conv.add(`You can find ` + paramItem + " in " + inner_html);

    await browser.close();
  })
  .catch((er) => {
    console.log(er);
    return er;
  });
