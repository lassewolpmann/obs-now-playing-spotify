# Installation

```bash
git clone https://github.com/lassewolpmann/obs-now-playing-spotify.git
cd obs-now-playing-spotify/
```

## Running the application
Make sure to have Docker installed.  
  
In the cloned directory:
```bash
docker-compose build spotify-obs-overlay
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
Token expires at: (some date)
```

## Using the overlay
After setup, navigate to http://localhost:3000 in your browser and authorize yourself with Spotify.  
You should now see the overlay in your browser.  
  
Go into OBS and add a new browser source with the following properties:
* URL: http://localhost:3000/
* Width: 1600
* Height: 400

Done!