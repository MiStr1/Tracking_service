module.exports = {
    "up": "CREATE TABLE users (accountId integer NOT NULL, UNIQUE KEY accountId (accountId), accountName VARCHAR(50), isActive BOOLEAN )",
    "down": "DROP TABLE users"
}