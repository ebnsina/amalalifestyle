import { error } from '@sveltejs/kit';
import { journal } from '$lib/data/site';
import type { PageLoad } from './$types';

export const load: PageLoad = ({ params }) => {
	const post = journal.find((p) => p.slug === params.slug);
	if (!post) {
		error(404, 'That article does not exist. Try the journal index.');
	}

	// Two more to read, in publication order, never including this one.
	const more = journal.filter((p) => p.slug !== post.slug).slice(0, 2);

	return { post, more };
};
