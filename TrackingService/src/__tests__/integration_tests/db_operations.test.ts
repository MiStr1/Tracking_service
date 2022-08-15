import { findOneUser } from '../../database/db_operations';
import { User } from "../../types/user";
import {db} from "../../database/db_source";

describe('db/db_operations integration tests', () => {
    it('find user with correct id', done => {
        findOneUser(0, (err: Error, user: User) => {
			if (err) {
				throw err;
			}
			expect(user.accountId).toBe(0);
			expect(user.accountName).toBe("Klemen");
			expect(user.isActive).toBe(true);
			done();
		}, db);
    });
	it('find another user with correct id', done => {
        findOneUser(1, (err: Error, user: User) => {
			if (err) {
				throw err;
			}
			expect(user.accountId).toBe(1);
			expect(user.accountName).toBe("Miha");
			expect(user.isActive).toBe(false);
			done();
		}, db);
    });
	it('find user which does not exist', done => {
        findOneUser(3, (err: Error, user: User) => {
			expect(err.message).toBe("Could not parse result");
			expect(user).toEqual(null);
			done();
		}, db);
    });
});
