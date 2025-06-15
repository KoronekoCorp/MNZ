docker build -t mnz . 
docker login registry.docker.com -u koronekobot
docker image tag mnz:latest registry.docker.com/koronekobot/mnz
docker push registry.docker.com/koronekobot/mnz