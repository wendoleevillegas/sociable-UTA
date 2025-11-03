import React, { useState, useEffect } from 'react';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import './Analytics.css';
import axios from 'axios';
import aiosInstance from './api/axios';

// MOCK DATA FOR DEMO & FUNCTIONALITY PURPOSES
const MOCK_GRAPH_DATA = [
  { name: 'Oct 14', followers: 1200 },
  { name: 'Oct 15', followers: 1210 },
  { name: 'Oct 16', followers: 1205 },
  { name: 'Oct 17', followers: 1220 },
  { name: 'Oct 18', followers: 1230 },
  { name: 'Oct 19', followers: 1250 },
  { name: 'Oct 20', followers: 1270 },
];

const MOCK_TOP_POSTS = [
  { id: 1, text: 'Our new AI research paper just dropped! 🤖...', impressions: '10.2K' },
  { id: 2, text: 'Welcome to the new students joining our... 👋', impressions: '8.1K' },
  { id: 3, text: 'Throwback to our 2023 graduation... 🎓', impressions: '7.5K' },
];

const MOCK_KEY_METRICS = {
  impressions: 22450,
  reach: 18230,
  engagementRate: '3.5%',
  profileVisits: 1420,
  newFollowers: 70,
};

// END OF MOCK DATA

const fetchInstagramAnalytics = async () => {
  try {
    const response = await axiosInstance.get('/api/instagram/follower-demographics');
    const locationData = response.data.data[0]?.values[0]?.value || {};
    // This is a workaround. The API provides followers by country,
    // so we sum them. A better API would provide a simple total.
    const totalFollowers = Object.values(locationData).reduce((sum, count) => sum + count, 0);
    return {
      totalFollowers: totalFollowers,
      ...MOCK_KEY_METRICS, // Use mock data for metrics not in API
    };
  } catch (err) {
    console.error('Failed to load Instagram analytics:', err);
    throw new Error('Failed to load Instagram analytics.');
  }
};

const fetchFacebookAnalytics = async () => {
  try {
    // This endpoint correctly provides fan_count (total followers)
    const response = await axiosInstance.get('/api/facebook/page-info');
    return {
      totalFollowers: response.data.fan_count || 0,
      ...MOCK_KEY_METRICS, // Use mock data
    };
  } catch (err) {
    console.error('Failed to load Facebook analytics:', err);
    throw new Error('Failed to load Facebook analytics.');
  }
};

const fetchLinkedInAnalytics = async () => {
  const linkedInToken = localStorage.getItem('linkedin_access_token');
  if (!linkedInToken) {
    throw new Error('LinkedIn not connected.');
  }
  try {
    const response = await axios.get('http://localhost:5000/api/linkedin/organization-data', {
      headers: { 'Authorization': `Bearer ${linkedInToken}` }
    });
    const stats = response.data.organization.follower_stats?.elements[0]?.followerCountsByAssociationType[0]?.followerCounts || {};
    return {
      totalFollowers: (stats.organicFollowerCount || 0) + (stats.paidFollowerCount || 0),
      ...MOCK_KEY_METRICS, // Use mock data
    };
  } catch (err) {
    console.error('Failed to load LinkedIn analytics:', err);
    throw new Error('Failed to load LinkedIn analytics. Token may be expired.');
  }
};

const fetchXAnalytics = async () => {
  try {
    const response = await axios.get('http://localhost:5000/api/x/user-data');
    return {
      totalFollowers: response.data.profile?.public_metrics?.followers_count || 0,
      ...MOCK_KEY_METRICS, // Use mock data
    };
  } catch (err) {
    console.error('Failed to load X analytics:', err);
    throw new Error('Failed to load X analytics.');
  }
};
// --- End Data Fetching Helpers ---


