function secondLargest(arr) {
  if (arr.length < 2) return null;

  let max = -Infinity;
  let secondMax = -Infinity;

  for (let num of arr) {
    if (num > max) {
      secondMax = max;
      max = num;
    } else if (num > secondMax && num < max) {
      secondMax = num;
    }
  }

  return secondMax === -Infinity ? null : secondMax;
}

console.log(secondLargest([2, 3, 5, 1, 21, 18])); // Output: 18
