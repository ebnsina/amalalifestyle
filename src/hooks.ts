import type { HandleClientError, HandleServerError } from '@sveltejs/kit';
import { friendlyError } from '$lib/errors';

// Unexpected faults are logged with their detail and reported to the visitor
// with none of it — the error page only ever receives a plain sentence.
const toSafeMessage = (status: number) => friendlyError(status).body;

export const handleError: HandleServerError & HandleClientError = ({ error, status, event }) => {
	if (status !== 404) console.error(`[${status}] ${event.url.pathname}`, error);
	return { message: toSafeMessage(status) };
};
