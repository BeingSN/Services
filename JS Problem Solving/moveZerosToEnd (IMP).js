function moveNonZerosToLeft(arr) {
  let index = 0;

  for (let i = 0; i < arr.length; i++) {
    if (arr[i] !== 0) {
      arr[index++] = arr[i]; //putting non zero on next index
    }
  }
  while (index < arr.length) {
    arr[index++] = 0; //putting 0 on that index
  }
  console.log(arr);
}

moveNonZerosToLeft([0, 1, 0, 3, 12]); //[1,3,12,0,0]

//using one loop
function moveNonZerosToRight(arr) {
  let right = arr.length - 1; //5
  let i = right; //5

  while (i >= 0) {
    if (arr[i] !== 0) {
      arr[right] = arr[i];
      if (right !== i) arr[i] = 0;
      right--;
    }
    i--;
  }

  console.log(arr);
}
moveNonZerosToRight([0, 1, 0, 3, 12]); //[,1,3,12,0,0]
