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
	.passthrough();

export const updatableActivitySchema = z.object({
	commute: z.boolean().optional(),
	trainer: z.boolean().optional(),
	hide_from_home: z.boolean().optional(),
	description: z.string().optional(),
	name: z.string().optional(),
	sport_type: z.string().optional(),
	gear_id: z.string().optional(),
});

export const dateSchema = z.coerce.date();

export type TokenResponse = z.infer<typeof tokenResponseSchema>;
export type Activity = z.infer<typeof activitySchema>;
