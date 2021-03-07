import { AzureFunction, HttpRequest } from '@azure/functions';
import { BlobSASPermissions, BlobServiceClient } from '@azure/storage-blob';
import { v1 as uuid } from 'uuid';

const getWritePermission = () => {
  const permission = new BlobSASPermissions();
  permission.write = true;
  return permission;
};

const getFileName = (req?: HttpRequest): string => {
  if (req?.body?.fileName || req?.query.fileName) {
    const name = req?.body?.fileName || req?.query.fileName;
    return `${uuid()}-${name}`;
  }

  return `${uuid()}.image`;
};

const handler: AzureFunction = async function (context) {
  const blobServiceClient = BlobServiceClient.fromConnectionString(process.env.BLOB_STORAGE_CONNECTION_STRING!);

  const containerClient = blobServiceClient.getContainerClient('images');
  await containerClient.createIfNotExists({ access: 'blob' });

  const blockBlobClient = containerClient.getBlockBlobClient(getFileName(context.req));
  await blockBlobClient.upload('', 0);

  var writeExpire = new Date();
  writeExpire.setMinutes(writeExpire.getMinutes() + 5);
  const writeUrl = await blockBlobClient.generateSasUrl({ permissions: getWritePermission(), expiresOn: writeExpire });

  context.res = {
    body: { readUrl: blockBlobClient.url, writeUrl },
  };
};

export default handler;
