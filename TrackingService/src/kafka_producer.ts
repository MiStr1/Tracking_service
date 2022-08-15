import { Kafka, Producer } from 'kafkajs';

/**
   * Creates kafka object.
   *
   * @param clientId - Name of the created kafka client
   * @param brokers - Array with 'host:port' strings for kafka brokers
   * @returns Kafka object
*/
export const createKafka = (clientId: string, brokers: Array<string>) => {
	return new Kafka({
		clientId: clientId,
		brokers: brokers
});
};


/**
   * Creates kafka producer.
   *
   * @param kafka - Kafka object
   * @returns Kafka producer object of the Kafka object
*/
export const createKafkaProducer = (kafka: Kafka) => {
	return kafka.producer({
		allowAutoTopicCreation: false,
		transactionTimeout: 30000
	});
};
	
/**
   * Creates produce function.
   *
   * @param producer - Kafka producer object
   * @param topic - Topic to which the produce function will send messages
   * @param partition - Partition to which the produce function will send messages
   * @returns Function which takes string parameter message and sends it to kafka broker through producer.
*/
export const createProduceFunction = (	producer: Producer,
										topic: string,
										partition: number) => {

	return async (message) => {
		await producer.connect()
		try {
			await producer.send({
				topic: topic,
				messages: [
					{ key: "none", value: message, partition: partition },
				],
			});
			return null;
		}

		catch (err) {
			console.error("could not write message " + err);
			return err;
		}
	};
}