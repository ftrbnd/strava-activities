import { Hono } from 'hono';
import { env } from 'hono/adapter';
import { getSignedCookie } from 'hono/cookie';
import {
	activitySchema,
	dateSchema,
	updatableActivitySchema,
} from '../util/types';

const activities = new Hono();

activities.get('/', async (c) => {
	const { COOKIE_SECRET } = env<{ COOKIE_SECRET: string }>(c);

	const access_token = await getSignedCookie(c, COOKIE_SECRET, 'access_token');
	const year = c.req.query('year');
	const month = c.req.query('month');
	const date = c.req.query('date');

	const validDate = dateSchema.safeParse(`${year}-${month}-${date}`);
	const query = validDate.data
		? `&after=${validDate.data.getTime() / 1000}`
		: '';

	const res = await fetch(
		`https://www.strava.com/api/v3/athlete/activities?per_page=200${query}`,
		{
			headers: {
				Authorization: `Bearer ${access_token}`,
			},
		}
	);
	if (!res.ok) return c.text('Failed to fetch activities', 500);

	const data = await res.json();
	const activities = activitySchema.array().parse(data);

	return c.json(activities);
});

activities.patch('/:id', async (c) => {
	const id = c.req.param('id');
	const body = await c.req.json();
	const updatableActivity = updatableActivitySchema.parse(body);

	const { COOKIE_SECRET } = env<{ COOKIE_SECRET: string }>(c);
	const access_token = await getSignedCookie(c, COOKIE_SECRET, 'access_token');

	const res = await fetch(`https://www.strava.com/api/v3/activities/${id}`, {
		method: 'PUT',
		headers: {
			Authorization: `Bearer ${access_token}`,
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(updatableActivity),
	});
	if (!res.ok) return c.text(`Failed to update Activity #${id}`, 500);

	const data = await res.json();
	const newActivity = activitySchema.parse(data);

	return c.json(newActivity);
});

export { activities };
