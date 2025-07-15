function twoSum(arr, target) {
  const map = new Map();
  for (let i = 0; i < arr.length; i++) {
    let complement = target - arr[i]; // complement = 2 , i = 2
    if (map.has(complement)) {
      return [map.get(complement, i)];
    }
    map.set(arr[i], i); // 2 , i = 1
  }
}

twoSum([2, 7, 11, 15], 9);

function twoSumm(arr, target) {
  let indexes = {};
  for (let i = 0; i < arr.length; i++) {
    for (let j = i + 1; j < arr.length; j++) {
      if (arr[i] + arr[j] === target) {
        indexes[`${i} , ${j}`] = [arr[i], arr[j]];
      }
    }
  }
  console.log(indexes);
}

twoSumm([2, 7, 11, 15], 9);
