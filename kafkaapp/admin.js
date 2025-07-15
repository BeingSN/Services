const { kafka } = require("./client");

async function init() {
  const admin = kafka.admin();

  try {
    console.log("admin connecting");
    await admin.connect();
    console.log("admin connected successfully");

    // Check if topic exists first
    const existingTopics = await admin.listTopics();

    if (!existingTopics.includes("rider-updates")) {
      console.log("Creating Topic [rider-updates]");
      await admin.createTopics({
        topics: [
          {
            topic: "rider-updates",
            numPartitions: 2,
          },
        ],
      });
      console.log("Topic created successfully");
    } else {
      console.log("Topic [rider-updates] already exists");
    }
  } catch (error) {
    console.error("Error:", error);
  } finally {
    await admin.disconnect();
    console.log("admin disconnected!");
  }
}

init();
