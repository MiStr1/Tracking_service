import { createProduceFunction, createKafka, createKafkaProducer } from '../../kafka_producer';
const uuid = require('uuid');

const testIdString = uuid.v4().toString(); 
const kafka = createKafka('tracking_service', [`${process.env.KAFKA_HOST}:${process.env.KAFKA_PORT}`])

describe('createProduceFunction integration tests', () => {
	beforeAll(async () => {
		console.log("started topic creation");
		console.log(testIdString);
		const admin = kafka.admin();
		await admin.connect();
		await admin.createTopics({
			topics: [{topic: testIdString, replicationFactor: 1, numPartitions: 1}],
			waitForLeaders: true,
		});
		console.log("topic created");
	});
    it('produce message', done => {
		const consumer = kafka.consumer({ groupId: testIdString});
		const produce = createProduceFunction(createKafkaProducer(kafka), testIdString, 0);
		produce(testIdString);
		let outputMessage: string = undefined;
		
		const run = async () => {
			await consumer.connect();
			console.log("connected");
			await consumer.subscribe({ topics: [testIdString], fromBeginning: true });
			console.log("subscribed");
			consumer.run({
				eachMessage: async  ({ message }) => {
					outputMessage = message.value.toString()
				}
			})
		}
		run();
		setInterval(async () => {
			if (outputMessage !== undefined) {
				expect(outputMessage).toBe(testIdString);
				outputMessage = undefined;
				await consumer.disconnect();
				done();
			}
		},500);
	})
});
