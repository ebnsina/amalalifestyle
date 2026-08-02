import { fail } from '@sveltejs/kit';
import { validateEnquiry } from '$lib/schemas/enquiry';
import type { Actions } from './$types';

export const actions: Actions = {
	default: async ({ request }) => {
		const data = await request.formData();

		// Honeypot. Real people leave it empty; bots fill everything in.
		if (data.get('company')) return { sent: true };

		const values = {
			name: String(data.get('name') ?? ''),
			email: String(data.get('email') ?? ''),
			goal: String(data.get('goal') ?? ''),
			message: String(data.get('message') ?? '')
		};

		const { data: enquiry, errors } = validateEnquiry(values);
		if (errors) return fail(400, { errors, values });

		// TODO: deliver to the gym's inbox. Until then the enquiry only reaches
		// the server log, so nobody reads it.
		console.info('[enquiry]', enquiry);

		return { sent: true };
	}
};
