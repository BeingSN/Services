const autocannon = require("autocannon");

const run = () => {
  const instance = autocannon(
    {
      url: "http://localhost:3000",
      duration: 30, // Test duration in seconds
    },
    (err, result) => {
      if (err) {
        console.error("Error during stress test:", err);
        return;
      }
      console.log(`Total requests made: ${result.requests.total}`);
    }
  );
};

run();
