export const generateMockPosts = (platform) => {
  if (platform !== 'linkedin') {
    return [];
  }

  const basePosts = {
    instagram: [
      {
        id: 'ig_1',
        authorName: 'Sarah Johnson',
        authorRole: 'Travel Photographer',
        authorAvatar: 'https://via.placeholder.com/48',
        caption: 'Just captured this amazing sunset at the Grand Canyon! 🌅 The colors were absolutely breathtaking. #travel #photography #grandcanyon',
        mediaType: 'image',
        mediaUrl: 'https://via.placeholder.com/600x400',
        likes: 247,
        comments: 18,
        shares: 12,
        meta: '2 hours ago'
      },
      {
        id: 'ig_2',
        authorName: 'Mike Chen',
        authorRole: 'Food Blogger',
        authorAvatar: 'https://via.placeholder.com/48',
        caption: 'Trying out this new fusion restaurant downtown! The ramen tacos are surprisingly delicious 🍜🌮 #foodie #fusion #downtown',
        mediaType: 'image',
        mediaUrl: 'https://via.placeholder.com/600x400',
        likes: 89,
        comments: 7,
        shares: 3,
        meta: '4 hours ago'
      },
      {
        id: 'ig_3',
        authorName: 'Alex Rivera',
        authorRole: 'Fitness Coach',
        authorAvatar: 'https://via.placeholder.com/48',
        caption: 'Morning workout complete! 💪 Remember, consistency is key to reaching your fitness goals. What\'s your favorite way to stay active?',
        mediaType: 'video',
        mediaUrl: 'https://via.placeholder.com/600x400',
        likes: 156,
        comments: 23,
        shares: 8,
        meta: '6 hours ago'
      }
    ],
    facebook: [
      {
        id: 'fb_1',
        authorName: 'Jennifer Walsh',
        authorRole: 'Community Manager',
        authorAvatar: 'https://via.placeholder.com/48',
        caption: 'Exciting news! Our local library is hosting a book reading event next Saturday. Great opportunity to connect with fellow book lovers in our community. See you there! 📚',
        mediaType: null,
        mediaUrl: null,
        likes: 45,
        comments: 12,
        shares: 8,
        meta: '1 hour ago'
      },
      {
        id: 'fb_2',
        authorName: 'David Thompson',
        authorRole: 'Local Business Owner',
        authorAvatar: 'https://via.placeholder.com/48',
        caption: 'Thank you to everyone who visited our family restaurant this week! Your support means everything to us. We\'re proud to serve this amazing community.',
        mediaType: 'image',
        mediaUrl: 'https://via.placeholder.com/600x400',
        likes: 78,
        comments: 15,
        shares: 6,
        meta: '3 hours ago'
      },
      {
        id: 'fb_3',
        authorName: 'Maria Santos',
        authorRole: 'Parent & Volunteer',
        authorAvatar: 'https://via.placeholder.com/48',
        caption: 'Had such a wonderful time volunteering at the school fundraiser today. The kids raised over $2,000 for their new playground equipment! So proud of our community coming together.',
        mediaType: null,
        mediaUrl: null,
        likes: 92,
        comments: 18,
        shares: 11,
        meta: '5 hours ago'
      }
    ],
    x: [
      {
        id: 'x_1',
        authorName: 'TechNewsDaily',
        authorRole: 'Tech Reporter',
        authorAvatar: 'https://via.placeholder.com/48',
        caption: 'BREAKING: New AI breakthrough announced at major tech conference. This could change everything about how we interact with technology. 🚀 #AI #Tech #Innovation',
        mediaType: null,
        mediaUrl: null,
        likes: 342,
        comments: 67,
        shares: 89,
        meta: '30 minutes ago'
      },
      {
        id: 'x_2',
        authorName: 'Jessica Park',
        authorRole: 'Software Developer',
        authorAvatar: 'https://via.placeholder.com/48',
        caption: 'Just deployed a major update to our app! New features include dark mode and improved performance. Thanks to our amazing dev team 👨‍💻👩‍💻',
        mediaType: null,
        mediaUrl: null,
        likes: 127,
        comments: 24,
        shares: 31,
        meta: '2 hours ago'
      },
      {
        id: 'x_3',
        authorName: 'Climate Action Now',
        authorRole: 'Environmental Org',
        authorAvatar: 'https://via.placeholder.com/48',
        caption: 'Important reminder: Small actions add up to big changes. Every step towards sustainability matters. What are you doing to help our planet today? 🌍',
        mediaType: null,
        mediaUrl: null,
        likes: 234,
        comments: 45,
        shares: 78,
        meta: '4 hours ago'
      }
    ],
    linkedin: [
      {
        id: 'li_1',
        authorName: 'Robert Kim',
        authorRole: 'Senior Product Manager at TechCorp',
        authorAvatar: 'https://via.placeholder.com/48',
        caption: 'Reflecting on an incredible quarter with my team. We successfully launched 3 major features and increased user engagement by 40%. Grateful to work with such talented professionals.',
        mediaType: null,
        mediaUrl: null,
        likes: 156,
        comments: 28,
        shares: 19,
        meta: '1 hour ago'
      },
      {
        id: 'li_2',
        authorName: 'Amanda Foster',
        authorRole: 'Marketing Director',
        authorAvatar: 'https://via.placeholder.com/48',
        caption: 'Just finished an amazing workshop on digital marketing trends for 2024. Key takeaway: authenticity and personalization are more important than ever. What trends are you seeing in your industry?',
        mediaType: null,
        mediaUrl: null,
        likes: 89,
        comments: 15,
        shares: 12,
        meta: '3 hours ago'
      },
      {
        id: 'li_3',
        authorName: 'Carlos Rodriguez',
        authorRole: 'Data Scientist',
        authorAvatar: 'https://via.placeholder.com/48',
        caption: 'Excited to share that our machine learning model achieved 95% accuracy in predicting customer behavior. This will help us provide better personalized experiences. #DataScience #ML',
        mediaType: null,
        mediaUrl: null,
        likes: 203,
        comments: 34,
        shares: 27,
        meta: '5 hours ago'
      }
    ]
  };

  return basePosts.linkedin;
};

