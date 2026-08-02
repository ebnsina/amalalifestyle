// Published, deterministic formulas only — no estimation, no model, no network.
// Guard rails live in `advisoryFor()`; never show targets when it blocks.

export type Sex = 'male' | 'female';
export type BmiStandard = 'asian' | 'who';
export type Goal = 'lose' | 'leanLose' | 'maintain' | 'gain';

// Body composition

/** Quetelet index: kg / m². */
export function bmi(kg: number, cm: number): number {
	const m = cm / 100;
	return kg / (m * m);
}

// WHO 2004 Asian-Pacific action points by default: risk rises at a lower BMI
// in South Asian populations, so 25/30 would understate it here.
export function bmiCategory(value: number, standard: BmiStandard = 'asian') {
	const over = standard === 'asian' ? 23 : 25;
	const obese = standard === 'asian' ? 27.5 : 30;

	if (value < 16) return { label: 'Very underweight', tone: 'flag' as const };
	if (value < 18.5) return { label: 'Underweight', tone: 'watch' as const };
	if (value < over) return { label: 'Healthy range', tone: 'ok' as const };
	if (value < obese) return { label: 'Overweight', tone: 'watch' as const };
	return { label: 'Obese', tone: 'flag' as const };
}

/** The weight range that puts this height in the healthy BMI band. */
export function healthyWeightRange(cm: number, standard: BmiStandard = 'asian') {
	const m = cm / 100;
	const top = standard === 'asian' ? 22.9 : 24.9;
	return { min: 18.5 * m * m, max: top * m * m };
}

// Waist-to-height predicts risk better than BMI: keep waist under half height.
export function whtr(waistCm: number, heightCm: number): number {
	return waistCm / heightCm;
}

export function whtrCategory(value: number) {
	if (value < 0.4) return { label: 'Below the healthy band', tone: 'watch' as const };
	if (value < 0.5) return { label: 'Healthy', tone: 'ok' as const };
	if (value < 0.6) return { label: 'Increased risk', tone: 'watch' as const };
	return { label: 'High risk', tone: 'flag' as const };
}

// US Navy tape method (Hodgdon & Beckett, 1984), roughly ±3-4% against DEXA.
export function navyBodyFat(
	sex: Sex,
	heightCm: number,
	neckCm: number,
	waistCm: number,
	hipCm?: number
): number | null {
	if (sex === 'male') {
		if (waistCm <= neckCm) return null;
		return (
			495 /
				(1.0324 - 0.19077 * Math.log10(waistCm - neckCm) + 0.15456 * Math.log10(heightCm)) -
			450
		);
	}
	if (!hipCm || waistCm + hipCm <= neckCm) return null;
	return (
		495 /
			(1.29579 - 0.35004 * Math.log10(waistCm + hipCm - neckCm) + 0.221 * Math.log10(heightCm)) -
		450
	);
}

// Energy

// Mifflin-St Jeor (1990) — more accurate than Harris-Benedict for modern populations.
export function bmr(kg: number, cm: number, age: number, sex: Sex): number {
	const base = 10 * kg + 6.25 * cm - 5 * age;
	return sex === 'male' ? base + 5 : base - 161;
}

export const activityLevels = [
	{ id: 'sedentary', label: 'Desk job, no training', factor: 1.2 },
	{ id: 'light', label: 'Training 1–2 days a week', factor: 1.375 },
	{ id: 'moderate', label: 'Training 3–4 days a week', factor: 1.55 },
	{ id: 'high', label: 'Training 5–6 days a week', factor: 1.725 },
	{ id: 'athlete', label: 'Physical job, or twice a day', factor: 1.9 }
] as const;

export type ActivityId = (typeof activityLevels)[number]['id'];

/** Total daily energy expenditure. */
export function tdee(bmrValue: number, factor: number): number {
	return bmrValue * factor;
}

export const goals = [
	{ id: 'lose', label: 'Lose fat', note: '20% below maintenance', multiplier: 0.8 },
	{ id: 'leanLose', label: 'Lose fat slowly', note: '10% below maintenance', multiplier: 0.9 },
	{ id: 'maintain', label: 'Stay where I am', note: 'At maintenance', multiplier: 1 },
	{ id: 'gain', label: 'Build muscle', note: '10% above maintenance', multiplier: 1.1 }
] as const;

export function goalCalories(tdeeValue: number, goal: Goal): number {
	const g = goals.find((x) => x.id === goal)!;
	return tdeeValue * g.multiplier;
}

