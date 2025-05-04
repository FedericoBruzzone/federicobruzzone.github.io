# MacOS

## Install Docker and Colima

```bash
brew install --cask docker
brew install colima
```

## Start Colima

```bash
colima start --memory 8 --cpu 4
colima stop
colima restart
```

## Start Docker

```bash
docker run -p --name <image> 8080:80 <image>
docker run -p --name <image> 8080:80 -v $(pwd):/app <image>
docker stop <container>
docker rm <container>
docker ps --all
docker rmi <image>
docker stats
docker exec -it <container> bash
docker logs --follow --tail 100 <container>
```

## Docker Build Image

```bash
docker build -t <image> .
docker run --rm <image> <command>
```