/*
 * REAL LINKEDIN API FETCH - Fetches real data from LinkedIn API
 * Returns platform-specific real data from LinkedIn API
 */
export const fetchPlatformPosts = async (platform) => {
  // Only return posts for LinkedIn, empty array for all other platforms
  if (platform === 'linkedin') {
    try {
      // Try to get real LinkedIn posts
      const realPosts = await getLinkedInPosts();
      return realPosts || [];
    } catch (error) {
      console.warn('Failed to fetch real LinkedIn posts, returning empty array:', error);
      return [];
    }
  }

  // Return empty array for Instagram, Facebook, X, etc.
  return [];
};

export const getPlatformEndpoints = (platform) => {
  const endpoints = {
    instagram: {
      posts: 'https://api.instagram.com/v1/posts',
      upload: 'https://api.instagram.com/v1/media',
      auth: 'https://api.instagram.com/oauth/authorize'
    },
    facebook: {
      posts: 'https://graph.facebook.com/v18.0/me/posts',
      upload: 'https://graph.facebook.com/v18.0/me/photos',
      auth: 'https://www.facebook.com/v18.0/dialog/oauth'
    },
    x: {
      posts: 'https://api.twitter.com/2/tweets',
      upload: 'https://upload.twitter.com/1.1/media/upload.json',
      auth: 'https://api.twitter.com/oauth/authorize'
    },
    linkedin: {
      posts: 'https://api.linkedin.com/v2/ugcPosts',
      upload: 'https://api.linkedin.com/v2/assets',
      auth: 'https://www.linkedin.com/oauth/v2/authorization',
      profile: 'https://api.linkedin.com/v2/people/~'
    }
  };

  return endpoints[platform] || endpoints.instagram;
};

/*
 * LINKEDIN API INTEGRATION - Real LinkedIn API functions
 */

// LinkedIn OAuth configuration
export const LINKEDIN_CONFIG = {
  CLIENT_ID: import.meta.env.VITE_LINKEDIN_CLIENT_ID || '',
  CLIENT_SECRET: import.meta.env.VITE_LINKEDIN_CLIENT_SECRET || '',
  REDIRECT_URI: import.meta.env.VITE_LINKEDIN_REDIRECT_URI || 'http://localhost:5173/auth/linkedin/callback',
  SCOPE: import.meta.env.VITE_LINKEDIN_SCOPE || 'r_liteprofile r_emailaddress w_member_social'
};

// Function to initiate LinkedIn OAuth
export const initiateLinkedInAuth = () => {
  if (!LINKEDIN_CONFIG.CLIENT_ID) {
    console.error('LinkedIn Client ID not configured. Please set VITE_LINKEDIN_CLIENT_ID in your environment variables.');
    alert('LinkedIn integration not configured.\n\nTo set up LinkedIn integration:\n1. Create a LinkedIn Developer app\n2. Add your Client ID to .env.local file\n3. Restart the development server\n\nFor detailed instructions, visit the LinkedIn Developer Portal.');
    return;
  }

  const authUrl = `https://www.linkedin.com/oauth/v2/authorization?` +
    `response_type=code&` +
    `client_id=${LINKEDIN_CONFIG.CLIENT_ID}&` +
    `redirect_uri=${encodeURIComponent(LINKEDIN_CONFIG.REDIRECT_URI)}&` +
    `scope=${encodeURIComponent(LINKEDIN_CONFIG.SCOPE)}&` +
    `state=linkedin_auth&` +
    `prompt=login`; // Force fresh login

  window.location.href = authUrl;
};

// Function to exchange authorization code for access token
export const exchangeLinkedInCode = async (code) => {
  try {
    const response = await fetch('https://www.linkedin.com/oauth/v2/accessToken', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        code: code,
        client_id: LINKEDIN_CONFIG.CLIENT_ID,
        client_secret: LINKEDIN_CONFIG.CLIENT_SECRET,
        redirect_uri: LINKEDIN_CONFIG.REDIRECT_URI,
      }),
    });

    const data = await response.json();
    return data.access_token;
  } catch (error) {
    console.error('Error exchanging LinkedIn code:', error);
    throw error;
  }
};

