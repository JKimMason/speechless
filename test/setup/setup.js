const jsdom = require("jsdom");
const documentHTML =
  '<!doctype html><html><body><div id="root"></div></body></html>';
global.document = new jsdom.JSDOM(documentHTML);
global.window = document.parentWindow;
