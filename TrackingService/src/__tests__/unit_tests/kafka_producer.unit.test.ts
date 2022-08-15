import { createProduceFunction, createKafka, createKafkaProducer } from '../../kafka_producer';

const mockKafka = createKafka('mock_kafka', ['']); 

describe('kafka_producer unit tests', () => {
	test('producer produces message', done => {
		const mockProducer = createKafkaProducer(mockKafka);
		mockProducer.connect = async () => {return;};
		mockProducer.send = (async params => {
			expect(params.topic).toBe("topic");
			expect(params.messages).toStrictEqual([
				{key: "none", value: "message", partition: 0 }
			]);
			done();
			
		});
		const produce = createProduceFunction(mockProducer, "topic", 0);
		produce("message");
			
	});
	test('normal call does not throw error', async() => {
		const mockProducer = createKafkaProducer(mockKafka);
		mockProducer.connect = async () => {return;};
		mockProducer.send = (async params => {return;});
		const produce = createProduceFunction(mockProducer, "topic", 0);
		const error = await produce("message");
		expect(error).toBe(null);
	});
	test('producer throws error', async() => {
		const mockProducer = createKafkaProducer(mockKafka);
		mockProducer.connect = async () => {return;};
		mockProducer.send = (async params => {
			throw Error("Producing failed");
			
		});
		const produce = createProduceFunction(mockProducer, "topic", 0);
		const error = await produce("message");
		expect(error.message).toBe("Producing failed");
	});
});
