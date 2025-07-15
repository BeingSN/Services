function Vowels(str) {
  let count = 0;
  const vowels = "aeiou";
  for (let chars of str) {
    if (vowels.includes(chars)) {
      count++;
    }
  }
  return count;
}
console.log(Vowels("HelloWorld"));
