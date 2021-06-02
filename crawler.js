function getXMLHTTP() {
  if (window.XMLHttpRequest) {
    return (xmlhttp = new XMLHttpRequest());
  } else {
    return (xmlhttp = new ActiveXObject("Microsoft.XMLHTTP"));
  }
}

function serachForTheText(content, url, text) {
  const extractedContent = extractContent(content);
  const allTags = new RegExp(`(\w*\d*\s*){3}\s*${text}\s*(\w*\d*\s*){3}`, "gi");
  const matches = [...extractedContent.matchAll(allTags)];
  const filteredMatches = matches.filter((match) =>
    match[0].includes(`${text}`)
  );
  const allMatches = filteredMatches.map((match) => {
    const matchIndex = match.index;
    const afterMatch = extractedContent.substr(matchIndex, text.length + 5);
    const beforeMatch = extractedContent.substr(matchIndex - 5, 5);
    const context = (beforeMatch + afterMatch).trim();
    return { url, context };
  });

  return getUniqueArrayOfObjects(allMatches);
}

function selectLinks(content, baseUrl) {
  const linkRegex = new RegExp(`(?<=href=\")(.*?)(?=\")`, "gi");
  const linkWithoutHTTPRegex = new RegExp(`(?<=href=\"/)(.*?)(?=/\")`, "gi");

  let regex = [];

  if (!globalHttpEnabled) {
    regex = linkWithoutHTTPRegex;
  } else {
    regex = linkRegex;
  }

  const linksMesh = [...content.matchAll(regex)];
  const links = [];

  linksMesh.forEach((link) => {
    if (!globalHttpEnabled) {
      links.push(baseUrl + link[0]);
    } else if (link[0].includes(baseUrl)) {
      links.push(link[0]);
    }
  });

  return links;
}

function searchForNewLinks(content, baseUrl, currentUrl) {
  const links = selectLinks(content, baseUrl);

  for (i in links) {
    const isVisited = urlStack.visited[links[i]] !== undefined;
    const isOneLevelDeep = getAmountCharsInString(links[i], "/") == 3;
    const isTwoLevelDeep = getAmountCharsInString(links[i], "/") == 4;
    if (!isVisited && (isOneLevelDeep || isTwoLevelDeep)) {
      urlStack.new[links[i]] = links[i];
    }
  }
  urlStack.visited[currentUrl] = currentUrl;
  return links;
}

function visit(baseUrl, url, text) {
  console.info("Visiting", url);
  const xmlhttp = getXMLHTTP();
  xmlhttp.onreadystatechange = function () {
    if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
      const siteContent = xmlhttp.responseText;
      const matches = serachForTheText(siteContent, url, text);
      globalMatches.push(...matches);
      const newLinks = searchForNewLinks(siteContent, baseUrl, url);
      manageStack(newLinks);
      return xmlhttp.responseText;
    }
  };
  xmlhttp.open("GET", url, false);
  xmlhttp.send();
}

function httpGet(baseUrl, httpEnabled, text, pages) {
  resetUrlStack();
  urlStack.current[baseUrl] = baseUrl;
  globalHttpEnabled = httpEnabled;

  let visitedCount = Object.keys(urlStack.visited).length;

  let loopCounter = 0;
  while (1) {
    if (loopCounter >= pages) {
      showResultsAndReset();
      return;
    }
    for (key in urlStack.current) {
      visitedCount = Object.keys(urlStack.visited).length;
      if (visitedCount >= pages) {
        showResultsAndReset();
        return;
      }
      visit(baseUrl, urlStack.current[key], text);
    }
    visitedCount = Object.keys(urlStack.visited).length;
    urlStack.current = urlStack.new;
    urlStack.new = {};
    loopCounter++;
  }

  showResultsAndReset();
}
