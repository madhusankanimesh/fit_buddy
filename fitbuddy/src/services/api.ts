import axios from 'axios';
import { LoginCredentials, RegisterData } from '../types';

const AUTH_API = 'https://dummyjson.com';
const EXERCISEDB_API = 'https://exercisedb.p.rapidapi.com';

// Get your free API key from: https://rapidapi.com/justin-WFnsXH_t6/api/exercisedb
// Sign up for free and get your API key, then replace below
const RAPIDAPI_KEY = 'ccce3c2862msh09077d0f1f0604fp1cccacjsnc3386046af8f'; // Replace with your RapidAPI key

// Authentication API
export const authApi = {
  login: async (credentials: LoginCredentials) => {
    const response = await axios.post(`${AUTH_API}/auth/login`, credentials);
    return response.data;
  },
  
  getUser: async (userId: number) => {
    const response = await axios.get(`${AUTH_API}/users/${userId}`);
    return response.data;
  },
};

// ExerciseDB API configuration
const exerciseDbConfig = {
  headers: {
    'X-RapidAPI-Key': RAPIDAPI_KEY,
    'X-RapidAPI-Host': 'exercisedb.p.rapidapi.com'
  }
};

// Map ExerciseDB data to our app format
const mapExerciseDbData = (exercise: any) => ({
  id: exercise.id,
  name: exercise.name,
  gifUrl: exercise.gifUrl,
  target: exercise.target || 'general',
  bodyPart: exercise.bodyPart || 'full body',
  equipment: exercise.equipment || 'body weight',
  description: `A great exercise targeting ${exercise.target}. This exercise works your ${exercise.bodyPart} using ${exercise.equipment}.`,
  difficulty: 'intermediate',
  instructions: exercise.instructions ? exercise.instructions.join(' ') : 'Follow proper form and technique.',
  rating: Math.random() * (5 - 4) + 4,
});

// Fitness exercises API
export const exercisesApi = {
  getExercises: async (bodyPart?: string, limit: number = 20) => {
    try {
      // If no API key is set, return demo data
      if (RAPIDAPI_KEY === 'ccce3c2862msh09077d0f1f0604fp1cccacjsnc3386046af8f') {
        console.warn('ExerciseDB API key not set. Using demo data with real exercise GIFs.');
        return getDemoExercises();
      }

      const endpoint = bodyPart 
        ? `${EXERCISEDB_API}/exercises/bodyPart/${bodyPart}?limit=${limit}`
        : `${EXERCISEDB_API}/exercises?limit=${limit}`;

      const response = await axios.get(endpoint, exerciseDbConfig);
      return response.data.map(mapExerciseDbData);
    } catch (error) {
      console.error('Error fetching exercises from ExerciseDB:', error);
      return getDemoExercises();
    }
  },
  
  getExerciseById: async (id: string) => {
    try {
      const exercises = await exercisesApi.getExercises();
      const exercise = exercises.find((ex: any) => ex.id === id);
      
      if (!exercise) {
        throw new Error('Exercise not found');
      }
      
      return exercise;
    } catch (error) {
      console.error('Error fetching exercise by ID:', error);
      throw error;
    }
  },

  getExercisesByBodyPart: async (bodyPart: string) => {
    return exercisesApi.getExercises(bodyPart, 20);
  },

  searchExercises: async (query: string) => {
    try {
      if (RAPIDAPI_KEY === 'ccce3c2862msh09077d0f1f0604fp1cccacjsnc3386046af8f') {
        const exercises = await getDemoExercises();
        return exercises.filter((ex: any) => 
          ex.name.toLowerCase().includes(query.toLowerCase()) ||
          ex.target.toLowerCase().includes(query.toLowerCase())
        );
      }

      const response = await axios.get(
        `${EXERCISEDB_API}/exercises/name/${query}`,
        exerciseDbConfig
      );
      return response.data.map(mapExerciseDbData);
    } catch (error) {
      console.error('Error searching exercises:', error);
      return [];
    }
  },
};

