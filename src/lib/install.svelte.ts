type InstallEvent = Event & { prompt: () => Promise<void>; userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }> };

declare global {
	interface Window {
		// Caught by the inline script in app.html, which runs before the app loads.
		__installEvent?: InstallEvent;
	}
}

const standalone = () =>
	matchMedia('(display-mode: standalone)').matches || (navigator as Navigator & { standalone?: boolean }).standalone === true;

// iPhone and iPad Safari have no install prompt; people add it from the Share menu.
const ios = /iphone|ipad|ipod/i.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);

export const install = $state({
	installed: standalone(),
	event: window.__installEvent as InstallEvent | undefined,
	ios,
	// Chrome, Edge and Samsung Internet offer their own dialog, but only after a tap and 30 seconds on the page.
	chromium: 'onbeforeinstallprompt' in window,
});

// Opened in a browser tab while already installed: Chrome can tell, so don't offer it again.
(navigator as Navigator & { getInstalledRelatedApps?: () => Promise<unknown[]> }).getInstalledRelatedApps?.()
	.then((apps) => {
		if (apps.length) install.installed = true;
	})
	.catch(() => {});

addEventListener('beforeinstallprompt', (e) => {
	e.preventDefault();
	install.event = e as InstallEvent;
});
addEventListener('appinstalled', () => {
	install.installed = true;
	install.event = undefined;
});

// Shows the browser's own install dialog. False when the browser offers none, so the screen shows how to do it by hand.
export async function promptInstall() {
	const e = install.event;
	if (!e) return false;
	await e.prompt();
	if ((await e.userChoice).outcome === 'accepted') install.installed = true;
	install.event = undefined;
	return true;
}
