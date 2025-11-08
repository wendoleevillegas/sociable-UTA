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
import axiosInstance from './api/axios';

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
    
    // Create the base result object
    const result = {
      totalFollowers: (stats.organicFollowerCount || 0) + (stats.paidFollowerCount || 0),
      ...MOCK_KEY_METRICS, // Use mock data
      demographics: [], // Add default empty array
    };

    // --- NEW: Fetch detailed demographics ---
    try {
      const demoResponse = await axios.get('http://localhost:5000/api/linkedin/demographics', {
        headers: { 'Authorization': `Bearer ${linkedInToken}` }
      });
      result.demographics = demoResponse.data; // Add demo data to result
    } catch (demoErr) {
      console.warn('Could not fetch LinkedIn demographics:', demoErr.message);
      result.demographics = []; // Default to empty on error
    }
    return result; // Return the combined object

  } catch (err) {
    console.error('Failed to load LinkedIn analytics:', err);
    throw new Error('Failed to load LinkedIn analytics. Token may be expired.');
  }
};

// --- End Data Fetching Helpers ---


export const Analytics = ({ token, apiSource = 'all', onNavigate }) => {
  const [data, setData] = useState({
    keyMetrics: { impressions: 0, reach: 0, engagementRate: '0%', profileVisits: 0 },
    audience: { totalFollowers: 0, newFollowers: 0, graphData: [], demographics: [] },
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
        let allDemographics = [];
        let allGraphData = [];

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

              if (liData.demographics) {
                allDemographics.push(...liData.demographics.map(d => ({ ...d, platform: 'linkedin' })));
              }
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
            demographics: allDemographics,
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

  const DEMO_COLORS = ['#0A66C2', '#0073b1', '#0084bf', '#0095ce', '#00a6dd'];

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

        {(apiSource === 'all' || apiSource === 'linkedin') && data.audience.demographics.length > 0 && (
            <div className="audience-demographics" style={{ marginTop: '20px' }}>
              <h4 style={{ fontSize: '0.9rem', fontWeight: 600, color: '#1c1e21', marginBottom: '10px' }}>Followers by Country (LinkedIn)</h4>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={data.audience.demographics.slice(0, 5)} layout="vertical" margin={{ top: 5, right: 20, left: 40, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                  <XAxis type="number" fontSize={12} />
                  <YAxis type="category" dataKey="country" fontSize={12} width={80} />
                  <Tooltip />
                  <Bar dataKey="followers">
                    {data.audience.demographics.slice(0, 5).map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={DEMO_COLORS[index % DEMO_COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}


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