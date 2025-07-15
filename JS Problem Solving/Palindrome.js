function checkPalindrome(str) {
  const cleanedStr = str.toLowerCase();
  let rerversedStr = "";

  for (let i = cleanedStr.length - 1; i >= 0; i--) {
    rerversedStr += cleanedStr[i];
  }
  console.log(cleanedStr === rerversedStr);
}

checkPalindrome("racecara");
