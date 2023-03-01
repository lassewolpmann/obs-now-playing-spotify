# Installation

```bash
git clone https://github.com/lassewolpmann/obs-now-playing-spotify.git
cd obs-now-playing-spotify/
```

## Running the application
Make sure to have Docker installed.  
  
In the cloned directory:
```bash
docker compose up -d
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