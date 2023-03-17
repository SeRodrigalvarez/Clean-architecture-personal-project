import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Db, MongoClient } from 'mongodb';

@Injectable()
export class MongoDatabaseConnection {
    private db: Db;

    constructor(private config: ConfigService) {
        const client = new MongoClient(this.config.get('MONGODB_URL'));
        this.db = client.db(this.config.get('MONGODB_DATABASE'));
    }

    get database() {
        return this.db;
    }
}
