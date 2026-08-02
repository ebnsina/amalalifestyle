import type { ActivityId, BmiStandard, Goal, Sex } from '$lib/fitness';

// Shared between tools so height is typed once. In memory only — never
// stored or sent, and gone when the tab closes.
export const profile = $state({
	sex: 'male' as Sex,
	age: 30,
	heightCm: 170,
	weightKg: 72,
	activity: 'moderate' as ActivityId,
	goal: 'maintain' as Goal,
	standard: 'asian' as BmiStandard,
	pregnant: false,
	mealCount: 4 as 3 | 4,
	waistCm: null as number | null,
	neckCm: null as number | null,
	hipCm: null as number | null
});

export function profileValid() {
	return (
		profile.heightCm > 100 &&
		profile.heightCm < 230 &&
		profile.weightKg > 25 &&
		profile.weightKg < 300
	);
}
