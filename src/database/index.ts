import { Container, CosmosClient } from '@azure/cosmos';

const endpoint = process.env.COSMOS_ENDPOINT || process.env.APPSETTINGS_COSMOS_ENDPOINT!;
const key = process.env.COSMOS_KEY || process.env.APPSETTINGS_COSMOS_KEY;
const client = new CosmosClient({ endpoint, key });

const getImagesContainer = async (): Promise<Container> => {
  const { database } = await client.databases.createIfNotExists({ id: 'Test Database' });
  const { container } = await database.containers.createIfNotExists({ id: 'Test Container' });
  return container;
};

export { getImagesContainer };
