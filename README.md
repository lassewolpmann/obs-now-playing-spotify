# Installation

```bash
git clone https://github.com/lassewolpmann/obs-now-playing-spotify.git
```
Make sure to have Docker installed.

## Running the application
```bash
docker build . -t obs-now-playing-spotify
docker run -p 3000:3000 -d obs-now-playing-spotify
```

## Checking the status of the application
```bash
docker ps
```
Copy the container ID
```bash
docker logs <ID>
```
The output should say
```bash
Listening on 0.0.0.0:3000
Token expires at: ...
```