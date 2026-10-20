import { self } from '$app/service-worker';
import { version } from '$app/env';
import { assets, immutable } from '$app/manifest';
import { resolve } from '$app/paths';

const CACHE = `amala-${version}`;
// The app shell: every route is the same page that renders from local data.
const SHELL = resolve('/');
const ASSETS = [SHELL, ...immutable.map((a) => resolve(a.path)), ...assets.map((a) => resolve(a.path))];

self.addEventListener('install', (event) => {
	event.waitUntil(caches.open(CACHE).then((cache) => cache.addAll(ASSETS)));
});

self.addEventListener('activate', (event) => {
	event.waitUntil(caches.keys().then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))));
});

// Cache first for the app's own files; pages fall back to the cached shell, so every route opens offline.
self.addEventListener('fetch', (event) => {
	const url = new URL(event.request.url);
	if (event.request.method !== 'GET' || url.origin !== location.origin) return;

	event.respondWith((async () => {
		const cache = await caches.open(CACHE);
		if (ASSETS.includes(url.pathname)) {
			const hit = await cache.match(url.pathname);
			if (hit) return hit;
		}
		try {
			return await fetch(event.request);
		} catch (e) {
			if (event.request.mode === 'navigate') {
				const shell = await cache.match(SHELL);
				if (shell) return shell;
			}
			throw e;
		}
	})());
});
