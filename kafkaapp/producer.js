const { kafka } = require("./client");

async function init() {
  const producer = kafka.producer();

  console.log("Connecting producer");

  await producer.connect();
  console.log("Producer connected!");

  await producer.send({
    topic: "rider-updates",
    messages: [
      {
        partition: 0,
        key: "location-update",
        value: JSON.stringify({
          name: "Message has been sent by Mohammad Shahmeer to kafka so consumer can consume now.",
          loc: "South Pakistan",
        }),
      },
    ],
  });
  await producer.disconnect();
}

init();
