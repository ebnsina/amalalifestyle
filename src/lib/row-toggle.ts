// A tap anywhere on the row ticks its checkbox; the checkbox, its label and other buttons already handle their own taps.
export function rowToggle(row: HTMLElement) {
	const onclick = (e: MouseEvent) => {
		if ((e.target as Element).closest('input, label, button, a')) return;
		row.querySelector<HTMLInputElement>('input[type="checkbox"]')?.click();
	};
	row.addEventListener('click', onclick);
	return () => row.removeEventListener('click', onclick);
}
