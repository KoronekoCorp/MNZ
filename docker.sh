docker build -t mnz . 
docker image tag mnz:latest registry.docker.com/koronekobot/mnz
docker push registry.docker.com/koronekobot/mnz