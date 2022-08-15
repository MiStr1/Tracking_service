import {migrate} from "./migration";

migrate((err) => {
	if (err) process.exit(1);
	console.log('finished running migration');
	process.exit(0);
});