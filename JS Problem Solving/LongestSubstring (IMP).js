function longestSubStrings(str) {
  //sliding window

  if (!str) {
    return 0;
  }

  let end = 0;
  let start = 0;
  let maxLength = 0;

  const uniqueChars = new Set();

  while (end < str.length) {
    if (!uniqueChars.has(str[end])) {
      uniqueChars.add(str[end]);
      end++;
      maxLength = Math.max(maxLength, uniqueChars.size);
      console.log(uniqueChars);
    } else {
      uniqueChars.delete(str[start]);
      start++;
    }
  }
  console.log(maxLength);
}

longestSubStrings("abcabxcbb");

function findLongSubString(str) {
  let end;
  let start;
  let maxLength;

  const uniqueChars = new Set();

  while (end < str.length) {
    if (!uniqueChars.has(str[end])) {
      uniqueChars.add(str[end]);
      end++;
      maxLength = Math.max(maxLength);
    } else {
      uniqueChars.delete(str[start]);
      start++;
    }
  }
}

findLongSubString("abcabxcbb");