export const Analytics = ({ token, apiSource = 'all', onNavigate }) => {
  const [data, setData] = useState({
    keyMetrics: { impressions: 0, reach: 0, engagementRate: '0%', profileVisits: 0 },
    audience: { totalFollowers: 0, newFollowers: 0, graphData: [] },
    topPosts: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isLinkedInAuthenticated, setIsLinkedInAuthenticated] = useState(!!localStorage.getItem('linkedin_access_token'));

  useEffect(() => {
    const loadAnalyticsData = async () => {
      setLoading(true);
      setError(null);
      setData({ // Reset data
        keyMetrics: { impressions: 0, reach: 0, engagementRate: '0%', profileVisits: 0 },
        audience: { totalFollowers: 0, newFollowers: 0, graphData: [] },
        topPosts: []
      });

      try {
        let metrics = { impressions: 0, reach: 0, profileVisits: 0, newFollowers: 0, totalFollowers: 0 };
        let engagementRates = [];

        if (apiSource === 'all' || apiSource === 'instagram') {
          try {
            const igData = await fetchInstagramAnalytics();
            metrics.impressions += igData.impressions;
            metrics.reach += igData.reach;
            metrics.profileVisits += igData.profileVisits;
            metrics.newFollowers += igData.newFollowers;
            metrics.totalFollowers += igData.totalFollowers;
            engagementRates.push(parseFloat(igData.engagementRate));
          } catch (e) { setError(e.message); }
        }
        if (apiSource === 'all' || apiSource === 'facebook') {
          try {
            const fbData = await fetchFacebookAnalytics();
            metrics.impressions += fbData.impressions;
            metrics.reach += fbData.reach;
            metrics.profileVisits += fbData.profileVisits;
            metrics.newFollowers += fbData.newFollowers;
            metrics.totalFollowers += fbData.totalFollowers;
            engagementRates.push(parseFloat(fbData.engagementRate));
          } catch (e) { setError(e.message); }
        }
        if (apiSource === 'all' || apiSource === 'linkedin') {
          if (!localStorage.getItem('linkedin_access_token')) {
            setIsLinkedInAuthenticated(false);
            if(apiSource === 'linkedin') setError('Connect LinkedIn to see analytics.');
          } else {
            setIsLinkedInAuthenticated(true);
            try {
              const liData = await fetchLinkedInAnalytics();
              metrics.impressions += liData.impressions;
              metrics.reach += liData.reach;
              metrics.profileVisits += liData.profileVisits;
              metrics.newFollowers += liData.newFollowers;
              metrics.totalFollowers += liData.totalFollowers;
              engagementRates.push(parseFloat(liData.engagementRate));
            } catch (e) { 
              setError(e.message); 
              if (apiSource === 'linkedin') setIsLinkedInAuthenticated(false);
            }
          }
        }
        if (apiSource === 'all' || apiSource === 'x') {
          try {
            const xData = await fetchXAnalytics();
            metrics.impressions += xData.impressions;
            metrics.reach += xData.reach;
            metrics.profileVisits += xData.profileVisits;
            metrics.newFollowers += xData.newFollowers;
            metrics.totalFollowers += xData.totalFollowers;
            engagementRates.push(parseFloat(xData.engagementRate));
          } catch (e) { setError(e.message); }
        }

        // Calculate average engagement rate
        const avgEngagement = engagementRates.length > 0 
          ? (engagementRates.reduce((a, b) => a + b, 0) / engagementRates.length).toFixed(1) + '%' 
          : '0%';

        setData({
          keyMetrics: {
            impressions: metrics.impressions,
            reach: metrics.reach,
            engagementRate: avgEngagement,
            profileVisits: metrics.profileVisits,
          },
          audience: {
            totalFollowers: metrics.totalFollowers,
            newFollowers: metrics.newFollowers,
            graphData: MOCK_GRAPH_DATA, // Use mock graph
          },
          topPosts: MOCK_TOP_POSTS, // Use mock posts
        });

      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadAnalyticsData();
  }, [apiSource]);

  const handleLinkedInConnect = () => {
    window.location.href = 'http://localhost:5000/api/linkedin/login';
  };

  // Helper to format large numbers (e.g., 22450 -> 22.5K)
  const formatNumber = (num) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toLocaleString();
  };

  const renderContent = () => {
    if (loading) {
      return <div className="analytics-message">Loading Analytics...</div>;
    }

    if (error && apiSource !== 'all') {
      if (apiSource === 'linkedin' && !isLinkedInAuthenticated) {
        return (
          <div className="analytics-card linkedin-auth">
            <h3>LinkedIn Authentication Required</h3>
            <p>Please connect your LinkedIn account to view organization analytics.</p>
            <button onClick={handleLinkedInConnect} className="linkedin-connect-btn">
              Connect to LinkedIn
            </button>
          </div>
        );
      }
      return <div className="analytics-message error">{error}</div>;
    }
    
    // If 'all' is selected and there's an error, still show the data from other platforms
    if (data.audience.totalFollowers === 0 && apiSource !== 'all' && !error) {
        return <div className="analytics-message">No analytics data available for {apiSource}.</div>
    }

    return (
      <div className="analytics-grid">
        {/* --- Key Metrics Card --- */}
        <div className="analytics-card key-metrics">
          <h3>Key metrics</h3>
          <div className="metrics-grid">
            <div className="metric-item">
              <span className="metric-label">Total impressions</span>
              <span className="metric-value">{formatNumber(data.keyMetrics.impressions)}</span>
            </div>
            <div className="metric-item">
              <span className="metric-label">Total reach</span>
              <span className="metric-value">{formatNumber(data.keyMetrics.reach)}</span>
            </div>
            <div className="metric-item">
              <span className="metric-label">Engagement rate</span>
              <span className="metric-value">{data.keyMetrics.engagementRate}</span>
            </div>
            <div className="metric-item">
              <span className="metric-label">Profile visits</span>
              <span className="metric-value">{formatNumber(data.keyMetrics.profileVisits)}</span>
            </div>
          </div>
        </div>

        {/* --- Audience Card --- */}
        <div className="analytics-card audience">
          <h3>Audience</h3>
          <div className="audience-summary">
            <div className="metric-item">
              <span className="metric-label">Total followers</span>
              <span className="metric-value">{formatNumber(data.audience.totalFollowers)}</span>
            </div>
            <div className="metric-item">
              <span className="metric-label">New followers</span>
              <span className="metric-value">+{formatNumber(data.audience.newFollowers)}</span>
            </div>
          </div>
          <div className="audience-graph">
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={data.audience.graphData} margin={{ top: 5, right: 20, left: -20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
                <XAxis dataKey="name" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip />
                <Line type="monotone" dataKey="followers" stroke="#1877F2" strokeWidth={3} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* --- Top Posts Card --- */}
        <div className="analytics-card top-posts">
          <h3>Top posts</h3>
          <ul className="top-posts-list">
            {data.topPosts.map(post => (
              <li key={post.id} className="post-item">
                <span className="post-text">{post.text}</span>
                <span className="post-impressions">{post.impressions}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    );
  };

  return (
    <div className="analytics-container">
      <div className="analytics-content">
        {/* We remove the 'Graph/Table' toggle to match the new design */}
        {renderContent()}
      </div>
    </div>
  );
};

// export const Analytics = ({ token, apiSource = 'instagram', onNavigate }) => {
//   const [viewType, setViewType] = useState('graph');
//   const [analyticsData, setAnalyticsData] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [isLinkedInAuthenticated, setIsLinkedInAuthenticated] = useState(!!localStorage.getItem('linkedin_access_token'));

//   useEffect(() => {
//     const loadAnalyticsData = async () => {
//       setLoading(true);
//       setError(null);
//       setAnalyticsData(null);

//       if (apiSource === 'instagram') {
//         try {
//           const response = await axios.get('http://localhost:5000/api/instagram/follower-demographics');
//           const locationData = response.data.data[0]?.values[0]?.value || {};
//           const formattedLocations = Object.keys(locationData).map(countryCode => ({ name: countryCode, value: locationData[countryCode] }));
//           setAnalyticsData({
//             followerLocations: formattedLocations,
//             totalFollowers: formattedLocations.reduce((sum, item) => sum + item.value, 0),
//             weeklyFollowers: [], genderDistribution: [], ageDistribution: [], totalEngagement: 0, totalReach: 0,
//             lastUpdated: new Date().toISOString(),
//           });
//         } catch (err) {
//           setError(err.message);
//         }
//       } else if (apiSource === 'linkedin') {
//         const linkedInToken = localStorage.getItem('linkedin_access_token');
//         if (linkedInToken) {
//           setIsLinkedInAuthenticated(true);
//           try {
//             const response = await axios.get('http://localhost:5000/api/linkedin/organization-data', {
//               headers: { 'Authorization': `Bearer ${linkedInToken}` }
//             });
//             const stats = response.data.organization.follower_stats.elements[0]?.followerCountsByAssociationType[0]?.followerCounts || {};
//             setAnalyticsData({
//               totalFollowers: (stats.organicFollowerCount || 0) + (stats.paidFollowerCount || 0),
//               followerLocations: [], weeklyFollowers: [], genderDistribution: [], ageDistribution: [],
//               totalEngagement: 0, totalReach: 0,
//               lastUpdated: new Date().toISOString(),
//             });
//           } catch (err) {
//             setError('Failed to fetch LinkedIn analytics. Your token may have expired. Please reconnect.');
//             setIsLinkedInAuthenticated(false);
//             localStorage.removeItem('linkedin_access_token');
//           }
//         } else {
//           setIsLinkedInAuthenticated(false);
//         }
//       } else if (apiSource === 'x') {
//         try {
//           const response = await axios.get('http://localhost:5000/api/x/user-data');
//           const metrics = response.data.profile.public_metrics;
//           setAnalyticsData({
//             totalFollowers: metrics.followers_count || 0,
//             totalEngagement: metrics.like_count || 0,
//             totalReach: metrics.tweet_count || 0,
//             followerLocations: [], weeklyFollowers: [], genderDistribution: [], ageDistribution: [],
//             lastUpdated: new Date().toISOString(),
//           });
//         } catch (err) {
//           setError('Failed to fetch X analytics. Check your backend and API keys.');
//         }
//       } else {
//         setAnalyticsData({
//           followerLocations: [], weeklyFollowers: [], genderDistribution: [],
//           ageDistribution: [], totalFollowers: 0, totalEngagement: 0, totalReach: 0,
//         });
//       }
//       setLoading(false);
//     };

//     loadAnalyticsData();
//   }, [apiSource]);

//   const handleLinkedInConnect = () => {
//     window.location.href = 'http://localhost:5000/api/linkedin/login';
//   };

//   const {
//     followerLocations = [], weeklyFollowers = [], genderDistribution = [],
//     ageDistribution = [], totalFollowers = 0, totalEngagement = 0, totalReach = 0, lastUpdated
//   } = analyticsData || {};

//   const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

//   return (
//     <div className="analytics-container">
//       <div className="analytics-content">
//         <div className="analytics-view-toggle">
//           <button className={viewType === 'graph' ? 'active' : ''} onClick={() => setViewType('graph')}>Graph</button>
//           <button className={viewType === 'table' ? 'active' : ''} onClick={() => setViewType('table')}>Table</button>
//         </div>

//         {loading && <p style={{ textAlign: 'center' }}>Loading Analytics...</p>}
//         {error && <p style={{ textAlign: 'center', color: 'red' }}>{error}</p>}

//         {apiSource === 'linkedin' && !isLinkedInAuthenticated && !loading && (
//           <div className="analytics-card large" style={{ textAlign: 'center', padding: '50px' }}>
//             <h3>LinkedIn Authentication Required</h3>
//             <p>Please connect your LinkedIn account to view organization analytics.</p>
//             <button onClick={handleLinkedInConnect} style={{ padding: '10px 20px', marginTop: '10px' }}>
//               Connect to LinkedIn
//             </button>
//           </div>
//         )}

//         {!loading && !error && (viewType === 'graph' ? (
//           <div className="analytics-dashboard">
//             <div className="analytics-row">
//               <div className="analytics-card large">
//                 <h3>Follower Location Distribution</h3>
//                 {followerLocations.length > 0 ? (
//                   <ResponsiveContainer width="100%" height={300}>
//                     <BarChart data={followerLocations}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="name" /><YAxis /><Tooltip /><Bar dataKey="value" fill="#4285F4" /></BarChart>
//                   </ResponsiveContainer>
//                 ) : <p>No location data available for {apiSource}.</p>}
//               </div>
//               <div className="analytics-card large">
//                 <h3>This Week's Follower Count</h3>
//                 {weeklyFollowers.length > 0 ? (
//                   <ResponsiveContainer width="100%" height={300}>
//                     <LineChart data={weeklyFollowers}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="day" /><YAxis /><Tooltip /><Line type="monotone" dataKey="followers" stroke="#4285F4" strokeWidth={3} /></LineChart>
//                   </ResponsiveContainer>
//                 ) : <p>No weekly follower data available for {apiSource}.</p>}
//               </div>
//             </div>
//             <div className="analytics-row">
//               <div className="analytics-card medium">
//                 <h3>Follower Gender Distribution</h3>
//                 {genderDistribution.length > 0 ? (
//                   <ResponsiveContainer width="100%" height={300}>
//                     <PieChart><Pie data={genderDistribution} cx="50%" cy="50%" outerRadius={100} fill="#8884d8" dataKey="value" label={({ name, value }) => `${name}\n${value}%`}>{genderDistribution.map((entry, index) => (<Cell key={`cell-${index}`} fill={entry.color || COLORS[index % COLORS.length]} />))}</Pie><Tooltip /></PieChart>
//                   </ResponsiveContainer>
//                 ) : <p>No gender data available for {apiSource}.</p>}
//               </div>
//               <div className="analytics-card large">
//                 <h3>Follower Age Distribution</h3>
//                 {ageDistribution.length > 0 ? (
//                   <ResponsiveContainer width="100%" height={300}>
//                     <BarChart data={ageDistribution}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="age" /><YAxis /><Tooltip /><Bar dataKey="count" fill="#4285F4" name="Followers" /></BarChart>
//                   </ResponsiveContainer>
//                 ) : <p>No age distribution data available for {apiSource}.</p>}
//               </div>
//             </div>
//           </div>
//         ) : (
//           <div className="analytics-table-view">
//             <div className="analytics-card">
//               <h3>Analytics Data Table</h3>
//               {lastUpdated && (<p style={{ color: '#666', fontSize: '0.9rem' }}>Last Updated: {new Date(lastUpdated).toLocaleString()}</p>)}
//               <div style={{ marginTop: '20px' }}>
//                 <p><strong>Total Followers:</strong> {totalFollowers.toLocaleString()}</p>
//                 <p><strong>Total Engagement:</strong> {totalEngagement.toLocaleString()}</p>
//                 <p><strong>Total Reach:</strong> {totalReach.toLocaleString()}</p>
//               </div>
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };