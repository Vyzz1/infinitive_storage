import { Injectable } from '@nestjs/common';
import db from './db';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }

  getHealth() {
    return db.query.users.findMany();
  }
}
