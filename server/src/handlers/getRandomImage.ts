import { AzureFunction } from '@azure/functions';
import { getImagesContainer } from '../database';

const handler: AzureFunction = async function (context) {
  const container = await getImagesContainer();

  const count = await container.items.query('SELECT COUNT(1) as cnt from c').fetchAll();
    console.log( count.resources[0].cnt);
  const offset = Math.floor(Math.random() * count.resources[0].cnt);
  const data = await container.items.query(`SELECT * from c OFFSET ${offset} LIMIT 1`).fetchAll();

  if (data.resources.length === 0) {
    context.res = {
      status: 204,
    };
  } else {
    context.res = {
      body: data.resources[0],
    };
  }
};

export default handler;
