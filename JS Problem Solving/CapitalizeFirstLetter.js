function CapitalizeFirstLetter(str) {
  let result = "";
  let strarray = str.split(" ");
  for (let word of strarray) {
    if (word.length > 0) {
      result += word[0].toUpperCase() + word.slice(1);
    }
  }
  return result;
}
console.log(CapitalizeFirstLetter("hello world"));
