// Sample data for testing purposes
export const createSamplePolls = () => {
  const samplePolls = [
    {
      id: 'poll_sample_1',
      title: 'What is your favorite programming language?',
      description: 'Help us understand what programming languages developers prefer most.',
      options: [
        { text: 'JavaScript', votes: 15 },
        { text: 'Python', votes: 12 },
        { text: 'Java', votes: 8 },
        { text: 'C++', votes: 5 }
      ],
      createdAt: new Date('2025-07-20').toISOString(),
      expiresAt: null,
      isPublic: true,
      allowMultipleVotes: false,
      allowComments: true,
      author: 'Sample User',
      authorId: 'user_sample',
      totalVotes: 40,
      voters: ['user1', 'user2', 'user3']
    },
    {
      id: 'poll_sample_2',
      title: 'Which frontend frameworks do you use?',
      description: 'Multiple selection allowed. Tell us about your frontend tech stack.',
      options: [
        { text: 'React', votes: 25 },
        { text: 'Vue.js', votes: 18 },
        { text: 'Angular', votes: 12 },
        { text: 'Svelte', votes: 8 },
        { text: 'Next.js', votes: 22 }
      ],
      createdAt: new Date('2025-07-22').toISOString(),
      expiresAt: new Date('2025-08-22').toISOString(),
      isPublic: true,
      allowMultipleVotes: true,
      allowComments: true,
      author: 'Tech Lead',
      authorId: 'user_tech',
      totalVotes: 45,
      voters: ['user1', 'user4', 'user5']
    },
    {
      id: 'poll_sample_3',
      title: 'Best time for team meetings?',
      description: 'Help us find the optimal meeting time for our remote team.',
      options: [
        { text: '9:00 AM', votes: 8 },
        { text: '10:00 AM', votes: 15 },
        { text: '2:00 PM', votes: 12 },
        { text: '3:00 PM', votes: 6 }
      ],
      createdAt: new Date('2025-07-24').toISOString(),
      expiresAt: new Date('2025-07-30').toISOString(),
      isPublic: true,
      allowMultipleVotes: false,
      allowComments: false,
      author: 'Project Manager',
      authorId: 'user_pm',
      totalVotes: 41,
      voters: ['user2', 'user3', 'user6']
    }
  ];

  // Save to localStorage
  localStorage.setItem('polls', JSON.stringify(samplePolls));
  console.log('Sample polls created!');
};

export const createSampleUser = () => {
  const sampleUser = {
    id: 'user_current',
    name: 'John Doe',
    email: 'john@example.com'
  };
  
  localStorage.setItem('user', JSON.stringify(sampleUser));
  localStorage.setItem('isAuthenticated', 'true');
  console.log('Sample user created!');
};

// Initialize sample data if none exists
export const initializeSampleDataIfNeeded = () => {
  const existingPolls = localStorage.getItem('polls');
  const existingUser = localStorage.getItem('user');
  
  if (!existingPolls || JSON.parse(existingPolls).length === 0) {
    console.log('No polls found, creating sample polls...');
    createSamplePolls();
  }
  
  if (!existingUser) {
    console.log('No user found, creating sample user...');
    createSampleUser();
  }
};