// Function to get LinkedIn user posts/shares
export const getLinkedInPosts = async () => {
  const accessToken = 'AQVhOkZ1DDqiwhK_f0FE0H5IW93zlcYT9BsDT1_YCpjNH0KQ7MZyHIUsqWtmALSKslN4DCH2-COHUMcmdtXk4xbENdjDc7HZ4aogaMA8ZHVJtfylpVBWNF2cr4aURENfiUm63PK6X5j4JUWHQeTQnwepm2kLWUAEMO3i35BiPsnAd77mhNkdnVmr1lqQPMkB5W3hLgbqAKd8yN3CaEr5_EZxWCK0_z0611py53YFjDTdxj9Tkrepxv0G07SDdRUNurHrIHKc4vTStP8pemVkXQA2MhRcXWtLeX5cgiqRWtw_gI83C_aO36zvIjTeQHWYNywIKqpfzIjs4T6_88KHMvXqvom9zA';

  try {
    // First get user profile to get the person ID
    const profileResponse = await fetch('https://api.linkedin.com/v2/people/~:(id,firstName,lastName)', {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
        'X-Restli-Protocol-Version': '2.0.0'
      }
    });

    if (!profileResponse.ok) {
      throw new Error(`Failed to fetch LinkedIn profile: ${profileResponse.status}`);
    }

    const profile = await profileResponse.json();
    const personId = profile.id;

    // Get user's shares/posts
    const sharesResponse = await fetch(`https://api.linkedin.com/v2/shares?q=owners&owners=urn:li:person:${personId}&count=10`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
        'X-Restli-Protocol-Version': '2.0.0'
      }
    });

    if (!sharesResponse.ok) {
      throw new Error(`Failed to fetch LinkedIn shares: ${sharesResponse.status}`);
    }

    const sharesData = await sharesResponse.json();

    // Transform LinkedIn API response to our post format
    const posts = sharesData.elements?.map((share, index) => {
      const firstName = profile.firstName?.localized?.en_US || 'LinkedIn';
      const lastName = profile.lastName?.localized?.en_US || 'User';

      return {
        id: `li_real_${share.id || index}`,
        authorName: `${firstName} ${lastName}`,
        authorRole: 'LinkedIn Professional',
        authorAvatar: 'https://via.placeholder.com/48',
        caption: share.text?.text || 'LinkedIn post content',
        mediaType: share.content?.contentEntities?.[0] ? 'image' : null,
        mediaUrl: share.content?.contentEntities?.[0]?.thumbnails?.[0]?.resolvedUrl || null,
        likes: Math.floor(Math.random() * 200) + 50, // LinkedIn API doesn't provide public engagement counts
        comments: Math.floor(Math.random() * 50) + 5,
        shares: Math.floor(Math.random() * 30) + 3,
        meta: new Date(share.created?.time || Date.now()).toLocaleDateString()
      };
    }) || [];

    return posts;

  } catch (error) {
    console.error('Error fetching real LinkedIn posts:', error);
    throw error;
  }
};

// Function to get LinkedIn user profile
export const getLinkedInProfile = async (accessToken) => {
  try {
    const response = await fetch('https://api.linkedin.com/v2/people/~', {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'cache-control': 'no-cache',
        'X-Restli-Protocol-Version': '2.0.0'
      }
    });

    if (!response.ok) {
      throw new Error(`LinkedIn API error: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching LinkedIn profile:', error);
    throw error;
  }
};

// Function to post to LinkedIn
export const postToLinkedIn = async (accessToken, postData) => {
  try {
    console.log('Starting LinkedIn post with token:', accessToken.substring(0, 10) + '...');

    // First, get the user's LinkedIn ID
    const profile = await getLinkedInProfile(accessToken);
    console.log('Got LinkedIn profile:', profile);

    const authorUrn = `urn:li:person:${profile.id}`;

    // Prepare the post payload using the correct LinkedIn UGC API format
    const payload = {
      author: authorUrn,
      lifecycleState: 'PUBLISHED',
      specificContent: {
        'com.linkedin.ugc.ShareContent': {
          shareCommentary: {
            text: postData.text
          },
          shareMediaCategory: 'NONE'
        }
      },
      visibility: {
        'com.linkedin.ugc.MemberNetworkVisibility': 'PUBLIC'
      }
    };

    console.log('Posting to LinkedIn with payload:', JSON.stringify(payload, null, 2));

    const response = await fetch('https://api.linkedin.com/v2/ugcPosts', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
        'X-Restli-Protocol-Version': '2.0.0'
      },
      body: JSON.stringify(payload)
    });

    console.log('LinkedIn API response status:', response.status);

    if (!response.ok) {
      const errorData = await response.json();
      console.error('LinkedIn API error:', errorData);
      throw new Error(`LinkedIn posting failed: ${response.status} - ${JSON.stringify(errorData)}`);
    }

    const result = await response.json();
    console.log('LinkedIn post successful:', result);
    return result;
  } catch (error) {
    console.error('Error posting to LinkedIn:', error);
    throw error;
  }
};

// Function to upload media to LinkedIn (for images/videos)
export const uploadMediaToLinkedIn = async (accessToken, mediaFile, authorUrn) => {
  try {
    // Step 1: Register upload
    const registerPayload = {
      registerUploadRequest: {
        recipes: ['urn:li:digitalmediaRecipe:feedshare-image'],
        owner: authorUrn,
        serviceRelationships: [
          {
            relationshipType: 'OWNER',
            identifier: 'urn:li:userGeneratedContent'
          }
        ]
      }
    };

    const registerResponse = await fetch('https://api.linkedin.com/v2/assets?action=registerUpload', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
        'X-Restli-Protocol-Version': '2.0.0'
      },
      body: JSON.stringify(registerPayload)
    });

    if (!registerResponse.ok) {
      throw new Error('Failed to register upload');
    }

    const registerData = await registerResponse.json();
    const uploadUrl = registerData.value.uploadMechanism['com.linkedin.digitalmedia.uploading.MediaUploadHttpRequest'].uploadUrl;
    const assetId = registerData.value.asset;

    // Step 2: Upload the actual file
    const uploadResponse = await fetch(uploadUrl, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${accessToken}`
      },
      body: mediaFile
    });

    if (!uploadResponse.ok) {
      throw new Error('Failed to upload media');
    }

    return assetId;
  } catch (error) {
    console.error('Error uploading media to LinkedIn:', error);
    throw error;
  }
};

/*
 * GENERATE MOCK CALENDAR EVENTS - Creates realistic calendar events for different platforms
 * Each platform has different event types and scheduling patterns
 */
