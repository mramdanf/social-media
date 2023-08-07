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

function getImageNameFromUrl(imageUrl) {
  return imageUrl.split('/').pop();
}

function deletePostImageOnS3(imageUrl) {
  const s3 = getS3Client();
  const command = new DeleteObjectCommand({
    Bucket: POST_IMAGES_BUCKET,
    Key: getImageNameFromUrl(imageUrl)
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
  const uploadRes = await s3.send(command);
  deleteTmpImages(imageName);

  return uploadRes;
}

function getPostImageUrl(imageName) {
  return `https://social-media-post-images.s3.us-west-1.amazonaws.com/${imageName}`;
}

module.exports = {
  getS3Client,
  deletePostImageOnS3,
  savePostImageOnS3,
  getPostImageUrl,
  POST_IMAGES_BUCKET
};
