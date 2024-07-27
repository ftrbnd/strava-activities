import z from 'zod';

export const tokenResponseSchema = z.object({
	token_type: z.string(),
	expires_at: z.number(),
	expires_in: z.number(),
	refresh_token: z.string(),
	access_token: z.string(),
	athlete: z
		.object({
			id: z.number(),
		})
		.passthrough(),
});
export const activitySchema = z
	.object({
		id: z.number(),
		gear_id: z.string().nullable(),
	})
	.passthrough(); // Activities have a lot more fields, but we only need these two

export type TokenResponse = z.infer<typeof tokenResponseSchema>;
export type Activity = z.infer<typeof activitySchema>;
