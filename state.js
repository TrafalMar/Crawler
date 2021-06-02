let urlStack = {
  current: {},
  new: {},
  visited: {},
};

let globalMatches = [];
let globalHttpEnabled = false;

function resetUrlStack() {
  urlStack = {
    current: {},
    new: {},
    visited: {},
  };
}

function manageStack(url) {
  if (typeof url == "string") {
    urlStack[url] = url;
  } else if (typeof url == "object") {
    urlStack = { ...urlStack, ...url };
  }
}

function displayMatches() {
  console.log("");
  console.info("Total matches", globalMatches.length);
  globalMatches.forEach((match) =>
    console.info(`${match.url} => ${match.context}`)
  );
  console.log("");
}

function showResultsAndReset() {
  displayMatches();
  resetUrlStack();
  globalMatches = [];
}
