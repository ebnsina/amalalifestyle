const LOCALE = 'en-GB';

// Intl formatters are expensive to build, so each shape is made once and reused.
const numberCache = new Map<number, Intl.NumberFormat>();

function numberFormat(digits: number) {
	let formatter = numberCache.get(digits);
	if (!formatter) {
		formatter = new Intl.NumberFormat(LOCALE, {
			minimumFractionDigits: digits,
			maximumFractionDigits: digits
		});
		numberCache.set(digits, formatter);
	}
	return formatter;
}

export function formatNumber(value: number, digits = 0): string {
	return numberFormat(digits).format(value);
}

const shortDate = new Intl.DateTimeFormat(LOCALE, {
	day: 'numeric',
	month: 'short',
	year: 'numeric'
});

const longDate = new Intl.DateTimeFormat(LOCALE, {
	day: 'numeric',
	month: 'long',
	year: 'numeric'
});

export function formatDate(iso: string, style: 'short' | 'long' = 'short'): string {
	const date = new Date(iso);
	return (style === 'long' ? longDate : shortDate).format(date);
}

// Bars load in 2.5 kg steps, so a displayed weight is always one you can make.
export function formatPlateWeight(kg: number): string {
	return formatNumber(Math.round(kg / 2.5) * 2.5, kg % 2.5 === 0 ? 0 : 1);
}
