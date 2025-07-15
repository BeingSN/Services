function removeDuplicates(arr) {
  let results = [];

  for (let i = 0; i < arr.length; i++) {
    if (!results.includes(arr[i])) {
      results.push(arr[i]);
    }
  }
  console.log(results);
}

removeDuplicates([1, 2, 2, 3, 4, 4, 5]);