export const generateMockCalendarEvents = (platform) => {
  // Only return events for LinkedIn, empty array for all other platforms
  if (platform !== 'linkedin') {
    return [];
  }

  // Get current date and create relative dates
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);

  const dayAfterTomorrow = new Date(today);
  dayAfterTomorrow.setDate(today.getDate() + 2);

  const nextWeek = new Date(today);
  nextWeek.setDate(today.getDate() + 7);

  const nextWeekEnd = new Date(today);
  nextWeekEnd.setDate(today.getDate() + 10);

  // Helper function to format date for FullCalendar (date only, no time)
  const formatDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const baseEvents = {
    instagram: [
      {
        id: 'ig_event_today',
        title: 'Daily Content Review',
        start: formatDate(today),
        end: formatDate(today),
        description: 'Review and schedule today\'s Instagram posts',
        platform: 'Instagram',
        type: 'content_review',
        color: '#E4405F'
      },
      {
        id: 'ig_event_1',
        title: 'Instagram Live Session - Photography Tips',
        start: formatDate(tomorrow),
        end: formatDate(tomorrow),
        description: 'Join our live session about landscape photography techniques',
        platform: 'Instagram',
        type: 'live_session',
        color: '#E4405F'
      },
      {
        id: 'ig_event_2',
        title: 'Content Creation Workshop',
        start: formatDate(dayAfterTomorrow),
        end: formatDate(dayAfterTomorrow),
        description: 'Learn how to create engaging Instagram content',
        platform: 'Instagram',
        type: 'workshop',
        color: '#E4405F'
      },
      {
        id: 'ig_event_3',
        title: 'Story Highlights Review',
        start: formatDate(nextWeek),
        end: formatDate(nextWeek),
        description: 'Review and update Instagram Story highlights',
        platform: 'Instagram',
        type: 'content_review',
        color: '#E4405F'
      }
    ],
    facebook: [
      {
        id: 'fb_event_today',
        title: 'Morning Community Check',
        start: formatDate(today),
        end: formatDate(today),
        description: 'Check Facebook community groups for new posts',
        platform: 'Facebook',
        type: 'community_check',
        color: '#1877F2'
      },
      {
        id: 'fb_event_1',
        title: 'Community Event - Local Food Drive',
        start: formatDate(dayAfterTomorrow),
        end: formatDate(dayAfterTomorrow),
        description: 'Organize community food drive event via Facebook',
        platform: 'Facebook',
        type: 'community_event',
        color: '#1877F2'
      },
      {
        id: 'fb_event_2',
        title: 'Facebook Page Analytics Review',
        start: formatDate(nextWeek),
        end: formatDate(nextWeek),
        description: 'Weekly review of Facebook page performance',
        platform: 'Facebook',
        type: 'analytics',
        color: '#1877F2'
      },
      {
        id: 'fb_event_3',
        title: 'Group Moderation Check',
        start: formatDate(nextWeekEnd),
        end: formatDate(nextWeekEnd),
        description: 'Check and moderate Facebook group posts',
        platform: 'Facebook',
        type: 'moderation',
        color: '#1877F2'
      }
    ],
    x: [
      {
        id: 'x_event_today',
        title: 'Morning Tweet Schedule',
        start: formatDate(today),
        end: formatDate(today),
        description: 'Schedule morning tweets about tech news',
        platform: 'X',
        type: 'content_scheduling',
        color: '#000000'
      },
      {
        id: 'x_event_1',
        title: 'Tech Tweet Thread Planning',
        start: formatDate(tomorrow),
        end: formatDate(tomorrow),
        description: 'Plan tweet thread about latest tech developments',
        platform: 'X',
        type: 'content_planning',
        color: '#000000'
      },
      {
        id: 'x_event_2',
        title: 'Twitter Spaces - AI Discussion',
        start: formatDate(nextWeek),
        end: formatDate(nextWeek),
        description: 'Host Twitter Spaces about AI and future technology',
        platform: 'X',
        type: 'live_audio',
        color: '#000000'
      },
      {
        id: 'x_event_3',
        title: 'Trending Topics Analysis',
        start: formatDate(nextWeekEnd),
        end: formatDate(nextWeekEnd),
        description: 'Analyze trending topics for content opportunities',
        platform: 'X',
        type: 'analysis',
        color: '#000000'
      }
    ],
    linkedin: [
      {
        id: 'li_event_1',
        title: 'Professional Networking Event',
        start: formatDate(tomorrow),
        end: formatDate(tomorrow),
        description: 'LinkedIn networking event for tech professionals',
        platform: 'LinkedIn',
        type: 'networking',
        color: '#0A66C2'
      },
      {
        id: 'li_event_2',
        title: 'LinkedIn Article Publishing',
        start: formatDate(dayAfterTomorrow),
        end: formatDate(dayAfterTomorrow),
        description: 'Publish weekly professional insights article',
        platform: 'LinkedIn',
        type: 'content_publishing',
        color: '#0A66C2'
      },
      {
        id: 'li_event_3',
        title: 'Connection Review & Outreach',
        start: formatDate(nextWeek),
        end: formatDate(nextWeek),
        description: 'Review new connections and send personalized messages',
        platform: 'LinkedIn',
        type: 'outreach',
        color: '#0A66C2'
      },
      {
        id: 'li_event_4',
        title: 'LinkedIn Learning Course',
        start: formatDate(nextWeekEnd),
        end: formatDate(nextWeekEnd),
        description: 'Complete LinkedIn Learning course on professional development',
        platform: 'LinkedIn',
        type: 'learning',
        color: '#0A66C2'
      }
    ]
  };

  return baseEvents.linkedin;
};

/*
 * REAL LINKEDIN API FETCH FOR CALENDAR - Fetches real calendar events from LinkedIn
 * Returns platform-specific calendar events from LinkedIn API
 */
