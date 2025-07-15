function findMissingNumber(arr, n) {
  // n should be the total number of elements that should be in the array including the missing number.
  // we will use gauss formula here
  // gauss formula = sum of all array elements will return the missing number
  const gaussFormula = (n * (n + 1)) / 2; //15

  let sumOfArrayElements = 0;

  for (let i = 0; i < arr.length; i++) {
    sumOfArrayElements += arr[i];
  }

  console.log(gaussFormula - sumOfArrayElements); //actual = 12
}
findMissingNumber([1, 2, 4, 5], 5);
