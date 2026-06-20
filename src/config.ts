// Configuration constants for the application

// API base URL (Docker/production: set VITE_API_URL=/api for same-origin)
const viteApi = import.meta.env.VITE_API_URL as string | undefined;
export const API_URL =
  viteApi !== undefined && viteApi !== '' ? viteApi : 'http://localhost:5000/api';

// Socket.io server URL (unset/empty = current browser origin in client)
const viteSocket = import.meta.env.VITE_SOCKET_URL as string | undefined;
export const SOCKET_URL =
  viteSocket !== undefined && viteSocket !== ''
    ? viteSocket
    : typeof window !== 'undefined'
      ? window.location.origin
      : 'http://localhost:5000';

// Specialist options for doctor signup
export const SPECIALIST_OPTIONS = [
  'Cardiologist',
  'Dermatologist',
  'Endocrinologist',
  'Gastroenterologist',
  'Neurologist',
  'Obstetrician/Gynecologist',
  'Ophthalmologist',
  'Orthopedic Surgeon',
  'Otolaryngologist (ENT)',
  'Pediatrician',
  'Psychiatrist',
  'Pulmonologist',
  'Rheumatologist',
  'Urologist',
  'General Physician',
  'Dentist'
];

// Days of the week for clinic availability
export const DAYS_OF_WEEK = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday'
];

// Pagination config
export const ITEMS_PER_PAGE = 10;