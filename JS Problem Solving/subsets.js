function subsets(nums) {
  let result = [[]];

  for (let num of nums) {
    // Iterate through each number in the nums array
    const currentSize = result.length; // Get the current size of result to use it in the loop.

    for (let i = 0; i < currentSize; i++) {
      let subArray = [...result[i], num]; // Create a new subarray by adding the current number to the result[i] element.
      result.push(subArray);
    }
  }

  return result; // Return all possible variations of arrays from the numbers.
}