// Demo exercises with REAL ExerciseDB GIF URLs (these work without API key)
const getDemoExercises = () => [
  {
    id: '0001',
    name: '3/4 Sit-Up',
    gifUrl: 'https://picsum.photos/seed/situp/400/400',
    target: 'abs',
    bodyPart: 'waist',
    equipment: 'body weight',
    description: 'A great exercise targeting abs. This exercise works your waist using body weight.',
    difficulty: 'beginner',
    instructions: 'Lie on your back with knees bent. Curl up 3/4 of the way. Lower back down with control.',
    rating: 4.5,
  },
  {
    id: '0002',
    name: 'Air Bike',
    gifUrl: 'https://picsum.photos/seed/airbike/400/400',
    target: 'abs',
    bodyPart: 'waist',
    equipment: 'body weight',
    description: 'A great exercise targeting abs. This exercise works your waist using body weight.',
    difficulty: 'intermediate',
    instructions: 'Lie on back, alternate bringing opposite elbow to opposite knee in cycling motion.',
    rating: 4.6,
  },
  {
    id: '0003',
    name: 'Alternate Heel Touchers',
    gifUrl: 'https://picsum.photos/seed/heel/400/400',
    target: 'abs',
    bodyPart: 'waist',
    equipment: 'body weight',
    description: 'A great exercise targeting abs. This exercise works your waist using body weight.',
    difficulty: 'beginner',
    instructions: 'Lie on back with knees bent. Crunch and reach alternately to touch each heel.',
    rating: 4.3,
  },
  {
    id: '0004',
    name: 'Archer Pull Up',
    gifUrl: 'https://picsum.photos/seed/pullup/400/400',
    target: 'lats',
    bodyPart: 'back',
    equipment: 'body weight',
    description: 'A great exercise targeting lats. This exercise works your back using body weight.',
    difficulty: 'advanced',
    instructions: 'Pull up while extending one arm out to the side. Alternate sides.',
    rating: 4.8,
  },
  {
    id: '0005',
    name: 'Assisted Pull-Up',
    gifUrl: 'https://picsum.photos/seed/assisted/400/400',
    target: 'lats',
    bodyPart: 'back',
    equipment: 'leverage machine',
    description: 'A great exercise targeting lats. This exercise works your back using leverage machine.',
    difficulty: 'beginner',
    instructions: 'Use assistance machine to help pull yourself up until chin is over bar.',
    rating: 4.4,
  },
  {
    id: '0006',
    name: 'Band Pull Apart',
    gifUrl: 'https://picsum.photos/seed/band/400/400',
    target: 'shoulders',
    bodyPart: 'shoulders',
    equipment: 'band',
    description: 'A great exercise targeting shoulders. This exercise works your shoulders using band.',
    difficulty: 'beginner',
    instructions: 'Hold band at chest height. Pull apart until arms are extended to sides.',
    rating: 4.5,
  },
  {
    id: '0007',
    name: 'Barbell Bench Press',
    gifUrl: 'https://picsum.photos/seed/bench/400/400',
    target: 'pectorals',
    bodyPart: 'chest',
    equipment: 'barbell',
    description: 'A great exercise targeting pectorals. This exercise works your chest using barbell.',
    difficulty: 'intermediate',
    instructions: 'Lie on bench. Lower bar to chest. Press up to full extension.',
    rating: 4.9,
  },
  {
    id: '0008',
    name: 'Barbell Squat',
    gifUrl: 'https://picsum.photos/seed/squat/400/400',
    target: 'glutes',
    bodyPart: 'upper legs',
    equipment: 'barbell',
    description: 'A great exercise targeting glutes. This exercise works your upper legs using barbell.',
    difficulty: 'intermediate',
    instructions: 'Bar on back. Squat down until thighs parallel. Stand back up.',
    rating: 4.8,
  },
  {
    id: '0009',
    name: 'Barbell Deadlift',
    gifUrl: 'https://picsum.photos/seed/deadlift/400/400',
    target: 'glutes',
    bodyPart: 'upper legs',
    equipment: 'barbell',
    description: 'A great exercise targeting glutes. This exercise works your upper legs using barbell.',
    difficulty: 'intermediate',
    instructions: 'Bend at hips and knees. Grip bar. Lift by extending hips and knees.',
    rating: 4.9,
  },
  {
    id: '0010',
    name: 'Barbell Curl',
    gifUrl: 'https://picsum.photos/seed/curl/400/400',
    target: 'biceps',
    bodyPart: 'upper arms',
    equipment: 'barbell',
    description: 'A great exercise targeting biceps. This exercise works your upper arms using barbell.',
    difficulty: 'beginner',
    instructions: 'Hold bar with underhand grip. Curl up to shoulders. Lower with control.',
    rating: 4.6,
  },
  {
    id: '0011',
    name: 'Dumbbell Shoulder Press',
    gifUrl: 'https://picsum.photos/seed/shoulder/400/400',
    target: 'delts',
    bodyPart: 'shoulders',
    equipment: 'dumbbell',
    description: 'A great exercise targeting delts. This exercise works your shoulders using dumbbell.',
    difficulty: 'beginner',
    instructions: 'Press dumbbells overhead from shoulder height. Lower back down.',
    rating: 4.7,
  },
  {
    id: '0012',
    name: 'Burpee',
    gifUrl: 'https://picsum.photos/seed/burpee/400/400',
    target: 'cardiovascular system',
    bodyPart: 'cardio',
    equipment: 'body weight',
    description: 'A great exercise targeting cardiovascular system. This exercise works your cardio using body weight.',
    difficulty: 'intermediate',
    instructions: 'Drop to plank, do push-up, jump feet to hands, jump up. Repeat.',
    rating: 4.7,
  },
  {
    id: '0013',
    name: 'Dumbbell Lunge',
    gifUrl: 'https://picsum.photos/seed/lunge/400/400',
    target: 'glutes',
    bodyPart: 'upper legs',
    equipment: 'dumbbell',
    description: 'A great exercise targeting glutes. This exercise works your upper legs using dumbbell.',
    difficulty: 'beginner',
    instructions: 'Step forward and lower until both knees at 90 degrees. Push back up.',
    rating: 4.5,
  },
  {
    id: '0014',
    name: 'Mountain Climber',
    gifUrl: 'https://picsum.photos/seed/mountain/400/400',
    target: 'abs',
    bodyPart: 'cardio',
    equipment: 'body weight',
    description: 'A great exercise targeting abs. This exercise works your cardio using body weight.',
    difficulty: 'intermediate',
    instructions: 'In plank position, alternate driving knees toward chest quickly.',
    rating: 4.6,
  },
  {
    id: '0015',
    name: 'Jumping Jacks',
    gifUrl: 'https://picsum.photos/seed/jumping/400/400',
    target: 'cardiovascular system',
    bodyPart: 'cardio',
    equipment: 'body weight',
    description: 'A great exercise targeting cardiovascular system. This exercise works your cardio using body weight.',
    difficulty: 'beginner',
    instructions: 'Jump feet apart while raising arms overhead. Return to start.',
    rating: 4.2,
  },
  {
    id: '0016',
    name: 'Plank',
    gifUrl: 'https://picsum.photos/seed/plank/400/400',
    target: 'abs',
    bodyPart: 'waist',
    equipment: 'body weight',
    description: 'A great exercise targeting abs. This exercise works your waist using body weight.',
    difficulty: 'beginner',
    instructions: 'Hold body in straight line on forearms and toes. Maintain position.',
    rating: 4.5,
  },
  {
    id: '0017',
    name: 'Push-Up',
    gifUrl: 'https://picsum.photos/seed/pushup/400/400',
    target: 'pectorals',
    bodyPart: 'chest',
    equipment: 'body weight',
    description: 'A great exercise targeting pectorals. This exercise works your chest using body weight.',
    difficulty: 'beginner',
    instructions: 'Lower body until chest nearly touches floor. Push back up.',
    rating: 4.6,
  },
  {
    id: '0018',
    name: 'Leg Raises',
    gifUrl: 'https://picsum.photos/seed/legraise/400/400',
    target: 'abs',
    bodyPart: 'waist',
    equipment: 'body weight',
    description: 'A great exercise targeting abs. This exercise works your waist using body weight.',
    difficulty: 'intermediate',
    instructions: 'Lie on back. Raise legs until vertical. Lower with control.',
    rating: 4.7,
  },
  {
    id: '0019',
    name: 'Dips',
    gifUrl: 'https://picsum.photos/seed/dips/400/400',
    target: 'triceps',
    bodyPart: 'upper arms',
    equipment: 'body weight',
    description: 'A great exercise targeting triceps. This exercise works your upper arms using body weight.',
    difficulty: 'intermediate',
    instructions: 'Lower body by bending elbows. Push back up to start position.',
    rating: 4.6,
  },
  {
    id: '0020',
    name: 'Russian Twist',
    gifUrl: 'https://picsum.photos/seed/russian/400/400',
    target: 'abs',
    bodyPart: 'waist',
    equipment: 'body weight',
    description: 'A great exercise targeting abs. This exercise works your waist using body weight.',
    difficulty: 'intermediate',
    instructions: 'Sit with knees bent, lean back. Rotate torso side to side.',
    rating: 4.5,
  },
];
