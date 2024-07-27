import { Hono } from 'hono';
import { env } from 'hono/adapter';
import { tokenResponseSchema } from '../util/types';
import { setSignedCookie } from 'hono/cookie';

const auth = new Hono();

auth.get('/login', (c) => {
	const { STRAVA_CLIENT_ID } = env<{ STRAVA_CLIENT_ID: string }>(c);
	const { STRAVA_REDIRECT_URI } = env<{ STRAVA_REDIRECT_URI: string }>(c);

	const url = new URL(
		`https://www.strava.com/oauth/authorize?client_id=${STRAVA_CLIENT_ID}&redirect_uri=${STRAVA_REDIRECT_URI}&response_type=code&scope=read_all,activity:read_all,activity:write`
	);

	return c.redirect(url.toString());
});

auth.get('/login/callback', async (c) => {
	const code = c.req.query('code');

	const { STRAVA_CLIENT_ID } = env<{ STRAVA_CLIENT_ID: string }>(c);
	const { STRAVA_CLIENT_SECRET } = env<{ STRAVA_CLIENT_SECRET: string }>(c);

	const res = await fetch(
		`https://www.strava.com/oauth/token?client_id=${STRAVA_CLIENT_ID}&client_secret=${STRAVA_CLIENT_SECRET}&code=${code}&grant_type=authorization_code`,
		{
			method: 'POST',
		}
	);

	const data = await res.json();
	const { access_token } = tokenResponseSchema.parse(data);

	const { COOKIE_SECRET } = env<{ COOKIE_SECRET: string }>(c);

	await setSignedCookie(c, 'access_token', access_token, COOKIE_SECRET, {
		path: '/',
		secure: process.env.NODE_ENV === 'production',
		httpOnly: true,
		maxAge: 60 * 10,
		sameSite: 'lax',
	});

	return c.redirect('/');
});

export { auth };
