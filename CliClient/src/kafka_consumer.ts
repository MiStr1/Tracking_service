import { Kafka } from 'kafkajs';
const argv = require('minimist')(process.argv.slice(2));

const brokerArg = process.env.KAFKA_HOST ?? 'localhost:9092'
const groupIdArg = argv['group_id'] ??  'my-group';
const filterIdArg = argv['filter'] !== undefined ? argv['filter'].split(",") : []; 

/**
   * Creates function which is used for each message received from kafka consumer.
   *
   * @param filterId - Array of userIds of users for which this functions logs. If empty all users are loged
   * 
   * @returns Function that receives a message and logs it if filterId allows it and returns true if message was logged.
*/
export const defaultCallback = (filterId: Array<string>) => (message) => {
	JSON.parse(message.value.toString())['accountId']
	if (filterId.length === 0 || filterId.includes(JSON.parse(message.value.toString())['accountId'])) {
		console.log({
			value: message.value.toString()
		});
		return true;
	}
	return false;
};

/**
   * Creates function that creates kafka consumer and then starts consuming messages
   *
   * @param callback - Function used when message is received
   * @param clientId - Id for kafka client
   * @param brokers -  Array with 'host:port' strings for kafka brokers
   * @param filterId -   Array of userIds of users for which this functions logs. If empty all users are loged
   * @param groupId -   String with groupId used for kafka consumer
   * 
   * @returns Nothing
*/
export const startConsuming = async (callback=defaultCallback, clientId='cli-client', brokers=[brokerArg], filterId=filterIdArg, groupId=groupIdArg) => {  
	const kafka = new Kafka({
		clientId: clientId,
		brokers: brokers,
		retry: {
			retries: Number.POSITIVE_INFINITY
		}
	});
	const callbackFun = callback(filterId);
	const consumer = kafka.consumer({ groupId: groupId });
	await consumer.connect();
	await consumer.subscribe({ topics: ['users-tracked'], fromBeginning: true });

	await consumer.run({
		eachMessage: async ({ topic, partition, message, heartbeat, pause }) =>{
			callbackFun(message);
		}
	});
}
startConsuming().catch(e => console.error(`${e.message}`, e));
