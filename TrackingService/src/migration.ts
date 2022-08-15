import * as mysql from 'mysql2';
import * as migration from 'mysql-migrations';

/**
   * Creates function which is used for unchaught errors when migration is initiated.
   *
   * @param maxMigrationRetries - Number of times this function is called before it returns the error to the callback function.
   * @param migrationClass - Class containing migration function
   * @param migrationPool - MySql pool used for connecting to the database
   * @param intervalId - Id of interval of the main function to stop the interval when callback is called
   * @param callback - function called after the migration process is finished
   * @param timesUncaughtErrorThrown - Number of times uncaught error was already thrown before 
   * 
   * @returns Function which handles unchaught errors thrown during migration process
*/
export const initiateErrorHandlerFunc = (maxMigrationRetries, migrationClass, migrationPool, intervalId, callback, timesUncaughtErrorThrown=0) => (err) => {
		console.log('There was an uncaught error', err);
		timesUncaughtErrorThrown += 1;
		if (timesUncaughtErrorThrown > Number(maxMigrationRetries)) {
			clearInterval(intervalId);
			migrationPool.end();
			callback(err);
			return;
		}
		setTimeout(async () => {
			migrationClass.init(migrationPool, __dirname + '/migrations', function() {
				clearInterval(intervalId);
				migrationPool.end();
				callback(null);
				return;
			});
		}, 1000);
};

/**
   * Starts up migrations from src/migration folder to the database and then calls callback function with possible error
   *
   * @param callback - function called after the migration process is finished
   * @param params - Contains database parameters and parameters containing the number of retries for database connection or migrations
   * @param pool - MySql pool which connects to the database for migrations
   * @param migrationClass - Class containing migration function
   * 
   * @returns Nothing
*/
export const migrate = (callback, params=process.env, pool: mysql.Pool = undefined, migrationClass=migration) => {
	// start up mirgrations 
	process.argv[2] = "up";
	
	params.MAX_CONNECTION_RETRIES = params.MAX_CONNECTION_RETRIES ??  '15'; 
	params.MAX_MIGRATION_RETRIES = params.MAX_MIGRATION_RETRIES ??  '1';
	params.RETRY_TIMER = params.RETRY_TIMER ??  '5000';

	let timesErrorThrown = 0;
	
	const migrationPool = pool ?? mysql.createPool({
		host: params.DB_HOST,
		user: params.DB_USER,
		password: params.DB_PWD,
		database: params.DB_NAME,
		port: Number(params.DB_PORT)
	});
		
		
	const intervalId = setInterval(() => {
		migrationPool.getConnection(async (err, connection) => {
			if (err) { // not connected!
				console.log("failed connecting to the db");
				console.log(err.message);
				timesErrorThrown += 1;
				if (timesErrorThrown >= Number(params.MAX_CONNECTION_RETRIES)) {
					callback(err);
				}
				return;
			}
			migrationClass.init(migrationPool, __dirname + '/migrations', function() {
				clearInterval(intervalId);
				migrationPool.end();
				callback(null);
				
			});
			return;
			
		});

	}, Number(params.RETRY_TIMER));
			
	process.on('uncaughtException', initiateErrorHandlerFunc(params.MAX_MIGRATION_RETRIES, migrationClass, migrationPool, intervalId, callback));
};