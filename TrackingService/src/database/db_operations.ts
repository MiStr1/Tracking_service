import {User} from "../types/user";
import { RowDataPacket, Connection } from "mysql2";

/**
   * Queries the database for user with specified accountId and then calls callback function with found user and possible error.
   *
   * @param accountId - accountId of the searched user
   * @param callback - function which is called after the query
   * @param conn - connection to the MySqldatabase
   * 
   * @returns Nothing
*/
export const findOneUser = (accountId: number, callback: (arg1: Error, arg2: User) => void, conn: Connection) => {

  const queryString = `
    SELECT 
      *
    FROM users 
    WHERE users.accountId=?`
    
  conn.query(queryString, accountId, (err, result) => {
    if (err) {
		callback(err, null);
		return;
	}
	try { 
		const row = (<RowDataPacket> result)[0];
		console.log(row)
		const user: User =  {
			accountId: row.accountId,
			accountName: row.accountName,
			isActive: row.isActive === 1
		};
		callback(null, user);
	}
	catch (error) {
		console.log("user not found");
		callback(Error("Could not parse result"), null);
	}
  });
}
