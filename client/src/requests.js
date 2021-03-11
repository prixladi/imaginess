import { BlockBlobClient } from '@azure/storage-blob';
import { apiUrl } from './config';

const createBlob = async (filename) => {
  const result = await fetch(`${apiUrl}/createBlob`, {
    method: 'POST',
    body: JSON.stringify({ filename }),
  });

  if (result.status >= 400) {
    throw new Error(`Unable to create blob Status: '${result.status}'`);
  }

  return await result.json();
};

const uploadFile = async ({ writeUrl, fileData }) => {
  const client = new BlockBlobClient(writeUrl);
  const matches = fileData.match(/^data:(.+);base64,(.+)$/);
  const buffer = Buffer.from(matches[2], 'base64');
  var uploadResult = await client.uploadData(buffer, { blobHTTPHeaders: { blobContentType: matches[1] } });
  if (!uploadResult._response.status >= 400) {
    throw new Error(`Unexpected upload status '${uploadResult._response.status}'`);
  }
};

const createImage = async ({ imageUrl, imageName }) => {
  const result = await fetch(`${apiUrl}/createImage`, {
    method: 'POST',
    body: JSON.stringify({ imageUrl, imageName }),
  });

  if (result.status >= 400) {
    throw new Error(`Unable to create image status: '${result.status}'`);
  }
};

const getRandomImage = async () => {
  const result = await fetch(`${apiUrl}/getRandomImage`);
  if (result.status >= 400) {
    throw new Error(`Unable to reatrieve image, status: '${result.status}'.`);
  }

  return await result.json();
};

export { createBlob, uploadFile, createImage, getRandomImage };
