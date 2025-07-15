function EquilibriumIndex(arr) {
  let totalSum = 0; //0

  for (let i = 0; i < arr.length; i++) {
    totalSum += arr[i];
  }

  let leftSum = 0;

  // Step 2: Find equilibrium index
  for (let i = 0; i < arr.length; i++) {
    let rightSum = totalSum - leftSum - arr[i];

    if (leftSum === rightSum) {
      return i;
    }

    leftSum += arr[i];
  }
}
console.log(EquilibriumIndex([-7, 1, 5, 2, -4, 3, 0]));

// sum of array[i] - lefsum - arr[i]

// if(left===right) thats quilibirum and return i
