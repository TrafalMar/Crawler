// ↓ Site with /something/foo type urls

const sites = {
  apple: { httpEnabled: false, link: "https://www.apple.com/", text: "Apple" },

  youtube: {
    httpEnabled: true,
    link: "https://www.youtube.com/",
    text: "Library",
  },

  lorem: {
    httpEnabled: true,
    link: "https://www.lipsum.com/",
    text: "Lorem Ipsum",
  },
};

const { httpEnabled, link, text } = sites.lorem;

const start = (pagesCount = 5) => {
  if (text.trim() == "") {
    return;
  }
  httpGet(link, httpEnabled, text, pagesCount);
};
