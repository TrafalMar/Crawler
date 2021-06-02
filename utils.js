function getUniqueArrayOfObjects(array) {
  const uniqueMatches = [];
  array.forEach((match) => {
    let isUnique = true;
    uniqueMatches.forEach((uniqueMatch) => {
      if (JSON.stringify(uniqueMatch) === JSON.stringify(match))
        isUnique = false;
    });
    if (isUnique) {
      uniqueMatches.push(match);
    }
  });
  return uniqueMatches;
}

function getAmountCharsInString(string, char) {
  let count = 0;

  for (index in string) {
    if (char == string[index]) {
      count++;
    }
  }
  return count;
}

function extractContent(s) {
  return s.replace(/<(?:.|\n)*?>/gm, "");
}
