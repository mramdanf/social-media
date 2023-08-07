const fs = require('fs');
const {
  S3Client,
  DeleteObjectCommand,
  PutObjectCommand
} = require('@aws-sdk/client-s3');
const { deleteTmpImages, tmpImagePathFactory } = require('../utils/fileUpload');

require('dotenv').config();

const POST_IMAGES_BUCKET = 'social-media-post-images';

function getS3Client() {
  const { AWS_ACCESS_KEY, AWS_SECRET_ACCESS_KEY, AWS_DEFAULT_REGION } =
    process.env;

  return new S3Client({
    credentials: {
      accessKeyId: AWS_ACCESS_KEY,
      secretAccessKey: AWS_SECRET_ACCESS_KEY
    },
    region: AWS_DEFAULT_REGION
  });
}

function deletePostImageOnS3(imageUrl) {
  const s3 = getS3Client();
  const command = new DeleteObjectCommand({
    Bucket: POST_IMAGES_BUCKET,
    Key: imageUrl.split('/').pop()
  });
  return s3.send(command);
}

async function savePostImageOnS3(imageName) {
  const s3 = getS3Client();
  const tmpImagePath = tmpImagePathFactory(imageName);
  const fileContent = fs.readFileSync(tmpImagePath);
  const command = new PutObjectCommand({
    Bucket: POST_IMAGES_BUCKET,
    Key: imageName,
    Body: fileContent
  });
  await s3.send(command);
  deleteTmpImages(imageName);
}

module.exports = {
  getS3Client,
  deletePostImageOnS3,
  savePostImageOnS3,
  POST_IMAGES_BUCKET
};