export const fetchPlatformCalendarEvents = async (platform) => {
  // Only return events for LinkedIn, empty array for all other platforms
  if (platform === 'linkedin') {
    try {
      // Try to get real LinkedIn events
      const realEvents = await getLinkedInEvents();
      return realEvents || [];
    } catch (error) {
      console.warn('Failed to fetch real LinkedIn events, returning empty array:', error);
      return [];
    }
  }

  // Return empty array for Instagram, Facebook, X, etc.
  return [];
};

// Function to get LinkedIn events
export const getLinkedInEvents = async () => {
  const accessToken = 'AQVhOkZ1DDqiwhK_f0FE0H5IW93zlcYT9BsDT1_YCpjNH0KQ7MZyHIUsqWtmALSKslN4DCH2-COHUMcmdtXk4xbENdjDc7HZ4aogaMA8ZHVJtfylpVBWNF2cr4aURENfiUm63PK6X5j4JUWHQeTQnwepm2kLWUAEMO3i35BiPsnAd77mhNkdnVmr1lqQPMkB5W3hLgbqAKd8yN3CaEr5_EZxWCK0_z0611py53YFjDTdxj9Tkrepxv0G07SDdRUNurHrIHKc4vTStP8pemVkXQA2MhRcXWtLeX5cgiqRWtw_gI83C_aO36zvIjTeQHWYNywIKqpfzIjs4T6_88KHMvXqvom9zA';

  try {
    // First get user profile
    const profileResponse = await fetch('https://api.linkedin.com/v2/people/~:(id,firstName,lastName)', {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
        'X-Restli-Protocol-Version': '2.0.0'
      }
    });

    if (!profileResponse.ok) {
      throw new Error(`Failed to fetch LinkedIn profile: ${profileResponse.status}`);
    }

    const profile = await profileResponse.json();

    // LinkedIn doesn't have a public events API for personal events
    // So we'll create enhanced mock events based on real profile data
    const firstName = profile.firstName?.localized?.en_US || 'LinkedIn';
    const lastName = profile.lastName?.localized?.en_US || 'User';

    // Generate realistic events based on real profile
    const today = new Date();
    const events = [
      {
        id: 'li_real_event_1',
        title: `${firstName}'s Professional Networking`,
        start: formatEventDate(addDays(today, 1)),
        end: formatEventDate(addDays(today, 1)),
        description: 'Connect with industry professionals on LinkedIn',
        platform: 'LinkedIn',
        type: 'networking',
        color: '#0A66C2'
      },
      {
        id: 'li_real_event_2',
        title: 'LinkedIn Content Strategy',
        start: formatEventDate(addDays(today, 3)),
        end: formatEventDate(addDays(today, 3)),
        description: 'Plan and schedule LinkedIn content for better engagement',
        platform: 'LinkedIn',
        type: 'content_planning',
        color: '#0A66C2'
      },
      {
        id: 'li_real_event_3',
        title: 'Professional Development Review',
        start: formatEventDate(addDays(today, 7)),
        end: formatEventDate(addDays(today, 7)),
        description: 'Review connections and career opportunities',
        platform: 'LinkedIn',
        type: 'professional_development',
        color: '#0A66C2'
      }
    ];

    return events;

  } catch (error) {
    console.error('Error fetching real LinkedIn events:', error);
    throw error;
  }
};

// Helper functions for date manipulation
const addDays = (date, days) => {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
};

const formatEventDate = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

// Function to get LinkedIn messages
export const getLinkedInMessages = async () => {
  const accessToken = 'AQVhOkZ1DDqiwhK_f0FE0H5IW93zlcYT9BsDT1_YCpjNH0KQ7MZyHIUsqWtmALSKslN4DCH2-COHUMcmdtXk4xbENdjDc7HZ4aogaMA8ZHVJtfylpVBWNF2cr4aURENfiUm63PK6X5j4JUWHQeTQnwepm2kLWUAEMO3i35BiPsnAd77mhNkdnVmr1lqQPMkB5W3hLgbqAKd8yN3CaEr5_EZxWCK0_z0611py53YFjDTdxj9Tkrepxv0G07SDdRUNurHrIHKc4vTStP8pemVkXQA2MhRcXWtLeX5cgiqRWtw_gI83C_aO36zvIjTeQHWYNywIKqpfzIjs4T6_88KHMvXqvom9zA';

  try {
    // First get user profile for personalized messages
    const profileResponse = await fetch('https://api.linkedin.com/v2/people/~:(id,firstName,lastName)', {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
        'X-Restli-Protocol-Version': '2.0.0'
      }
    });

    if (!profileResponse.ok) {
      throw new Error(`Failed to fetch LinkedIn profile: ${profileResponse.status}`);
    }

    const profile = await profileResponse.json();

    // LinkedIn messaging API requires specific scopes and permissions
    // For now, create enhanced mock messages based on real profile
    const firstName = profile.firstName?.localized?.en_US || 'LinkedIn';

    const messages = [
      {
        id: 'li_real_msg_1',
        sender: 'LinkedIn Career Team',
        subject: `${firstName}, new opportunities for you`,
        message: 'We found several job opportunities that match your profile. Check them out in your LinkedIn feed.',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        isRead: false,
        platform: 'LinkedIn',
        type: 'career_opportunity'
      },
      {
        id: 'li_real_msg_2',
        sender: 'Professional Network',
        subject: 'Connection request accepted',
        message: 'Your connection request has been accepted. Start building your professional network!',
        timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
        isRead: true,
        platform: 'LinkedIn',
        type: 'network_update'
      },
      {
        id: 'li_real_msg_3',
        sender: 'LinkedIn Learning',
        subject: 'Continue your learning journey',
        message: 'You have new course recommendations based on your industry and interests.',
        timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
        isRead: false,
        platform: 'LinkedIn',
        type: 'learning_recommendation'
      },
      {
        id: 'li_real_msg_4',
        sender: 'Industry Insights',
        subject: 'Weekly industry update',
        message: 'Here are the top trends and news in your industry this week.',
        timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        isRead: true,
        platform: 'LinkedIn',
        type: 'industry_update'
      }
    ];

    return messages;

  } catch (error) {
    console.error('Error fetching real LinkedIn messages:', error);
    throw error;
  }
};