// Uses the conventional 7,700 kcal ≈ 1 kg. A direction, not a promise.
export function weeklyWeightChangeKg(goalCals: number, tdeeValue: number): number {
	return ((goalCals - tdeeValue) * 7) / 7700;
}

// Macronutrients

export type Macros = { protein: number; fat: number; carbs: number; calories: number };

// Protein 1.6-2.2 g/kg (ISSN), high end in a deficit. Fat fixed for hormonal
// health at 0.9 g/kg; carbohydrate takes whatever energy is left.
export function macrosFor(kg: number, calories: number, goal: Goal): Macros {
	const proteinPerKg = goal === 'lose' ? 2.2 : goal === 'leanLose' ? 2.0 : 1.8;
	const protein = kg * proteinPerKg;
	const fat = kg * 0.9;

	const remaining = calories - protein * 4 - fat * 9;
	const carbs = Math.max(remaining / 4, 0);

	return { protein, fat, carbs, calories };
}

// Synthesis peaks near 0.4 g/kg per sitting, so protein is spread across meals.
export function proteinPerMeal(kg: number, meals: number, totalProtein: number): number {
	return Math.max(totalProtein / meals, kg * 0.4);
}

/** ~33 ml per kg per day, before training losses are added on top. */
export function waterMl(kg: number): number {
	return kg * 33;
}

// Turning macros into food: a lookup table and division, per 100g cooked.

// `max` is the largest portion a real person eats at once — without it the
// arithmetic suggests 650 g of yoghurt to hit a protein number.
type Food = { name: string; per100: number; max: number };

const proteinFoods = {
	egg: { name: 'Eggs', per100: 12.6, max: 200 },
	chicken: { name: 'Chicken breast', per100: 31, max: 250 },
	fish: { name: 'Rui or salmon', per100: 22, max: 250 },
	beef: { name: 'Lean beef', per100: 26, max: 250 },
	dal: { name: 'Masoor dal', per100: 9, max: 400 },
	yoghurt: { name: 'Plain doi', per100: 5, max: 300 }
} satisfies Record<string, Food>;

const carbFoods = {
	oats: { name: 'Oats (dry)', per100: 60, max: 120 },
	rice: { name: 'Rice', per100: 28, max: 450 },
	ruti: { name: 'Atta ruti', per100: 46, max: 200 },
	potato: { name: 'Potato', per100: 17, max: 400 },
	fruit: { name: 'Banana or mango', per100: 22, max: 250 }
} satisfies Record<string, Food>;

export type Portion = { name: string; grams: number };

// First food is capped at a realistic serving; the rest comes from the second.
function portions(targetGrams: number, primary: Food, secondary: Food): Portion[] {
	const fromPrimary = Math.min(targetGrams, (primary.max * primary.per100) / 100);
	const out: Portion[] = [{ name: primary.name, grams: (fromPrimary / primary.per100) * 100 }];

	const remaining = targetGrams - fromPrimary;
	if (remaining > 1) {
		const fromSecondary = Math.min(remaining, (secondary.max * secondary.per100) / 100);
		out.push({ name: secondary.name, grams: (fromSecondary / secondary.per100) * 100 });
	}

	return out;
}

export type MealPlan = {
	slot: string;
	time: string;
	protein: Portion[];
	proteinTotal: number;
	carbs: Portion[];
	carbTotal: number;
	note: string;
};

