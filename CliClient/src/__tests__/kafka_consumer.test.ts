import { startConsuming, defaultCallback } from '../kafka_consumer';

describe('startConsuming kafka_consumer integration tests', () => {
    it('consume messages from TrackingService', done => {
		startConsuming(
						(filterId) => (message) => {
							// from app.test.ts from TrackingService
							if (JSON.parse(message.value.toString())['accountId'] == "0") {
								expect(JSON.parse(message.value.toString())['data']).toBe("test");
								done();
							}
							return true;
						},
						'test-cli_id', 
						[process.env.KAFKA_HOST],
						["0"],
						"test-cli_group_id"
		).catch(e => console.error(`${e.message}`, e));
    });
});

describe('defaultCallback unit tests', () => {
	test('test filtering', () => {
		const callback = defaultCallback(["one_id", "another_one"]);

		const response1 = callback({value: '{"accountId": "one_id", "data": "something"}'});

		const response2 = callback({value: '{"accountId": "another_one", "data": "something"}'});		

		const response3 = callback({value: '{"accountId": "something_else", "data": "something"}'});		

		expect(response1).toBe(true);
		expect(response2).toBe(true);
		expect(response3).toBe(false);
		
    });
});

