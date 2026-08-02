export type FriendlyError = { heading: string; body: string };

// Every status the visitor can reach, worded for a member rather than an
// engineer. Nothing here mentions a status code or a stack.
const messages: Record<number, FriendlyError> = {
	400: {
		heading: 'That request did not come through',
		body: 'Something in the last step was incomplete. Go back, check what you entered, and try once more.'
	},
	403: {
		heading: 'That page is not open to you',
		body: 'You need to be signed in as a member to see this one. If you think that is wrong, give the gym a call.'
	},
	404: {
		heading: 'That page is not here',
		body: 'It may have moved, or the link may have a typo in it. The timetable, memberships and the free tools are all a click away below.'
	},
	429: {
		heading: 'That was a lot of requests at once',
		body: 'Give it a minute and try again. Nothing you sent has been lost.'
	},
	500: {
		heading: 'Something went wrong at our end',
		body: 'This one is on us, not on you. Try again in a moment — and if it keeps happening, call or email the gym and we will sort it.'
	},
	503: {
		heading: 'The site is briefly unavailable',
		body: 'We are likely doing maintenance. Try again shortly; the gym itself is open as normal.'
	}
};

// Anything unrecognised is treated as a fault at our end, never blamed on the visitor.
export function friendlyError(status: number): FriendlyError {
	return messages[status] ?? messages[status >= 500 ? 500 : 400];
}