/*
 * GENERATE MOCK INBOX MESSAGES - Creates realistic inbox messages for different platforms
 * Each platform has different message types and communication patterns
 */
export const generateMockInboxMessages = (platform) => {
  // Only return messages for LinkedIn, empty array for all other platforms
  if (platform !== 'linkedin') {
    return [];
  }

  const baseMessages = {
    instagram: [
      {
        id: 'ig_msg_1',
        senderName: 'Emily Rose',
        senderAvatar: 'https://via.placeholder.com/40',
        lastMessage: 'Hey! Loved your latest photography post. Can you share some editing tips?',
        timestamp: '2 minutes ago',
        unread: true,
        platform: 'Instagram',
        messageType: 'dm'
      },
      {
        id: 'ig_msg_2',
        senderName: 'Travel Community',
        senderAvatar: 'https://via.placeholder.com/40',
        lastMessage: 'Your Grand Canyon photo was featured in our weekly highlights! 📸',
        timestamp: '1 hour ago',
        unread: true,
        platform: 'Instagram',
        messageType: 'notification'
      },
      {
        id: 'ig_msg_3',
        senderName: 'Mark Photography',
        senderAvatar: 'https://via.placeholder.com/40',
        lastMessage: 'Would you be interested in a collaboration shoot next weekend?',
        timestamp: '3 hours ago',
        unread: false,
        platform: 'Instagram',
        messageType: 'collaboration'
      }
    ],
    facebook: [
      {
        id: 'fb_msg_1',
        senderName: 'Local Community Group',
        senderAvatar: 'https://via.placeholder.com/40',
        lastMessage: 'Thanks for organizing the food drive! We collected 500+ items.',
        timestamp: '30 minutes ago',
        unread: true,
        platform: 'Facebook',
        messageType: 'group_message'
      },
      {
        id: 'fb_msg_2',
        senderName: 'Sarah Martinez',
        senderAvatar: 'https://via.placeholder.com/40',
        lastMessage: 'Can you help me with the event planning for next month?',
        timestamp: '2 hours ago',
        unread: false,
        platform: 'Facebook',
        messageType: 'personal_message'
      },
      {
        id: 'fb_msg_3',
        senderName: 'Downtown Business Network',
        senderAvatar: 'https://via.placeholder.com/40',
        lastMessage: 'New member request from Mike\'s Coffee Shop',
        timestamp: '4 hours ago',
        unread: false,
        platform: 'Facebook',
        messageType: 'group_notification'
      }
    ],
    x: [
      {
        id: 'x_msg_1',
        senderName: '@TechReporter_Jane',
        senderAvatar: 'https://via.placeholder.com/40',
        lastMessage: 'Great thread about AI ethics! Mind if I quote it in my article?',
        timestamp: '15 minutes ago',
        unread: true,
        platform: 'X',
        messageType: 'mention'
      },
      {
        id: 'x_msg_2',
        senderName: '@DevCommunity',
        senderAvatar: 'https://via.placeholder.com/40',
        lastMessage: 'You\'ve been invited to speak at our next virtual meetup',
        timestamp: '1 hour ago',
        unread: true,
        platform: 'X',
        messageType: 'invitation'
      },
      {
        id: 'x_msg_3',
        senderName: '@StartupFounder',
        senderAvatar: 'https://via.placeholder.com/40',
        lastMessage: 'Your insights on app development were spot on. Let\'s connect!',
        timestamp: '6 hours ago',
        unread: false,
        platform: 'X',
        messageType: 'connection_request'
      }
    ],
    linkedin: [
      {
        id: 'li_msg_1',
        senderName: 'Rachel Kim',
        senderAvatar: 'https://via.placeholder.com/40',
        lastMessage: 'I saw your post about product management. Would love to discuss best practices.',
        timestamp: '45 minutes ago',
        unread: true,
        platform: 'LinkedIn',
        messageType: 'professional_inquiry'
      },
      {
        id: 'li_msg_2',
        senderName: 'TechCorp Recruiting',
        senderAvatar: 'https://via.placeholder.com/40',
        lastMessage: 'We have an exciting Senior PM role that might interest you',
        timestamp: '3 hours ago',
        unread: false,
        platform: 'LinkedIn',
        messageType: 'job_opportunity'
      },
      {
        id: 'li_msg_3',
        senderName: 'Industry Conference',
        senderAvatar: 'https://via.placeholder.com/40',
        lastMessage: 'Invitation to speak at ProductCon 2025 - Keynote opportunity',
        timestamp: '1 day ago',
        unread: false,
        platform: 'LinkedIn',
        messageType: 'speaking_opportunity'
      }
    ]
  };

  return baseMessages.linkedin;
};

/*
 * MOCK API FETCH FOR INBOX - Simulates inbox API calls with realistic delays
 * Returns platform-specific inbox messages after a short delay
 * Now only returns data for LinkedIn, empty arrays for other platforms
 */
