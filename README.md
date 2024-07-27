## Getting Started

1. Clone the repo
   ```sh
   git clone https://github.com/ftrbnd/eden-heardle-server.git
   ```
2. Install NPM packages
   ```sh
   yarn install
   ```
3. Start the local dev server
   ```sh
   yarn dev
   ```

## Configuration

- Create a [Strava app](https://developers.strava.com/)

- Create a `.env` file at the root and fill out the values:

  ```env
  STRAVA_CLIENT_ID=""
  STRAVA_CLIENT_SECRET=""
  STRAVA_REDIRECT_URI="http://localhost:3000/auth/login/callback"
  COOKIE_SECRET="" # any random value

  ```

## Using the API

### Authentication

- Open http://localhost:3000/auth/login
- Sign in with Strava
- Get your access token displayed on the home page

### Fetch your Activities

- Open POSTMAN or any REST client
- Send a GET request to http://localhost:3000/activities
  - Optional queries: year + month + date
  - ex: http://localhost:3000/activities?year=2024&month=2&date=2

### Update an Activity

- Send a PATCH request to http://localhost:3000/activities/:id
  - [Request body structure](https://developers.strava.com/docs/reference/#api-models-UpdatableActivity)
