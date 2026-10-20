export type Theme = 'system' | 'light' | 'dark';

// Matches --ui-bg in app.css, for the browser bar and the installed app's title bar.
const bg = { light: '#f5f8f4', dark: '#0f1411' };

function saved(): Theme {
	try {
		const t = localStorage.getItem('theme');
		return t === 'light' || t === 'dark' ? t : 'system';
	} catch {
		return 'system';
	}
}

export const theme = $state({ value: saved() });

export function applyTheme(t: Theme) {
	const root = document.documentElement;
	if (t === 'system') delete root.dataset.theme;
	else root.dataset.theme = t;
	for (const m of document.querySelectorAll<HTMLMetaElement>('meta[name="theme-color"]')) {
		m.content = bg[t === 'system' ? (m.media.includes('dark') ? 'dark' : 'light') : t];
	}
}

export function setTheme(t: Theme) {
	theme.value = t;
	try {
		localStorage.setItem('theme', t);
	} catch {
		// Private mode: the choice lasts until the tab closes.
	}
	applyTheme(t);
}
