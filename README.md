# Installation

```bash
git clone https://github.com/lassewolpmann/obs-now-playing-spotify.git
```
Make sure to have Docker installed.

## Spotify Dashboard
Register an application at https://developer.spotify.com/dashboard/applications.  
You'll need the Client ID, Client Secret and set a Redirect URI in the Settings.

## Setting up .env
```bash
nano .env
```

The .env file needs the following values:  
SECRET_CLIENT_SECRET=  
PUBLIC_CLIENT_ID=  
PUBLIC_REDIRECT_URI=

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