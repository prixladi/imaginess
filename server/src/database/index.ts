import { Container, CosmosClient } from '@azure/cosmos';

const endpoint = process.env.COSMOS_ENDPOINT!;
const key = process.env.COSMOS_KEY;
const client = new CosmosClient({ endpoint, key });

const getImagesContainer = async (): Promise<Container> => {
  const uniqueKeyPolicy = { uniqueKeys: [{ paths: ['/url'] }] };

  const { database } = await client.databases.createIfNotExists({ id: 'Imaginess' });
  const { container } = await database.containers.createIfNotExists({ id: 'images', uniqueKeyPolicy });
  return container;
};

export { getImagesContainer };
