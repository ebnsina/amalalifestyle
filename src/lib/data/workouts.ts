// General beginner guidance, not a personal programme.
// One set per tick; timed steps like warm-ups are a single set.
export type Exercise = { bn: string; en: string; sets: number; repsBn: string; repsEn: string; tipBn: string; tipEn: string };
export type Workout = {
  id: string; bn: string; en: string; subBn: string; subEn: string; emoji: string; minutes: number; place: 'home' | 'gym';
  rest: number; exercises: Exercise[];
  // Made by the person, editable and removable.
  custom?: boolean;
};

const x = (bn: string, en: string, sets: number, repsBn: string, repsEn: string, tipBn: string, tipEn: string): Exercise =>
  ({ bn, en, sets, repsBn, repsEn, tipBn, tipEn });

export const workouts: Workout[] = [
  {
    id: 'walk', bn: 'দ্রুত হাঁটা', en: 'Brisk walk', subBn: 'একদম শুরু করার জন্য', subEn: 'For complete beginners',
    emoji: '🚶', minutes: 30, place: 'home', rest: 0,
    exercises: [
      x('আস্তে হাঁটা', 'Easy walk', 1, '৫ মিনিট', '5 min', 'শরীর গরম করে নিন।', 'Warm up your body.'),
      x('জোরে হাঁটা', 'Fast walk', 1, '২০ মিনিট', '20 min', 'কথা বলা যায়, কিন্তু গান গাওয়া কঠিন — এমন গতি।',
        'A pace where you can talk, but singing is hard.'),
      x('আস্তে হাঁটা', 'Easy walk', 1, '৫ মিনিট', '5 min', 'ধীরে ধীরে থামুন, তারপর একটু পানি খান।',
        'Slow down gradually, then drink some water.'),
    ],
  },
  {
    id: 'home', bn: 'ঘরে ব্যায়াম', en: 'Home workout', subBn: 'কোনো যন্ত্র লাগবে না', subEn: 'No equipment needed',
    emoji: '🏠', minutes: 20, place: 'home', rest: 45,
    exercises: [
      x('জায়গায় দাঁড়িয়ে হাঁটা', 'March in place', 1, '৩ মিনিট', '3 min', 'হাত দুলিয়ে শরীর গরম করুন।',
        'Swing your arms to warm up.'),
      x('স্কোয়াট (ওঠা-বসা)', 'Squats', 3, '১২টি', '12 reps', 'চেয়ারে বসার মতো নামুন, হাঁটু পায়ের আঙুল ছাড়াবে না।',
        'Lower as if sitting on a chair; keep knees behind your toes.'),
      x('দেয়ালে পুশ-আপ', 'Wall push-ups', 3, '১০টি', '10 reps', 'সহজ হলে হাঁটু গেড়ে মেঝেতে করুন।',
        'If it feels easy, do them on the floor from your knees.'),
      x('গ্লুট ব্রিজ', 'Glute bridge', 3, '১২টি', '12 reps', 'চিত হয়ে শুয়ে কোমর ওপরে তুলুন, ২ সেকেন্ড ধরে রাখুন।',
        'Lie on your back, lift your hips and hold for 2 seconds.'),
      x('প্ল্যাংক', 'Plank', 3, '২০ সেকেন্ড', '20 sec', 'মাথা থেকে গোড়ালি এক লাইনে, শ্বাস আটকাবেন না।',
        'Head to heels in one line; keep breathing.'),
    ],
  },
  {
    id: 'gym-upper', bn: 'জিম: বুক, পিঠ, হাত', en: 'Gym: chest, back, arms', subBn: 'সপ্তাহে ১–২ দিন', subEn: '1–2 days a week',
    emoji: '🏋️', minutes: 45, place: 'gym', rest: 90,
    exercises: [
      x('ট্রেডমিল বা সাইকেল', 'Treadmill or bike', 1, '৫ মিনিট', '5 min', 'হালকা গতিতে গরম হয়ে নিন।', 'Warm up at an easy pace.'),
      x('বেঞ্চ প্রেস', 'Bench press', 3, '৮–১০টি', '8–10 reps', 'শেষ ২টি কষ্ট হবে — এমন ওজন নিন।',
        'Pick a weight where the last 2 reps are hard.'),
      x('ল্যাট পুলডাউন', 'Lat pulldown', 3, '১০টি', '10 reps', 'বার বুকের দিকে টানুন, পিঠ সোজা।',
        'Pull the bar toward your chest, back straight.'),
      x('শোল্ডার প্রেস', 'Shoulder press', 3, '১০টি', '10 reps', 'কোমর বাঁকাবেন না।', 'Don’t arch your lower back.'),
      x('সিটেড রো', 'Seated row', 3, '১০টি', '10 reps', 'কাঁধ পেছনে চেপে টানুন।', 'Squeeze your shoulders back as you pull.'),
      x('বাইসেপ কার্ল', 'Biceps curl', 2, '১২টি', '12 reps', 'কনুই শরীরের পাশে স্থির রাখুন।', 'Keep elbows still at your sides.'),
    ],
  },
  {
    id: 'gym-lower', bn: 'জিম: পা ও কোমর', en: 'Gym: legs & hips', subBn: 'সপ্তাহে ১–২ দিন', subEn: '1–2 days a week',
    emoji: '🦵', minutes: 45, place: 'gym', rest: 90,
    exercises: [
      x('ট্রেডমিল বা সাইকেল', 'Treadmill or bike', 1, '৫ মিনিট', '5 min', 'হালকা গতিতে গরম হয়ে নিন।', 'Warm up at an easy pace.'),
      x('লেগ প্রেস', 'Leg press', 3, '১০টি', '10 reps', 'হাঁটু পুরো লক করবেন না।', 'Don’t fully lock your knees.'),
      x('রোমানিয়ান ডেডলিফট', 'Romanian deadlift', 3, '১০টি', '10 reps',
        'পিঠ সোজা রেখে কোমর থেকে ঝুঁকুন; হালকা ওজনে শুরু করুন।', 'Hinge at the hips with a straight back; start light.'),
      x('লাঞ্জ', 'Lunges', 3, 'প্রতি পায়ে ৮টি', '8 per leg', 'পেছনের হাঁটু মেঝের কাছে নামান।',
        'Lower your back knee toward the floor.'),
      x('লেগ কার্ল', 'Leg curl', 3, '১২টি', '12 reps', 'ধীরে নামান।', 'Lower slowly.'),
      x('কাফ রেইজ', 'Calf raise', 3, '১৫টি', '15 reps', 'গোড়ালি যতটা পারেন ওপরে তুলুন।', 'Raise your heels as high as you can.'),
    ],
  },
  {
    id: 'stretch', bn: 'স্ট্রেচিং', en: 'Stretching', subBn: 'বিশ্রামের দিন বা ঘুমের আগে', subEn: 'Rest days or before bed',
    emoji: '🧘', minutes: 10, place: 'home', rest: 0,
    exercises: [
      x('ঘাড় ঘোরানো', 'Neck rolls', 1, '১ মিনিট', '1 min', 'আস্তে, দুই দিকেই।', 'Slowly, both directions.'),
      x('কাঁধ ও হাতের স্ট্রেচ', 'Shoulder & arm stretch', 1, '২ মিনিট', '2 min', 'প্রতিটি ভঙ্গি ২০–৩০ সেকেন্ড ধরে রাখুন।',
        'Hold each position for 20–30 seconds.'),
      x('পায়ের পেছনের স্ট্রেচ', 'Hamstring stretch', 1, '২ মিনিট', '2 min', 'ঝাঁকি না দিয়ে ধীরে টানুন।',
        'Stretch slowly without bouncing.'),
      x('কোমরের স্ট্রেচ', 'Hip stretch', 1, '২ মিনিট', '2 min', 'ব্যথা নয়, শুধু টান অনুভব হবে।',
        'You should feel a stretch, not pain.'),
      x('লম্বা শ্বাস', 'Deep breathing', 1, '৩ মিনিট', '3 min', '৪ সেকেন্ড শ্বাস নিন, ৬ সেকেন্ডে ছাড়ুন।',
        'Breathe in for 4 seconds, out for 6.'),
    ],
  },
];

export const workoutById = Object.fromEntries(workouts.map((w) => [w.id, w]));

export const setCount = (w: Workout) => w.exercises.reduce((n, e) => n + e.sets, 0);
