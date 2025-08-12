import 'dotenv/config';
import { DatabaseSync } from 'node:sqlite';

let connection: DatabaseSync | undefined = undefined;

export function getConnection(): DatabaseSync {
  if (!connection) {
    connection = new DatabaseSync(process.env.DATABASE_FILEPATH!);
  }
  return connection;
}
