import { Tutor } from './types';

export const MOCK_TUTORS: Tutor[] = [
  {
    id: 'tutor_1',
    fullName: 'Dr. Sarah Wilson',
    avatarUrl: '/avatars/tutor-1.jpg',
    bio: 'Certified Mathematics professor with over 10 years of teaching experience. I specialize in Calculus, Algebra, and Statistics for high school and college students.',
    subjects: ['Mathematics', 'Calculus', 'Statistics'],
    hourlyRate: 45,
    yearsOfExperience: 12,
    averageRating: 4.9,
    reviewCount: 128,
    approvalStatus: 'approved',
    isPublic: true,
    certificates: [
      { id: 'c1', title: 'PhD in Mathematics', issuer: 'Stanford University', year: 2012 },
      { id: 'c2', title: 'State Teaching License', issuer: 'California Board', year: 2014 }
    ],
    availabilitySlots: [
      { day: 'monday', startTime: '09:00', endTime: '17:00' },
      { day: 'wednesday', startTime: '09:00', endTime: '17:00' },
      { day: 'friday', startTime: '09:00', endTime: '12:00' }
    ],
    feedbacks: [
      { id: 'f1', studentName: 'Alex J.', rating: 5, comment: 'Excellent teacher, made complex calculus seem simple.', date: '2024-04-20' },
      { id: 'f2', studentName: 'Maria G.', rating: 4, comment: 'Very patient and clear explanations.', date: '2024-03-15' }
    ]
  },
  {
    id: 'tutor_2',
    fullName: 'James Chen',
    avatarUrl: '/avatars/tutor-2.jpg',
    bio: 'Full-stack software engineer at a top tech company. I can help you master React, Node.js, and System Design. Practical, project-based learning is my approach.',
    subjects: ['Computer Science', 'React', 'Node.js'],
    hourlyRate: 60,
    yearsOfExperience: 7,
    averageRating: 4.8,
    reviewCount: 85,
    approvalStatus: 'approved',
    isPublic: true,
    certificates: [
      { id: 'c3', title: 'AWS Certified Solutions Architect', issuer: 'Amazon', year: 2021 }
    ],
    availabilitySlots: [
      { day: 'tuesday', startTime: '18:00', endTime: '21:00' },
      { day: 'thursday', startTime: '18:00', endTime: '21:00' },
      { day: 'saturday', startTime: '10:00', endTime: '16:00' }
    ],
    feedbacks: [
      { id: 'f3', studentName: 'Kevin L.', rating: 5, comment: 'James helped me land my first junior dev job!', date: '2024-05-01' }
    ]
  },
  {
    id: 'tutor_3',
    fullName: 'Elena Rodriguez',
    avatarUrl: '/avatars/tutor-3.jpg',
    bio: 'Native Spanish speaker and professional linguist. I make learning Spanish fun and cultural. All levels from beginners to advanced business Spanish.',
    subjects: ['Spanish', 'Linguistics'],
    hourlyRate: 35,
    yearsOfExperience: 5,
    averageRating: 5.0,
    reviewCount: 42,
    approvalStatus: 'approved',
    isPublic: true,
    certificates: [
      { id: 'c4', title: 'DELE C2 Mastery', issuer: 'Instituto Cervantes', year: 2019 }
    ],
    availabilitySlots: [
      { day: 'monday', startTime: '10:00', endTime: '19:00' },
      { day: 'tuesday', startTime: '10:00', endTime: '19:00' },
      { day: 'wednesday', startTime: '10:00', endTime: '19:00' }
    ],
    feedbacks: []
  },
  {
    id: 'tutor_4',
    fullName: 'Mark Thompson',
    avatarUrl: '/avatars/tutor-4.jpg',
    bio: 'Physics enthusiast and researcher. I help students prepare for AP Physics and GRE. Deep conceptual understanding is what we aim for.',
    subjects: ['Physics', 'Science'],
    hourlyRate: 40,
    yearsOfExperience: 8,
    averageRating: 4.7,
    reviewCount: 64,
    approvalStatus: 'approved',
    isPublic: true,
    certificates: [],
    availabilitySlots: [
      { day: 'thursday', startTime: '14:00', endTime: '20:00' },
      { day: 'sunday', startTime: '10:00', endTime: '14:00' }
    ],
    feedbacks: []
  },
  {
    id: 'tutor_5',
    fullName: 'Sophie Laurent',
    avatarUrl: '/avatars/tutor-5.jpg',
    bio: 'Parisian native with a passion for French literature and arts. Join me to improve your conversation skills and accent.',
    subjects: ['French', 'Arts'],
    hourlyRate: 38,
    yearsOfExperience: 6,
    averageRating: 4.6,
    reviewCount: 31,
    approvalStatus: 'pending', // NOT APPROVED - Should not show in public list
    isPublic: true,
    certificates: [],
    availabilitySlots: [
      { day: 'friday', startTime: '10:00', endTime: '18:00' }
    ],
    feedbacks: []
  },
  {
    id: 'tutor_6',
    fullName: 'Robert Miller',
    avatarUrl: '/avatars/tutor-6.jpg',
    bio: 'Economics expert and former financial analyst. I explain complex economic theories using real-world examples.',
    subjects: ['Economics', 'Finance'],
    hourlyRate: 50,
    yearsOfExperience: 15,
    averageRating: 4.5,
    reviewCount: 92,
    approvalStatus: 'approved',
    isPublic: false, // NOT PUBLIC - Should not show in public list
    certificates: [],
    availabilitySlots: [
      { day: 'monday', startTime: '08:00', endTime: '12:00' }
    ],
    feedbacks: []
  },
  {
    id: 'tutor_7',
    fullName: 'Alice Zhang',
    avatarUrl: '/avatars/tutor-7.jpg',
    bio: 'Data Scientist at a healthcare startup. Specialized in Python, SQL, and Machine Learning. Let\'s build your data portfolio.',
    subjects: ['Data Science', 'Python', 'Machine Learning'],
    hourlyRate: 70,
    yearsOfExperience: 4,
    averageRating: 4.9,
    reviewCount: 25,
    approvalStatus: 'approved',
    isPublic: true,
    certificates: [],
    availabilitySlots: [
      { day: 'saturday', startTime: '09:00', endTime: '18:00' }
    ],
    feedbacks: []
  },
  {
    id: 'tutor_8',
    fullName: 'David Brown',
    avatarUrl: '/avatars/tutor-8.jpg',
    bio: 'English Literature major. I help with essay writing, grammar, and literature analysis for university applications.',
    subjects: ['English', 'Literature', 'Writing'],
    hourlyRate: 30,
    yearsOfExperience: 3,
    averageRating: 4.4,
    reviewCount: 18,
    approvalStatus: 'approved',
    isPublic: true,
    certificates: [],
    availabilitySlots: [
      { day: 'wednesday', startTime: '15:00', endTime: '21:00' },
      { day: 'sunday', startTime: '15:00', endTime: '21:00' }
    ],
    feedbacks: []
  }
];
