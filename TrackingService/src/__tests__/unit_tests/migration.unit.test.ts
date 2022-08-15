import { migrate, initiateErrorHandlerFunc } from '../../migration';
const mockMigration = require('mysql-migrations');
const mysql = require('mysql2');


const mockPool = mysql.createPool({
		host: process.env.DB_HOST,
		user: process.env.DB_USER,
		password: process.env.DB_PWD,
		database: process.env.DB_NAME,
		port: Number(process.env.DB_PORT)
});

describe('migration unit tests ', () => {
	afterEach(() => {
		jest.restoreAllMocks();
	});
	test('MAX_CONNECTION_RETRIES crossed', done => {
		const mockParams = {MAX_MIGRATION_RETRIES: "0",
							MAX_CONNECTION_RETRIES: "0",
							RETRY_TIMER: "500"};

		mockPool.getConnection = (callback => {
			callback(Error("Connection failed"), null);
		});
		migrate(err => {
			expect(err.message).toBe("Connection failed");
			done();
		}, mockParams, mockPool, mockMigration);
					
	});
	
	test('Wait once for the pool to connect and then migrate successfully', done => {
		const mockParams = {MAX_MIGRATION_RETRIES: "2",
							MAX_CONNECTION_RETRIES: "15",
							RETRY_TIMER: "500"};
		mockMigration.init =  ((pool, migrationFolder, callback) => {
			callback();
		});
		mockPool.getConnection = jest.fn()
		.mockImplementationOnce(callback => {
			callback(Error("Connection failed"), null);
		}).mockImplementationOnce(callback => {
			callback(null, null);
		});
		migrate(err => {
			expect(err).toBe(null);
			done();
		}, mockParams, mockPool, mockMigration);
					
	});
	
	test('test unhandled error reaction from migration.init', done => {
		const dummyIntervalId = setInterval(() => {return;}, 1000);
		const mockCallback = (err) => {
			expect(err.message).toBe("Unhandled error");
			done();
		}
		
		const errorHandler = initiateErrorHandlerFunc("0", mockMigration, mockPool, dummyIntervalId, mockCallback);
		errorHandler(Error("Unhandled error"));	  
	
	});
	
	test('Execute migration on second try', done => {
		
		const mockParams = {MAX_MIGRATION_RETRIES: "1"};
		const dummyIntervalId = setInterval(() => {return;}, 1000);
		const mockCallback = (err) => {
			expect(err).toBe(null);
			done();
		}
		mockMigration.init =  ((pool, migrationFolder, callback) => {
			callback();
		});
		
		const errorHandler = initiateErrorHandlerFunc(mockParams, mockMigration, mockPool, dummyIntervalId, mockCallback);
		errorHandler(Error("Unhandled error"));	  
	
	});

});
