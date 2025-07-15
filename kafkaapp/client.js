const { Kafka } = require("kafkajs");

exports.kafka = new Kafka({
  clientId: "mykafka-app",
  brokers: ["localhost:9092"],
});
