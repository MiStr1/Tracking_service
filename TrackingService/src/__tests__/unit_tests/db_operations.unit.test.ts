import { findOneUser } from '../../database/db_operations';
import { User } from "../../types/user";
// using mysql because of issue https://github.com/sidorares/node-mysql2/issues/489
const mysql = require('mysql');

export const mockDb = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PWD,
  database: process.env.DB_NAME,
  port: Number(process.env.DB_PORT)
});



describe('db/db_operations unit tests', () => {
	afterAll(() => {
		mockDb.end();
	});
    test('db.query throws error', done => {
		mockDb.query = ((queryString, accountId, callback) => {
			return callback(Error('Query error'), null);
		});
		
		findOneUser(0, (err: Error, user: User) => {
			expect(err.message).toBe('Query error');
			expect(user).toEqual(null);
			done();
		}, mockDb);
		
		
    });
	test('db.query returns empty array', done => {
		mockDb.query = ((queryString, accountId, callback) => {
			return callback(null, []);
		});
		
		findOneUser(0, (err: Error, user: User) => {
			expect(err.message).toBe('Could not parse result');
			expect(user).toEqual(null);
			done();
		}, mockDb);
		
    });
	
	test('db.query returns a user', done => {
		mockDb.query = ((queryString, accountId, callback) => {
			return callback(null, [{accountId: accountId, accountName: "name", isActive: 1}]);
		});
		
		findOneUser(0, (err: Error, user: User) => {
			expect(user.accountId).toBe(0);
			expect(user.accountName).toBe("name");
			expect(user.isActive).toBe(true);
			done();
		}, mockDb);
		
    });
});
