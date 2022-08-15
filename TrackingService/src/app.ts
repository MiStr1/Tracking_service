import express from 'express';
import * as http from 'http';
import { migrate } from './migration';

import cors from 'cors';
import {CommonRoutesConfig} from './routes/common_routes_config';
import {UsersRoutes} from './routes/users_routes_config';
const port = 3000;
export const app: express.Application = express();
const routes: Array<CommonRoutesConfig> = [];

app.use(express.json());

app.use(cors());

routes.push(new UsersRoutes(app));

if (require.main === module) {
	console.log("finished running migration");

	migrate((err) => {
		if (err) throw err;
		const server: http.Server = http.createServer(app);
		
		server.listen(port, () => {
			console.log(`Server running at http://localhost:${port}`);
		});
	});
}