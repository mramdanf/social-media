## API Documentation
http://3.27.174.150:3000/api-docs/

## Deployment Instruction
This application is a dockerize application, `docker-compose.yml` is docker compose file for locale machine and `docker-compose-aws.yml` is docker compose file example for deploying the app in aws EC2 instance

### Local Machine
#### System Requirements
- Docker / docker desktop
- Docker compose

#### How to Run
- Duplicate `.env.example` to `.env` and fill in the necessar field on it
- Run `docker-compose up --build -d`
- Check docker container log, the app should log `Server is running on port 3000`
- Api docs should be available locally on http://localhost:3000/api-docs

### AWS
I'm using Elastic Container Registry (ECR) to place service image and Elastic Compute Cloud (EC2) as a virtual server.

#### High Level Instructions
- Duplicate `.env.example` to `.env` and fill in the necessar field on it
- Build and tag main-service image by running `docker build -f main-service.Dockerfile -t <tagname> .`
- Push image to ECR
- Pull image from ECR in EC2 instance
- Copy `docker-compose-aws.yml` file to EC2 and replace image name with yours
- Run `docker-compose up -d`

#### Detailed Instructions
1. Create repository in ECR, ex: `social-media`