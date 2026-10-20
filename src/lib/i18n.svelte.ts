export type Lang = 'bn' | 'en';

export const i18n = $state({ lang: 'bn' as Lang });

// Both languages side by side at the call site, so neither can go missing.
export const t = (bn: string, en: string) => (i18n.lang === 'en' ? en : bn);

// For data that carries both names, e.g. a food or a prayer.
export const name = (x: { bn: string; en: string }) => t(x.bn, x.en);

export const locale = () => (i18n.lang === 'en' ? 'en-US' : 'bn-BD');
