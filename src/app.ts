import express, { Application } from 'express';

import { MONGO_URL } from './constants/parserApi.constants';
import { Controller } from './main.controller';
import bodyParser from 'body-parser';
import cors from 'cors';
import mongoose from 'mongoose';

class App {
    public app: Application;
    public feedbackController: Controller;

    constructor() {
        this.app = express();
        this.setConfig();
        this.setMongoConfig();

        this.feedbackController = new Controller(this.app);
    }

    private setConfig() {
        this.app.use(bodyParser.json({ limit: '50mb' }));
        this.app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
        this.app.use(cors());
    }

      //Connecting to MongoDB database
    private setMongoConfig() {
        mongoose.Promise = global.Promise;
        mongoose.connect(MONGO_URL, {
            useNewUrlParser: true
        });
    }
}

export default new App().app;