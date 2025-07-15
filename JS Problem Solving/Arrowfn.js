function demoMapAndSet() {
  // --- Map Example ---
  const map = new Map();

  map.set("name", "Shahmeer");
  map.set("age", 25);
  map.set("isDeveloper", true);

  console.log("=== Map Example ===");
  console.log("Map size:", map);
  //   console.log("Get 'name':", map.get("name"));

  // Iterate over Map
  for (const [key, value] of map) {
    console.log(`${key} => ${value}`);
  }

  // --- Set Example ---
  const set = new Set();

  set.add("apple");
  set.add("banana");
  set.add("apple"); // duplicate, will be ignored
  set.add("orange");

  console.log("\n=== Set Example ===");
  console.log("Set size:", set);
  console.log("Has 'banana'?", set.has("banana"));

  // Iterate over Set
  for (const value of set) {
    console.log(value);
  }
}

demoMapAndSet();
