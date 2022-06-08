import { rm } from 'fs';
import { join } from 'path';
import { getConnection } from 'typeorm';

global.beforeEach(() => {
  rm(join(__dirname, '..', 'test.sqlite'), () => {
    console.log('remove test.db completed');
  });
});

global.afterEach(async () => {
  const connection = getConnection();
  await connection.close();
});
