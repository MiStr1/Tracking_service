import { CommonRoutesConfig } from './common_routes_config';
import express from 'express';
import { findOneUser } from "../database/db_operations";
import { User } from "../types/user";
import  { createProduceFunction, createKafka, createKafkaProducer } from "../kafka_producer";
import { db } from '../database/db_source'

const kafka = createKafka('tracking_service', [`${process.env.KAFKA_HOST}:${process.env.KAFKA_PORT}`]);

const produce = createProduceFunction(createKafkaProducer(kafka), 'users-tracked', 0);

/**
	* Class for express app routes for endpoints with user database interactions
*/
export class UsersRoutes extends CommonRoutesConfig {
    constructor(app: express.Application) {
        super(app, 'UsersRoutes');
    }

    configureRoutes() {
        this.app.route('/:userId')
        .all((req: express.Request, res: express.Response, next: express.NextFunction) => {
            next();
        })
        .get((req: express.Request, res: express.Response) => {
			const userId = Number(req.params.userId);
			const data = req.query.data;
			findOneUser(userId, (err: Error, user: User) => {
				if (err) {
					return res.status(500).json({"message": err.message});
				}
				if (user.isActive && typeof data !== 'undefined') {
					produce(JSON.stringify({"data": data, "accountId": user.accountId, "timestamp": new Date().toJSON()}));
				}
				res.status(200).json({"user": user, "data": data});
			}, db);
			
        });
        return this.app;
    }
}