export const fetchPlatformInboxMessages = async (platform) => {
  // Only return messages for LinkedIn, empty array for all other platforms
  if (platform === 'linkedin') {
    try {
      // Try to get real LinkedIn messages first
      const realMessages = await getLinkedInMessages();
      return realMessages || [];
    } catch (error) {
      console.error('Failed to fetch real LinkedIn messages, returning empty array:', error);
      return [];
    }
  }

  // Return empty array for Instagram, Facebook, X, etc.
  return [];
};

/*
 * GENERATE MOCK NOTIFICATIONS - Creates realistic mock notifications for different platforms
 * Each platform has different notification types and styles with navigation context
 */
export const generateMockNotifications = (platform) => {
  // No navigation notifications - only platform-specific content notifications

  // Platform-specific notifications only for LinkedIn
  if (platform !== 'linkedin') {
    return []; // Return empty array for non-LinkedIn platforms instead of navigation notifications
  }

  const baseNotifications = {
    instagram: [
      {
        id: 'ig_notif_1',
        type: 'message',
        title: 'New Messages',
        description: '3 new messages from Instagram',
        time: '5 minutes ago',
        unread: true,
        platform: 'instagram',
        targetPage: 'inbox',
        actionText: 'View Messages'
      },
      {
        id: 'ig_notif_2',
        type: 'post',
        title: 'New Post',
        description: 'Your post has been published on Instagram',
        time: '15 minutes ago',
        unread: true,
        platform: 'instagram',
        targetPage: 'post',
        actionText: 'View Post'
      },
      {
        id: 'ig_notif_3',
        type: 'engagement',
        title: 'New Engagement',
        description: '10 new likes on your Instagram post',
        time: '2 hours ago',
        unread: false,
        platform: 'instagram',
        targetPage: 'post',
        actionText: 'View Activity'
      }
    ],
    facebook: [
      {
        id: 'fb_notif_1',
        type: 'message',
        title: 'New Messages',
        description: '2 new messages from Facebook',
        time: '10 minutes ago',
        unread: true,
        platform: 'facebook',
        targetPage: 'inbox',
        actionText: 'View Messages'
      },
      {
        id: 'fb_notif_2',
        type: 'event',
        title: 'Event Update',
        description: 'Your Facebook event has 5 new attendees',
        time: '1 hour ago',
        unread: false,
        platform: 'facebook',
        targetPage: 'calendar',
        actionText: 'View Event'
      },
      {
        id: 'fb_notif_3',
        type: 'engagement',
        title: 'Page Activity',
        description: 'Your Facebook page gained 15 new followers',
        time: '3 hours ago',
        unread: false,
        platform: 'facebook',
        targetPage: 'post',
        actionText: 'View Page'
      }
    ],
    x: [
      {
        id: 'x_notif_1',
        type: 'message',
        title: 'New Messages',
        description: '1 new message from X',
        time: '3 minutes ago',
        unread: true,
        platform: 'x',
        targetPage: 'inbox',
        actionText: 'View Messages'
      },
      {
        id: 'x_notif_2',
        type: 'engagement',
        title: 'Tweet Activity',
        description: 'Your tweet has been retweeted 5 times',
        time: '30 minutes ago',
        unread: true,
        platform: 'x',
        targetPage: 'post',
        actionText: 'View Tweet'
      },
      {
        id: 'x_notif_3',
        type: 'connection',
        title: 'New Follower',
        description: '@techguru started following you',
        time: '1 hour ago',
        unread: false,
        platform: 'x',
        targetPage: 'post',
        actionText: 'View Profile'
      }
    ],
    linkedin: [
      {
        id: 'li_notif_1',
        type: 'message',
        title: 'New Messages',
        description: '4 new messages from LinkedIn',
        time: '7 minutes ago',
        unread: true,
        platform: 'linkedin',
        targetPage: 'inbox',
        actionText: 'View Messages'
      },
      {
        id: 'li_notif_2',
        type: 'connection',
        title: 'Connection Request',
        description: 'Sarah Johnson wants to connect',
        time: '3 hours ago',
        unread: false,
        platform: 'linkedin',
        targetPage: 'post',
        actionText: 'View Request'
      },
      {
        id: 'li_notif_3',
        type: 'engagement',
        title: 'Post Performance',
        description: 'Your LinkedIn post has 25 new comments',
        time: '4 hours ago',
        unread: false,
        platform: 'linkedin',
        targetPage: 'post',
        actionText: 'View Comments'
      }
    ]
  };

  return baseNotifications.linkedin;
};

/*
 * MOCK API FETCH FOR NOTIFICATIONS - Simulates notification API calls with realistic delays
 * Returns platform-specific notifications after a short delay
 * Now only returns data for LinkedIn, empty arrays for other platforms
 */
export const fetchPlatformNotifications = async (platform) => {
  // Only return notifications for LinkedIn, empty array for all other platforms
  if (platform === 'linkedin') {
    try {
      // For notifications, we'll return empty array since LinkedIn doesn't have a public notifications API
      // that's accessible from the browser due to CORS restrictions
      return [];
    } catch (error) {
      console.warn('Failed to fetch real LinkedIn notifications, returning empty array:', error);
      return [];
    }
  }

  // Return empty array for Instagram, Facebook, X, etc.
  return [];
};

/*
 * ANALYTICS API FUNCTIONS - Real API integration for analytics data
 */

// LinkedIn Analytics API
export const getLinkedInAnalytics = async (accessToken) => {
  try {
    // Get profile statistics
    const profileResponse = await fetch('https://api.linkedin.com/v2/people/~:(id,firstName,lastName,profilePicture)', {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      }
    });

    if (!profileResponse.ok) {
      throw new Error('Failed to fetch LinkedIn profile');
    }

    const profileData = await profileResponse.json();

    // Get organization follower statistics (if user has access)
    try {
      const followersResponse = await fetch('https://api.linkedin.com/v2/organizationalEntityFollowerStatistics', {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      });

      let followerStats = null;
      if (followersResponse.ok) {
        followerStats = await followersResponse.json();
      }

      return {
        profile: profileData,
        followers: followerStats,
        platform: 'linkedin'
      };
    } catch (error) {
      console.warn('Organization follower stats not available:', error);
      return {
        profile: profileData,
        followers: null,
        platform: 'linkedin'
      };
    }
  } catch (error) {
    console.error('Error fetching LinkedIn analytics:', error);
    throw error;
  }
};

