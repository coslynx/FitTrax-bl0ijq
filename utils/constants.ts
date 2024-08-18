export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000/api';

export const GOAL_TYPES = [
  'Weight Loss',
  'Muscle Gain',
  'Running Distance',
  'Calorie Deficit',
  'Strength Training',
  'Flexibility',
  'Other',
];

export const TRACKING_METHODS = [
  'Progress Bar',
  'Chart',
  'Manual Log',
];

export const DEFAULT_PROFILE_PICTURE = '/default-profile-picture.png';

export const SENTRY_DSN = process.env.NEXT_PUBLIC_SENTRY_DSN || '';