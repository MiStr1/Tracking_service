import express from 'express';
import bodyParser from 'body-parser';

/**
	* Base class for express app routes
*/
export abstract class CommonRoutesConfig {
    app: express.Application;
    name: string;

    constructor(app: express.Application, name: string) {
        this.app = app;
		this.app.use(bodyParser.urlencoded({ extended: false }));
		this.app.use(bodyParser.json());
        this.name = name;
        this.configureRoutes();
    }
    abstract configureRoutes(): express.Application;
}