import * as v from 'valibot';

export const enquiryGoals = [
	['strength', 'Get stronger'],
	['conditioning', 'Get fitter'],
	['hybrid', 'Both'],
	['recovery', 'Move better / recover'],
	['nutrition', 'Sort out food'],
	['womens', 'Women’s floor'],
	['unsure', 'Not sure yet']
] as const;

const goalIds = enquiryGoals.map(([id]) => id) as [string, ...string[]];

// Messages live on the schema so the server and the browser show the same
// wording — plain language, never a technical reason.
export const EnquirySchema = v.object({
	name: v.pipe(
		v.string('Please tell us your name.'),
		v.trim(),
		v.minLength(2, 'Please tell us your name.'),
		v.maxLength(80, 'That name is longer than we can store — try a shorter version.')
	),
	email: v.pipe(
		v.string('Please add an email address so we can reply.'),
		v.trim(),
		v.email('That email address looks incomplete — check it and try again.')
	),
	goal: v.picklist(goalIds, 'Pick what you want to work on, or choose “Not sure yet”.'),
	message: v.pipe(
		v.string(),
		v.trim(),
		v.maxLength(2000, 'That is longer than we can accept — trim it to a few paragraphs.')
	)
});

export type Enquiry = v.InferOutput<typeof EnquirySchema>;
export type EnquiryErrors = Partial<Record<keyof Enquiry, string>>;

// One issue per field is all a form needs; the rest is noise to the reader.
export function validateEnquiry(input: unknown) {
	const result = v.safeParse(EnquirySchema, input);
	if (result.success) return { data: result.output, errors: null };

	const flat = v.flatten<typeof EnquirySchema>(result.issues);
	const errors: EnquiryErrors = {};
	for (const [field, messages] of Object.entries(flat.nested ?? {})) {
		if (messages?.[0]) errors[field as keyof Enquiry] = messages[0];
	}

	return { data: null, errors };
}
