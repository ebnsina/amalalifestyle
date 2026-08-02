import type { Picture } from '@sveltejs/enhanced-img';

// Processed at build time into AVIF/WebP at several widths. Site data still
// refers to images by their old '/images/name.jpg' path, resolved here.
const modules = import.meta.glob<Picture>('./images/*.jpg', {
	eager: true,
	query: { enhanced: true },
	import: 'default'
});

const byName = new Map(
	Object.entries(modules).map(([path, asset]) => [path.split('/').pop()!, asset])
);

// Throws rather than falling back: a missing image is a build mistake, and a
// silent placeholder would ship it.
export function image(src: string): Picture {
	const name = src.split('/').pop();
	const asset = name ? byName.get(name) : undefined;
	if (!asset) throw new Error(`No image for "${src}". Expected a file in src/lib/images.`);
	return asset;
}