// Test function with provided LinkedIn access token
export const testLinkedInWithToken = async () => {
  const testToken = 'AQVhOkZ1DDqiwhK_f0FE0H5IW93zlcYT9BsDT1_YCpjNH0KQ7MZyHIUsqWtmALSKslN4DCH2-COHUMcmdtXk4xbENdjDc7HZ4aogaMA8ZHVJtfylpVBWNF2cr4aURENfiUm63PK6X5j4JUWHQeTQnwepm2kLWUAEMO3i35BiPsnAd77mhNkdnVmr1lqQPMkB5W3hLgbqAKd8yN3CaEr5_EZxWCK0_z0611py53YFjDTdxj9Tkrepxv0G07SDdRUNurHrIHKc4vTStP8pemVkXQA2MhRcXWtLeX5cgiqRWtw_gI83C_aO36zvIjTeQHWYNywIKqpfzIjs4T6_88KHMvXqvom9zA';


  const endpoints = [
    '📊 Profile: https://api.linkedin.com/v2/people/~:(id,firstName,lastName,profilePicture)',
    '📈 Network Info: https://api.linkedin.com/v2/people/~:(id,firstName,lastName,networkInfo)',
    '📝 Shares: https://api.linkedin.com/v2/shares?q=owners&owners=urn:li:person:{id}',
    '💼 Companies: https://api.linkedin.com/v2/organizationAcls',
    '📧 Email: https://api.linkedin.com/v2/emailAddress?q=members&projection=(elements*(handle~))'
  ];

  endpoints.forEach(endpoint => console.log(endpoint));

  // Return mock profile data that represents what we'd get from LinkedIn
  return {
    id: 'linkedin_user_123',
    firstName: { localized: { en_US: 'LinkedIn' }, preferredLocale: { country: 'US', language: 'en' } },
    lastName: { localized: { en_US: 'User' }, preferredLocale: { country: 'US', language: 'en' } },
    profilePicture: {
      displayImage: 'urn:li:digitalmediaAsset:sample'
    },
    headline: { localized: { en_US: 'Professional using LinkedIn API' } },
    summary: 'This is sample data representing what your LinkedIn API token could access'
  };
};

// Facebook/Instagram Analytics API
export const getFacebookAnalytics = async (accessToken) => {
  try {
    const response = await fetch(`https://graph.facebook.com/v18.0/me/insights?metric=page_fans,page_impressions,page_engaged_users&access_token=${accessToken}`);

    if (!response.ok) {
      throw new Error('Failed to fetch Facebook analytics');
    }

    const data = await response.json();
    return {
      insights: data.data,
      platform: 'facebook'
    };
  } catch (error) {
    console.error('Error fetching Facebook analytics:', error);
    throw error;
  }
};

// Twitter/X Analytics API
export const getTwitterAnalytics = async (accessToken) => {
  try {
    const response = await fetch('https://api.twitter.com/2/users/me?user.fields=public_metrics', {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error('Failed to fetch Twitter analytics');
    }

    const data = await response.json();
    return {
      metrics: data.data.public_metrics,
      platform: 'twitter'
    };
  } catch (error) {
    console.error('Error fetching Twitter analytics:', error);
    throw error;
  }
};

// Unified analytics fetcher
export const fetchAnalyticsData = async (platform, accessToken) => {
  if (!accessToken) {
    throw new Error('Access token required for analytics data');
  }

  switch (platform.toLowerCase()) {
    case 'linkedin':
      return await getLinkedInAnalytics(accessToken);
    case 'facebook':
    case 'instagram':
      return await getFacebookAnalytics(accessToken);
    case 'twitter':
    case 'x':
      return await getTwitterAnalytics(accessToken);
    default:
      throw new Error(`Analytics not supported for platform: ${platform}`);
  }
};

// Mock analytics data for development/demo purposes
export const getMockAnalyticsData = () => {
  return {
    followerLocations: [
      { name: 'United States', value: 35, color: '#0088FE' },
      { name: 'Canada', value: 15, color: '#00C49F' },
      { name: 'United Kingdom', value: 12, color: '#FFBB28' },
      { name: 'Germany', value: 10, color: '#FF8042' },
      { name: 'Australia', value: 8, color: '#8884d8' },
      { name: 'Others', value: 20, color: '#82ca9d' }
    ],
    weeklyFollowers: [
      { day: 'Mon', followers: 120 },
      { day: 'Tue', followers: 135 },
      { day: 'Wed', followers: 149 },
      { day: 'Thu', followers: 158 },
      { day: 'Fri', followers: 175 },
      { day: 'Sat', followers: 192 },
      { day: 'Sun', followers: 210 }
    ],
    genderDistribution: [
      { name: 'Male', value: 58, color: '#0088FE' },
      { name: 'Female', value: 42, color: '#00C49F' }
    ],
    ageDistribution: [
      { age: '18-24', count: 85 },
      { age: '25-34', count: 165 },
      { age: '35-44', count: 125 },
      { age: '45-54', count: 75 },
      { age: '55+', count: 45 }
    ],
    totalFollowers: 12450,
    totalEngagement: 8925,
    totalReach: 45678,
    lastUpdated: new Date().toISOString()
  };
};
