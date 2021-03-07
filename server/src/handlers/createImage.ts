import { AzureFunction } from '@azure/functions';
import { getImagesContainer } from '../database';
import joi from 'joi';
import { validate } from '../utils';
import { Container } from '@azure/cosmos';

type NewImage = {
  imageUrl: string;
  imageName: string;
  imageDescription?: string;
};

const newImageSchema = joi
  .object<NewImage>({
    imageUrl: joi.string().uri().required(),
    imageName: joi.string().required(),
    imageDescription: joi.string().optional(),
  })
  .required();

const saveImage = async (data: NewImage, container: Container) => {
  const doc = {
    url: data.imageUrl,
    name: data.imageName,
    description: data.imageDescription,
  };

  try {
    await container.items.create(doc);
    return {
      body: doc,
    };
  } catch (err) {
    console.log(err);
    if (err.code === 409) {
      return {
        status: 409,
        body: doc,
      };
    }

    throw err;
  }
};

const handler: AzureFunction = async function (context) {
  const data = context.req?.body as NewImage;
  const errors = validate(newImageSchema, data);
  if (errors) {
    context.res = {
      status: 400,
      body: {
        message: 'Validation error.',
        errors: errors,
      },
    };
    return;
  }

  const container = await getImagesContainer();
  context.res = await saveImage(data, container);
};

export default handler;