// Neither macro splits evenly: carbohydrate sits near the session that needs it.
export function mealPlan(macros: Macros, meals: 3 | 4 = 4): MealPlan[] {
	const template =
		meals === 4
			? [
					{ slot: 'Breakfast', time: '07:30', p: ['egg', 'yoghurt'], c: ['oats', 'fruit'], pShare: 0.25, cShare: 0.25, note: 'Protein first, before anything else is decided.' },
					{ slot: 'Lunch', time: '13:00', p: ['chicken', 'dal'], c: ['rice', 'potato'], pShare: 0.3, cShare: 0.35, note: 'The biggest plate of the day.' },
					{ slot: 'Pre-session', time: '16:30', p: ['yoghurt', 'egg'], c: ['fruit', 'oats'], pShare: 0.15, cShare: 0.15, note: 'Small and easy to digest. Fuel, not a meal.' },
					{ slot: 'Dinner', time: '20:00', p: ['fish', 'dal'], c: ['ruti', 'potato'], pShare: 0.3, cShare: 0.25, note: 'Lighter on carbohydrate, heavy on vegetables.' }
				]
			: [
					{ slot: 'Breakfast', time: '08:00', p: ['egg', 'yoghurt'], c: ['oats', 'fruit'], pShare: 0.3, cShare: 0.3, note: 'Protein first, before anything else is decided.' },
					{ slot: 'Lunch', time: '13:30', p: ['chicken', 'dal'], c: ['rice', 'potato'], pShare: 0.35, cShare: 0.4, note: 'The biggest plate of the day.' },
					{ slot: 'Dinner', time: '20:00', p: ['fish', 'dal'], c: ['ruti', 'potato'], pShare: 0.35, cShare: 0.3, note: 'Plenty of vegetables alongside.' }
				];

	return template.map((t) => {
		const proteinTotal = macros.protein * t.pShare;
		const carbTotal = macros.carbs * t.cShare;

		return {
			slot: t.slot,
			time: t.time,
			proteinTotal,
			carbTotal,
			protein: portions(
				proteinTotal,
				proteinFoods[t.p[0] as keyof typeof proteinFoods],
				proteinFoods[t.p[1] as keyof typeof proteinFoods]
			),
			carbs: portions(
				carbTotal,
				carbFoods[t.c[0] as keyof typeof carbFoods],
				carbFoods[t.c[1] as keyof typeof carbFoods]
			),
			note: t.note
		};
	});
}

// Strength

// Epley and Brzycki averaged; both drift above ~10 reps so input is capped at 12.
export function oneRepMax(weight: number, reps: number): number {
	if (reps <= 1) return weight;
	const epley = weight * (1 + reps / 30);
	const brzycki = weight * (36 / (37 - reps));
	return (epley + brzycki) / 2;
}

export const trainingPercentages = [
	{ pct: 60, reps: '12–15', use: 'Technique and volume' },
	{ pct: 70, reps: '10–12', use: 'Base building' },
	{ pct: 75, reps: '8–10', use: 'Most working sets' },
	{ pct: 80, reps: '6–8', use: 'Strength work' },
	{ pct: 85, reps: '4–6', use: 'Heavy sets' },
	{ pct: 90, reps: '2–3', use: 'Near max' },
	{ pct: 95, reps: '1–2', use: 'Peaking only' }
];

// Null when the target cannot be made from the plates on the floor.
export function plateBreakdown(target: number, bar = 20): { plate: number; count: number }[] | null {
	if (target < bar) return null;

	let perSide = (target - bar) / 2;
	// Everything is loaded in pairs, so half-plate remainders cannot exist.
	if (Math.round(perSide * 100) % 125 !== 0 && Math.abs(perSide % 1.25) > 0.001) return null;

	const plates = [25, 20, 15, 10, 5, 2.5, 1.25];
	const out: { plate: number; count: number }[] = [];

	for (const plate of plates) {
		const count = Math.floor((perSide + 0.001) / plate);
		if (count > 0) {
			out.push({ plate, count });
			perSide -= count * plate;
		}
	}

	return Math.abs(perSide) < 0.01 ? out : null;
}

// Guard rails

export type Advisory = { level: 'block' | 'note'; text: string };

// `block` means the UI shows this INSTEAD of any energy or macro numbers —
// these formulas are only validated on healthy, non-pregnant adults.
export function advisoryFor(opts: {
	age: number;
	bmiValue: number;
	pregnant: boolean;
}): Advisory | null {
	if (opts.pregnant) {
		return {
			level: 'block',
			text: 'Energy needs in pregnancy and breastfeeding are not what these formulas calculate, and under-eating carries real risk. Please work from advice given by your own doctor or a registered dietitian.'
		};
	}

	if (opts.age < 18) {
		return {
			level: 'block',
			text: 'These formulas are for adults. Under 18, calorie targets should come from a doctor or paediatric dietitian who can account for growth — we will not show one here.'
		};
	}

	if (opts.age > 80) {
		return {
			level: 'block',
			text: 'Above 80 these estimates lose accuracy and energy needs are better set with a doctor who knows your health history.'
		};
	}

	if (opts.bmiValue < 16) {
		return {
			level: 'block',
			text: 'This BMI is low enough that a calorie target could do harm. Please speak to a doctor before changing how you eat — and come and talk to us afterwards, not before.'
		};
	}

	if (opts.bmiValue >= 40) {
		return {
			level: 'note',
			text: 'At this BMI we would want a doctor involved alongside the training, not instead of it. The numbers below are still a reasonable starting point.'
		};
	}

	return null;
}
