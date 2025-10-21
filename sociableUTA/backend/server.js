require('dotenv').config();

const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const axios = require('axios');
// const { TwitterApi } = require('twitter-api-v2');
const multer = require('multer');

const app = express();
const PORT = 5000;

// multer setup
const storage = multer.memoryStorage(); // storing file in memory buffer
const upload = multer({ storage: storage });


// middleware
const corsOptions = {
    origin: [
        'http://localhost:3000',
        'http://localhost:5173',
        'http://127.0.0.1:5173',
        'https://sociableuta.vercel.app'
    ],
    credentials: true
};
app.use(cors(corsOptions));
app.use(express.json());

// DB connection
const DB_URL = process.env.DATABASE_URL;
mongoose.connect(DB_URL)
    .then(() => console.log('MongoDB connected successfully.'))
    .catch(err => console.error(err));


// ROUTES

// test route
app.get('/', (req, res) => {
    res.send('Backend server is running!');
});

// register route using mongodb
app.post('/register', async (req, res) => {
    const { user, pwd } = req.body;
    try {
        const existingUser = await User.findOne({ username: user });
        if (existingUser) {
            return res.status(409).json({ message: 'Username already exists' });
        }

        const hashedPassword = await bcrypt.hash(pwd, 12);
        const newUser = new User({ username: user, password: hashedPassword });
        await newUser.save();

        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        console.error('Error during registration:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// login route using mongodb
app.post('/login', async (req, res) => {
    const { user, pwd } = req.body;
    try {
        const userAccount = await User.findOne({ username: user });
        if (!userAccount) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const isMatch = await bcrypt.compare(pwd, userAccount.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // We will implement a real token next
        res.json({ accessToken: 'real-token-coming-soon' });
    } catch (error) {
        console.error('Error during login:', error);
    }
});

// API ROUTES

// Short-lived token to a long-lived token following longaccesstoken.py logic
app.post('/api/facebook/exchange-token', async (req, res) => {
    try {
        const { short_lived_token } = req.body;

        if (!short_lived_token) {
            return res.status(400).json({ message: 'Short-lived token is required' });
        }

        const url = `https://graph.facebook.com/v17.0/oauth/access_token?grant_type=fb_exchange_token&client_id=${process.env.FACEBOOK_APP_ID}&client_secret=${process.env.FACEBOOK_APP_SECRET}&fb_exchange_token=${short_lived_token}`;

        const response = await axios.get(url);
        res.json(response.data);

    } catch (error) {
        // Log the raw error first
        console.error('Raw error object received:', error);
        // Try logging Axios-specific details if they exist
        if (error.response) {
            console.error('Axios error response data:', JSON.stringify(error.response.data, null, 2));
            console.error('Axios error response status:', error.response.status);
        } else {
            // Log the general error message if not an Axios response error
            console.error('General error message:', error.message);
        }
        // console.error('Error exchanging token:', error.response ? error.response.data : error.message);
        res.status(500).json({ message: 'Failed to exchange token' });
    }
});


// Getting facebook page info following FacebookAPI.py logic
app.get('/api/facebook/page-info', async (req, res) => {
    try {
        const page_access_token = process.env.FACEBOOK_PAGE_ACCESS_TOKEN;
        const facebook_user_id = process.env.FACEBOOK_USER_ID;
        const fields = "id,name,about,fan_count,followers_count,link,category,website,location,phone";

        const url = `https://graph.facebook.com/v19.0/${facebook_user_id}?fields=${fields}&access_token=${page_access_token}`;

        const response = await axios.get(url);
        res.json(response.data);

    } catch (error) {
        console.error('Error fetching Facebook page info:', error.reponse ? error.response.data : error.message);
        res.status(500).json({ message: 'Failed to fetch Facebook page info' });

    }
});

//facebook page feed posts
app.get('/api/facebook/feed', async (req, res) => {
    try {
        const page_access_token = process.env.FACEBOOK_PAGE_ACCESS_TOKEN;
        const facebook_user_id = process.env.FACEBOOK_USER_ID;

        const fields = "id,message,created_time,permalink_url,attachments{media}";

        const url = `https://graph.facebook.com/v19.0/${facebook_user_id}/feed?fields=${fields}&access_token=${page_access_token}`;

        const response = await axios.get(url);
        res.json(response.data.data || []); // making sure data exists

    } catch (error) {
        console.error('Error fetching Facebook feed:', error.response ? JSON.stringify(error.response.data, null, 2) : error.message);
        res.status(error.response?.status || 500).json({
            message: 'Failed to fetch Facebook feed.',
            error: error.response?.data?.error || { message: error.message }
        });
    }
});

// POST route to publish to Facebook Page Feed
app.post('/api/facebook/feed', async (req, res) => {
    const { message } = req.body; // Get the message text from the request body
    const page_access_token = process.env.FACEBOOK_PAGE_ACCESS_TOKEN;
    const facebook_page_id = process.env.FACEBOOK_USER_ID;

    if (!message) return res.status(400).json({ message: 'Post message content is required.' });
    if (!page_access_token || !facebook_page_id) return res.status(500).json({ message: 'Server configuration error: Missing Facebook credentials.' });

    const url = `https://graph.facebook.com/v19.0/${facebook_page_id}/feed`;

    try {
        const response = await axios.post(url, {message: message, access_token: page_access_token });
        res.status(201).json({ success: true, postId: response.data.id });
    } catch (error) {
        console.error('Error posting to Facebook feed:', error.response ? JSON.stringify(error.response.data, null, 2) : error.message);
        res.status(error.response?.status || 500).json({ message: 'Failed to post to Facebook feed.', error: error.response?.data?.error || { message: error.message }});
    }
});

// POST photo to feed
app.post('/api/facebook/photos', upload.single('media'), async (req, res) => {
    const { caption } = req.body;
    const mediaFile = req.file;
    
    //debugging
    console.log('Received file info in /api/facebook/photos:', mediaFile);

    const page_access_token = process.env.FACEBOOK_PAGE_ACCESS_TOKEN;
    const facebook_page_id = process.env.FACEBOOK_USER_ID;

    if (!mediaFile) {
        return res.status(400).json({ message: 'Media file is required.' });
    }
    if (!page_access_token || !facebook_page_id) {
        return res.status(500).json({ message: 'Server configuration error.' });
    }

    const url = `https://graph.facebook.com/v19.0/${facebook_page_id}/photos`;
    const formData = new FormData();
    formData.append('access_token', page_access_token);
    if (caption) {
        formData.append('caption', caption);
    }
    // IMPORTANT: Use the buffer from multer and provide a filename
    formData.append('source', mediaFile.buffer, mediaFile.originalname);

    try {
        console.log(`Attempting to post photo to Facebook Page ${facebook_page_id} with caption: "${caption || ''}"`);
        const response = await axios.post(url, formData, {
            headers: formData.getHeaders ? formData.getHeaders() : { 'Content-Type': 'multipart/form-data' } // Set correct headers
        });

        console.log('Facebook photo post successful:', response.data);
        res.status(201).json({ success: true, postId: response.data.id, post_id: response.data.post_id }); // Includes photo ID and post ID

    } catch (error) {
        console.error('Error posting photo to Facebook:', error.response ? JSON.stringify(error.response.data, null, 2) : error.message);
         res.status(error.response?.status || 500).json({
            message: 'Failed to post photo to Facebook.',
            error: error.response?.data?.error || { message: error.message }
        });
    }
});

// Fetching media from Instagram following Instagramapi2.py logic
app.get('/api/instagram/media', async (req, res) => {
    try {
        const access_token = process.env.INSTAGRAM_PAGE_ACCESS_TOKEN;
        const ig_user_id = process.env.INSTAGRAM_USER_ID;
        if (!access_token || !ig_user_id) return res.status(500).json({ message: 'Server config error.' });
        
        let all_media = [];
        let url = `https://graph.facebook.com/v19.0/${ig_user_id}/media?fields=id,media_type,media_url,caption,timestamp,permalink&access_token=${access_token}`;

        // pagination handling
        let counter = 0;
        const maxPages = 5;


        while (url && counter < maxPages) {
            const response = await axios.get(url);
            const data = response.data;
            if (data.data) {
                all_media = all_media.concat(data.data);
            }
            url = data.paging && data.paging.next ? data.paging.next : null;
            counter++;
        }
        res.json(all_media);

    } catch (error) {
        console.error('Error fetching Instagram media:', error.response ? JSON.stringify(error.response.data, null, 2) : error.message);
        res.status(error.response?.status || 500).json({ message: 'Failed to fetch Instagram media.', error: error.response?.data?.error || { message: error.message } });
    }
});

// Getting insights from an Instagram post using postinsight.py logic
// might be facebook instead of IG?
app.get('/api/instagram/post-insights/:mediaId', async (req, res) => {
    try {
        const { mediaID } = req.params;
        const access_token = process.env.INSTAGRAM_PAGE_ACCESS_TOKEN;
        const metrics = "reach,saved,likes,comments";

        const url = `https://graph.facebook.com/v19.0/${mediaId}/insights?metric=${metrics}&access_token=${access_token}`;

        const response = await axios.get(url);
        res.json(response.data);
    } catch (error) {
        console.error('Error fetching post insights:', error.response ? error.response.data : error.message);
        res.status(500).json({ message: 'Failed to fetch post insights' });
    }
});

// Getting insights for a specific IG reel using reels.py logic
app.get('/api/instagram/reel-insights/:mediaId', async (req, res) => {
    try {
        const { mediaId } = req.params;
        const access_token = process.env.INSTAGRAM_PAGE_ACCESS_TOKEN;
        const metrics = 'reach,likes,comments,shares,saved,total_interactions,ig_reels_video_view_total_time,ig_reels_avg_watch_time';

        const url = `https://graph.facebook.com/v19.0/${mediaId}/insights?metric=${metrics}&access_token=${access_token}`;

        const response = await axios.get(url);
        res.json(response.data);
    } catch (error) {
        console.error('Error fetching reel insights:', error.response ? error.response.data : error.message);
        res.status(500).json({ message: 'Failed to fetch reel insights' });
    }
});

// Getting insights for a specific IG story using stories.py logic
app.get('/api/instagram/story-insights/:mediaId', async (req, res) => {
    try {
        const { storyId } = req.params;
        const access_token = process.env.INSTAGRAM_PAGE_ACCESS_TOKEN;
        const metrics = 'impressions,reach,exits,replies,taps_forward,taps_back';

        const url = `https://graph.facebook.com/v19.0/${storyId}/insights?metric=${metrics}&access_token=${access_token}`;

        const response = await axios.get(url);
        res.json(response.data);
    } catch (error) {
        console.error('Error fetching story insights:', error.response ? error.response.data : error.message);
        res.status(500).json({ message: 'Failed to fetch story insights' });
    }
});

// Getting follow demographic info using followerlocation.py logic
app.get('/api/instagram/follower-demographics', async (req, res) => {
    try {
        const access_token = process.env.INSTAGRAM_PAGE_ACCESS_TOKEN;
        const ig_user_id = process.env.INSTAGRAM_USER_ID;

        const url = `https://graph.facebook.com/v19.0/${ig_user_id}/insights?metric=follower_demographics&metric_type=total_value&breakdown=country&period=lifetime&access_token=${access_token}`;

        const response = await axios.get(url);
        res.json(response.data);
    } catch (error) {
        console.error('Error fetching follower demographics:', error.response ? error.response.data : error.message);
        res.status(500).json({ message: 'Failed to fetch follower demographics' });
    }
});

// LinkedIn API routes

// // Redirecting user to LinkedIn's authentication page using redirectURL logic
// app.get('/api/linkedin/login', (req, res) => {
//     const scope = 'r_organization_admin r_organization_social w_organization_social rw_organization_admin';
//     const authUrl = `https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=${process.env.LINKEDIN_CLIENT_ID}&redirect_uri=${process.env.LINKEDIN_REDIRECT_URI}&state=DCEeFWf45A53sdfKef424&scope=${encodeURIComponent(scope)}`;
//     res.redirect(authUrl);
// });

// // Callback URL that LinkedIn redirects to after authentication, exchanging code for long-live access token
// app.get('/api/linkedin/callback', async (req, res) => {
//     const { code, state, error, error_description } = req.query;

//     if (error) {
//         return res.status(400).json({ message: `Error: ${error_description}` });
//     }

//     try {
//         // exchanging authorization code for an access token
//         const tokenUrl = 'https://www.linkedin.com/oauth/v2/accessToken';
//         const tokenParams = new URLSearchParams();
//         tokenParams.append('grant_type', 'authorization_code');
//         tokenParams.append('code', code);
//         tokenParams.append('redirect_uri', process.env.LINKEDIN_REDIRECT_URI);
//         tokenParams.append('client_id', process.env.LINKEDIN_CLIENT_ID);
//         tokenParams.append('client_secret', process.env.LINKEDIN_CLIENT_SECRET);

//         const tokenResponse = await axios.post(tokenUrl, tokenParams, {
//             headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
//         });

//         const accessToken = tokenResponse.data.access_token;

//         res.redirect(`http://localhost:5173/home?linkedin_token=${accessToken}`);
//     } catch (err) {
//         console.error('Error exchanging LinkedIn code :', err.response ? err.response.data : err.message);
//         res.status(500).json({ message: 'Failed to authenticate with LinkedIn.' });
//     }
// });

// // Getting data for authenticated user's organization
// app.get('/api/linkedin/organization-data', async (req, res) => {
//     const accessToken = req.headers.authorization?.split(' ')[1];

//     if (!accessToken) {
//         return res.status(401).json({ message: 'Missing Access Token' });
//     }

//     try {
//         const headers = { 'Authorization': `Bearer ${accessToken}` };
//         const orgAclsUrl = "https://api.linkedin.com/v2/organizationalEntityAcls?q=roleAssignee&role=ADMINISTRATOR&projection=(elements*(*,organizationalTarget~(localizedName)))";

//         const orgRes = await axios.get(orgAclsUrl, { headers });
//         const elements = orgRes.data.elements;

//         if (!elements || elements.length === 0) {
//             return res.status(404).json({ message: "No organization found where the user is an admin." });
//         }

//         const orgUrn = elements[0].organizationalTarget;
//         const orgName = elements[0]['organizationalTarget~'].localizedName;

//         // Fetch organization posts
//         const postsUrl = `https://api.linkedin.com/v2/shares?q=owners&owners=${orgUrn}&sortBy=LAST_MODIFIED&sharesPerOwner=10`;
//         const postsRes = await axios.get(postsUrl, { headers });

//         // Fetch follower stats
//         const statsUrl = `https://api.linkedin.com/v2/organizationFollowerStatistics?q=organizationalEntity&organizationalEntity=${orgUrn}`;
//         const statsRes = await axios.get(statsUrl, { headers });

//         res.json({
//             organization: {
//                 name: orgName,
//                 urn: orgUrn,
//                 posts: postsRes.data,
//                 follower_stats: statsRes.data
//             }
//         });
//     } catch (error) {
//         console.error('Error fetching LinkedIn organization data:', error.response ? error.response.data : error.message);
//         res.status(500).json({ message: 'Failed to fetch LinkedIn organization data' });
//     }
// });

// X API Routes
// initializing X client
// const twitterClient = new TwitterApi({
//     appKey: process.env.X_API_KEY,
//     appSecret: process.env.X_API_SECRET,
//     accessToken: process.env.X_ACCESS_TOKEN,
//     accessSecret: process.env.X_ACCESS_TOKEN_SECRET,
// });

// // getting user info following info.py logic
// app.get('/api/x/user-data', async (req, res) => {
//     try {
//         // profile info
//         const user = await readOnlyClient.v2.me({ 'user.fields': ['public_metrics', 'profile_image_url', 'created_at', 'description'] });

//         // fetching recent tweets
//         const tweets = await readOnlyClient.v2.userTimeline(user.data.id, {
//             'tweet.fields': ['public_metrics', 'created_at'],
//             max_results: 10
//         });

//         res.json({
//             profile: user.data,
//             tweets: tweets.data.data || []
//         });
//     } catch (error) {
//         console.error('Error fetching X data:', error);
//         res.status(500).json({ message: 'Failed to fetch X data' });
//     }
// });

// starting server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
