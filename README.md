## API Documentation
http://3.27.174.150:3000/api-docs/

## Deployment Instruction
This application is a dockerize application, `docker-compose.yml` is docker compose file for locale machine and `docker-compose-aws.yml` is docker compose file example for deploying the app in aws EC2 instance

### Configure S3
- Create S3 bucket with bucket name `social-media-post-images`
- Create policy for that bucket to allow for `PutObject`, `GetObject`, `GetObjectAttributes`, `DeleteObject`
- Create IAM user than assign previous created policy
- Create access key and place `ACCESS_KEY` and `SECRET_ACCESS_KEY` in the `.env` file

### System Requirements
- Docker / docker desktop
- Docker compose

### Run at Local Machine

#### How to Run
- Duplicate `.env.example` to `.env` and fill in the necessar field on it
- Run `docker-compose up --build -d`
- Check docker container log, the app should log `Server is running on port 3000`
- Api docs should be available locally on http://localhost:3000/api-docs

### Run at AWS EC2 Instance
I'm using Elastic Container Registry (ECR) to place service image and Elastic Compute Cloud (EC2) as a virtual server.

#### How to Run
- Duplicate `.env.example` to `.env` and fill in the necessar field on it
- Build and tag main-service image by running `DOCKER_DEFAULT_PLATFORM=linux/amd64 docker build -f main-service.Dockerfile -t social-media .`
- Tag the image
- Push image to ECR
- Pull image from ECR in EC2 instance
- Copy `docker-compose-aws.yml` file to EC2, rename it to `docker-compose.yml` replace `main-service` image name with appropiate image name
- Run `docker-compose up -d`