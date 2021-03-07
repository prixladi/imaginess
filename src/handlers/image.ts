import { AzureFunction } from '@azure/functions';
import { getImagesContainer } from '../database';

export const create: AzureFunction = async function (context) {
  const container = await getImagesContainer();

  const doc = { name: 'Olympia', state: 'WA', isCapitol: true };

  await container.items.create(doc, { disableAutomaticIdGeneration: false });

  context.res = {
    body: doc,
  };
};

export const get: AzureFunction = async function (context) {
  const container = await getImagesContainer();

  const data = await container.items.query('SELECT * from c OFFSET 0 LIMIT 5').fetchAll();

  context.res = {
    body: data,
  };
};
