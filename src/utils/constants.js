export const SYMPTOMS = [
  { id: 'fatigue', label: 'Fatigue', icon: 'Battery', category: 'energy' },
  { id: 'brain_fog', label: 'Brain Fog', icon: 'Cloud', category: 'cognitive' },
  { id: 'joint_pain', label: 'Joint Pain', icon: 'Bone', category: 'pain' },
  { id: 'muscle_aches', label: 'Muscle Aches', icon: 'Dumbbell', category: 'pain' },
  { id: 'weight_gain', label: 'Weight Changes', icon: 'Scale', category: 'metabolic' },
  { id: 'hair_loss', label: 'Hair Loss', icon: 'Scissors', category: 'physical' },
  { id: 'cold_sensitivity', label: 'Cold Sensitivity', icon: 'Snowflake', category: 'physical' },
  { id: 'dry_skin', label: 'Dry Skin', icon: 'Droplets', category: 'physical' },
  { id: 'mood_changes', label: 'Mood Changes', icon: 'Heart', category: 'mental' },
  { id: 'anxiety', label: 'Anxiety', icon: 'AlertCircle', category: 'mental' },
  { id: 'depression', label: 'Low Mood', icon: 'CloudRain', category: 'mental' },
  { id: 'digestive', label: 'Digestive Issues', icon: 'Apple', category: 'digestive' },
  { id: 'bloating', label: 'Bloating', icon: 'Circle', category: 'digestive' },
  { id: 'puffiness', label: 'Swelling/Puffiness', icon: 'Droplet', category: 'physical' },
  { id: 'heart_palps', label: 'Heart Palpitations', icon: 'HeartPulse', category: 'cardiovascular' },
  { id: 'insomnia', label: 'Sleep Issues', icon: 'Moon', category: 'energy' },
  { id: 'headache', label: 'Headache', icon: 'Zap', category: 'pain' },
  { id: 'neck_pressure', label: 'Neck Pressure', icon: 'Target', category: 'thyroid' },
];

export const SEVERITY_LABELS = {
  1: 'Mild',
  2: 'Moderate',
  3: 'Noticeable',
  4: 'Severe',
  5: 'Very Severe',
};

export const SEVERITY_COLORS = {
  1: '#8BC49E',
  2: '#B8D4A3',
  3: '#F0C987',
  4: '#E8927C',
  5: '#D45B5B',
};

export const ENERGY_LABELS = {
  1: 'Crashed',
  2: 'Exhausted',
  3: 'Very Low',
  4: 'Low',
  5: 'Below Average',
  6: 'Okay',
  7: 'Decent',
  8: 'Good',
  9: 'Great',
  10: 'Amazing',
};

export const ENERGY_COLORS = {
  1: '#D45B5B',
  2: '#E06B5B',
  3: '#E8927C',
  4: '#ECAB7C',
  5: '#F0C987',
  6: '#D4D88A',
  7: '#B8D4A3',
  8: '#8BC49E',
  9: '#6BAF8E',
  10: '#4A9A7E',
};

export const COMMON_TRIGGERS = [
  'Stress',
  'Poor Sleep',
  'Gluten',
  'Dairy',
  'Sugar',
  'Alcohol',
  'Overexertion',
  'Weather Change',
  'Illness',
  'Missed Medication',
  'Hormonal Cycle',
  'Travel',
];

export const DEFAULT_SUPPLEMENTS = [
  { name: 'Selenium', dosage: '200mcg', category: 'mineral' },
  { name: 'Vitamin D3', dosage: '2000IU', category: 'vitamin' },
  { name: 'Zinc', dosage: '30mg', category: 'mineral' },
  { name: 'Vitamin B12', dosage: '1000mcg', category: 'vitamin' },
  { name: 'Iron', dosage: '18mg', category: 'mineral' },
  { name: 'Magnesium', dosage: '400mg', category: 'mineral' },
  { name: 'Omega-3', dosage: '1000mg', category: 'fatty acid' },
  { name: 'Probiotics', dosage: '10B CFU', category: 'gut health' },
  { name: 'Ashwagandha', dosage: '600mg', category: 'adaptogen' },
  { name: 'Turmeric', dosage: '500mg', category: 'anti-inflammatory' },
  { name: 'CoQ10', dosage: '100mg', category: 'antioxidant' },
  { name: 'Vitamin C', dosage: '500mg', category: 'vitamin' },
  { name: 'L-Tyrosine', dosage: '500mg', category: 'amino acid' },
  { name: 'Vitamin A', dosage: '5000IU', category: 'vitamin' },
];

export const TABS = [
  { id: 'dashboard', label: 'Home', icon: 'LayoutDashboard' },
  { id: 'symptoms', label: 'Symptoms', icon: 'Activity' },
  { id: 'energy', label: 'Energy', icon: 'Zap' },
  { id: 'flareups', label: 'Flare-ups', icon: 'Flame' },
  { id: 'supplements', label: 'Supps', icon: 'Pill' },
  { id: 'insights', label: 'Insights', icon: 'BarChart3' },
];
