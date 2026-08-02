// https://svelte.dev/docs/kit/types#app.d.ts
declare global {
	namespace App {
		// Shaped by handleError in src/hooks.ts: a plain sentence, never a cause.
		interface Error {
			message: string;
		}
	}
}

export {};
