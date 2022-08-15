module.exports = {
    "up": `INSERT INTO users (accountId, accountName, isActive) 
	VALUES 
	(0, 'Klemen', true),
	(1, 'Miha', false),
	(2, 'Luka', true);`,
    "down": `DELETE FROM users WHERE accountId='first_id';
	DELETE FROM users WHERE accountId='second_id';
	DELETE FROM users WHERE accountId='third_id';`
}