function checkAnagram(str1, str2) {
  const str1Obj = {};
  const str2Obj = {};

  if (str1.length !== str2.length) {
    return;
  }

  for (let char of str1) {
    str1Obj[char] = (str1Obj[char] || 0) + 1;
  }
  for (let char of str2) {
    str2Obj[char] = (str2Obj[char] || 0) + 1;
  }
  for (key in str1Obj) {
    if (str1Obj[key] === str2Obj[key]) {
      console.log("They are anagrams");
      return;
    } else {
      console.log("They are not");
    }
  }
}

checkAnagram("silent", "listen");
