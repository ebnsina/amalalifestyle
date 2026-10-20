import { toBangla } from '@subhesadek/avro-phonetic';

import { i18n } from '#lib/i18n.svelte.js';

// Avro-style typing: Latin words become Bangla once finished, so it works with every keyboard, including
// Android ones that compose words before handing them over.
function saved() {
	try {
		return localStorage.getItem('phonetic') !== 'off';
	} catch {
		return true;
	}
}

export const phonetic = $state({ on: saved() });

export function setPhonetic(on: boolean) {
	phonetic.on = on;
	try {
		localStorage.setItem('phonetic', on ? 'on' : 'off');
	} catch {
		// Private mode: the choice lasts until the tab closes.
	}
}

// Converts finished Latin words (followed by a space or punctuation), or every Latin word when the field is left.
// Returns the new text and where the caret goes, keeping it the same distance from the end.
export function convertWords(text: string, caret: number, all = false) {
	const word = all ? /[A-Za-z]+/g : /[A-Za-z]+(?=[^A-Za-z])/g;
	const out = text.replace(word, (w) => toBangla(w, { banglaDigits: false }));
	return { text: out, caret: out.length - (text.length - caret) };
}

const typed = (el: EventTarget | null): el is HTMLInputElement | HTMLTextAreaElement =>
	el instanceof HTMLTextAreaElement ||
	(el instanceof HTMLInputElement && ['text', 'search', ''].includes(el.type) &&
		!['numeric', 'decimal'].includes(el.inputMode) && !el.hasAttribute('aria-roledescription'));

function apply(el: HTMLInputElement | HTMLTextAreaElement, all: boolean) {
	if (i18n.lang !== 'bn' || !phonetic.on || !/[A-Za-z]/.test(el.value)) return;
	const { text, caret } = convertWords(el.value, el.selectionStart ?? el.value.length, all);
	if (text === el.value) return;
	el.value = text;
	if (document.activeElement === el) el.setSelectionRange(caret, caret);
	// Lets bound values (bind:value) pick up the converted text.
	el.dispatchEvent(new Event('input', { bubbles: true }));
}

// One listener for every text field in the app.
export function watchTyping() {
	addEventListener('input', (e) => {
		if (!(e as InputEvent).isComposing && typed(e.target)) apply(e.target, false);
	});
	addEventListener('compositionend', (e) => typed(e.target) && apply(e.target, false));
	addEventListener('focusout', (e) => typed(e.target) && apply(e.target, true));
	// Enter submits without leaving the field, so finish the last word first.
	addEventListener('keydown', (e: KeyboardEvent) => e.key === 'Enter' && typed(e.target) && apply(e.target, true), true);
}
