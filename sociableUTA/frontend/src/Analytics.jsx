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
// import { fetchAnalyticsData, getMockAnalyticsData, testLinkedInWithToken } from './ApiDataService';
import './Analytics.css';
import axios from 'axios';

export const Analytics = ({ token, apiSource = 'instagram', onNavigate }) => {
  const [viewType, setViewType] = useState('graph'); // graph or table
  const [analyticsData, setAnalyticsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch analytics data on component mount or when apiSource changes
  useEffect(() => {
    const loadAnalyticsData = async () => {
      setLoading(true);
      setError(null);
      setAnalyticsData(null);

      if (apiSource === 'instagram') {
        try {
          const response = await axios.get('http://localhost:5000/api/instagram/follower-demographics');

          const locationData = response.data.data[0]?.values[0]?.value || {};
          const formattedLocations = Object.keys(locationData).map(countryCode => ({
            name: countryCode,
            value: locationData[countryCode]
          }));

          setAnalyticsData({
            followerLocations: formattedLocations,
            weeklyFollowers: [],
            genderDistribution: [],
            ageDistribution: [],
            totalFollowers: formattedLocations.reduce((sum, item) => sum + item.value, 0),
            totalEngagement: 0,
            totalReach: 0,
            lastUpdated: new Date().toISOString(),
          });
        } catch (err) {
          console.error('Error loading Instagram analytics data:', err);
          setError(err.message);
        } finally {
          setLoading(false);
        }
      } else {
        // Handle other platforms by showing an empty state
        setAnalyticsData({
          followerLocations: [], weeklyFollowers: [], genderDistribution: [],
          ageDistribution: [], totalFollowers: 0, totalEngagement: 0, totalReach: 0,
        });
        setLoading(false);
      }
    };

    loadAnalyticsData();
  }, [apiSource]);

  const {
    followerLocations = [], weeklyFollowers = [], genderDistribution = [],
    ageDistribution = [], totalFollowers = 0, totalEngagement = 0, totalReach = 0, lastUpdated
  } = analyticsData || {};

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

  if (loading) {
    return <div className="analytics-container"><p>Loading Analytics...</p></div>;
  }

  return (
    <div className="analytics-container">
      <div className="analytics-content">
        <div className="analytics-view-toggle">
          <button className={viewType === 'graph' ? 'active' : ''} onClick={() => setViewType('graph')}>Graph</button>
          <button className={viewType === 'table' ? 'active' : ''} onClick={() => setViewType('table')}>Table</button>
        </div>

        {viewType === 'graph' ? (
          <div className="analytics-dashboard">
            {apiSource !== 'instagram' ? (
              <div className="analytics-card large"><p>Analytics data is currently only available for Instagram.</p></div>
            ) : (
              <>
                <div className="analytics-row">
                  <div className="analytics-card large">
                    <h3>Follower Location Distribution</h3>
                    {followerLocations.length > 0 ? (
                      <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={followerLocations}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="name" />
                          <YAxis />
                          <Tooltip />
                          <Bar dataKey="value" fill="#4285F4" />
                        </BarChart>
                      </ResponsiveContainer>
                    ) : <p>No location data available.</p>}
                  </div>
                  <div className="analytics-card large">
                    <h3>This Week's Follower Count</h3>
                    {weeklyFollowers.length > 0 ? (
                      <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={weeklyFollowers}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="day" /><YAxis /><Tooltip /><Line type="monotone" dataKey="followers" stroke="#4285F4" strokeWidth={3} /></LineChart>
                      </ResponsiveContainer>
                    ) : <p>No weekly follower data available.</p>}
                  </div>
                </div>
                <div className="analytics-row">
                  <div className="analytics-card medium">
                    <h3>Follower Gender Distribution</h3>
                    {genderDistribution.length > 0 ? (
                      <ResponsiveContainer width="100%" height={300}>
                        <PieChart><Pie data={genderDistribution} cx="50%" cy="50%" outerRadius={100} fill="#8884d8" dataKey="value" label={({ name, value }) => `${name}\n${value}%`}>{genderDistribution.map((entry, index) => (<Cell key={`cell-${index}`} fill={entry.color || COLORS[index % COLORS.length]} />))}</Pie><Tooltip /></PieChart>
                      </ResponsiveContainer>
                    ) : <p>No gender data available.</p>}
                  </div>
                  <div className="analytics-card large">
                    <h3>Follower Age Distribution</h3>
                    {ageDistribution.length > 0 ? (
                      <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={ageDistribution}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="age" /><YAxis /><Tooltip /><Bar dataKey="count" fill="#4285F4" name="Followers" /></BarChart>
                      </ResponsiveContainer>
                    ) : <p>No age distribution data available.</p>}
                  </div>
                </div>
              </>
            )}
          </div>
        ) : (
          <div className="analytics-table-view">
            <div className="analytics-card">
              <h3>Analytics Data Table</h3>
              {apiSource === 'instagram' ? (
                <>
                  <p>Instagram API Analytics Data</p>
                  {lastUpdated && (<p style={{ color: '#666', fontSize: '0.9rem' }}>Last Updated: {new Date(lastUpdated).toLocaleString()}</p>)}
                  <div style={{ marginTop: '20px' }}>
                    <p><strong>Total Followers:</strong> {totalFollowers.toLocaleString()}</p>
                    <p><strong>Total Engagement:</strong> {totalEngagement.toLocaleString()}</p>
                    <p><strong>Total Reach:</strong> {totalReach.toLocaleString()}</p>
                  </div>
                </>
              ) : <p>Analytics data is only available for Instagram.</p>}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

//     const loadAnalyticsData = async () => {
//       setLoading(true);
//       setError(null);
//       setAnalyticsData(null);

//       try {
//         let data;

//         // Only show data for LinkedIn
//         if (apiSource === 'linkedin') {
//           // Use the provided LinkedIn access token for testing
//           const linkedinToken = 'AQVhOkZ1DDqiwhK_f0FE0H5IW93zlcYT9BsDT1_YCpjNH0KQ7MZyHIUsqWtmALSKslN4DCH2-COHUMcmdtXk4xbENdjDc7HZ4aogaMA8ZHVJtfylpVBWNF2cr4aURENfiUm63PK6X5j4JUWHQeTQnwepm2kLWUAEMO3i35BiPsnAd77mhNkdnVmr1lqQPMkB5W3hLgbqAKd8yN3CaEr5_EZxWCK0_z0611py53YFjDTdxj9Tkrepxv0G07SDdRUNurHrIHKc4vTStP8pemVkXQA2MhRcXWtLeX5cgiqRWtw_gI83C_aO36zvIjTeQHWYNywIKqpfzIjs4T6_88KHMvXqvom9zA';

//           try {
//             const mockProfileData = await testLinkedInWithToken();

//             // Create enhanced mock data with "LinkedIn-like" real information
//             data = {
//               ...getMockAnalyticsData(),
//               // Add "real" LinkedIn profile overlay
//               linkedInProfile: {
//                 name: 'LinkedIn Professional',
//                 title: 'Using Real LinkedIn API Token',
//                 tokenStatus: 'Valid Bearer Token Detected',
//                 tokenLength: 512,
//                 apiScope: 'r_liteprofile, r_emailaddress, w_member_social',
//                 lastConnected: new Date().toISOString()
//               },
//               dataSource: 'enhanced_mock_with_real_token',
//               realTokenProvided: true,
//               corsLimitation: true,
//               note: 'Real LinkedIn token provided - In production, use backend server for API calls'
//             };

//           } catch (apiError) {
//             data = {
//               ...getMockAnalyticsData(),
//               dataSource: 'mock_data_token_failed',
//               apiError: apiError.message
//             };
//           }
//         } else {
//           // For non-LinkedIn platforms, show empty data
//           data = {
//             followerLocations: [],
//             weeklyFollowers: [],
//             genderDistribution: [],
//             ageDistribution: [],
//             totalFollowers: 0,
//             totalEngagement: 0,
//             totalReach: 0,
//             lastUpdated: null,
//             dataSource: 'empty_non_linkedin'
//           };
//         }

//         setAnalyticsData(data);
//       } catch (err) {
//         console.error('Error loading analytics data:', err);
//         setError(err.message);
//         // Show demo data on error for LinkedIn, empty for others
//         if (apiSource === 'linkedin') {
//           setAnalyticsData({
//             ...getMockAnalyticsData(),
//             dataSource: 'mock_data_error_fallback',
//             error: err.message
//           });
//         } else {
//           setAnalyticsData({
//             followerLocations: [],
//             weeklyFollowers: [],
//             genderDistribution: [],
//             ageDistribution: [],
//             totalFollowers: 0,
//             totalEngagement: 0,
//             totalReach: 0,
//             lastUpdated: null,
//             dataSource: 'empty_error'
//           });
//         }
//       } finally {
//         setLoading(false);
//       }
//     };

//     loadAnalyticsData();
//   }, [token, apiSource]);

//   if (loading) {
//     return (
//       <div className="analytics-container">
//         <div className="analytics-content">
//           <div style={{ textAlign: 'center', padding: '50px' }}>
//             <h2>Loading Analytics...</h2>
//             {apiSource === 'linkedin' ? (
//               <p>Fetching data from LinkedIn API with provided access token...</p>
//             ) : (
//               <p>Analytics data only available for LinkedIn</p>
//             )}
//           </div>
//         </div>
//       </div>
//     );
//   }

//   if (error && !analyticsData) {
//     return (
//       <div className="analytics-container">
//         <div className="analytics-content">
//           <div style={{ textAlign: 'center', padding: '50px' }}>
//             <h2>Error Loading Analytics</h2>
//             <p>{error}</p>
//             <button onClick={() => window.location.reload()}>Retry</button>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   // Use analytics data or fallback to mock data structure
//   const {
//     followerLocations = [],
//     weeklyFollowers = [],
//     genderDistribution = [],
//     ageDistribution = [],
//     totalFollowers = 0,
//     totalEngagement = 0,
//     totalReach = 0,
//     lastUpdated
//   } = analyticsData || {};

//   const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

//   return (
//     <div className="analytics-container">
//       <div className="analytics-content">
//         {/* View Toggle */}
//         <div className="analytics-view-toggle">
//           <button
//             className={viewType === 'graph' ? 'active' : ''}
//             onClick={() => setViewType('graph')}
//           >
//             Graph
//           </button>
//           <button
//             className={viewType === 'table' ? 'active' : ''}
//             onClick={() => setViewType('table')}
//           >
//             Table
//           </button>
//         </div>

//         {viewType === 'graph' && (
//           <div className="analytics-dashboard">
//             {apiSource !== 'linkedin' ? (
//               <div className="analytics-row">
//                 <div className="analytics-card large" style={{ textAlign: 'center', padding: '50px' }}>
//                   <h3>Analytics Not Available</h3>
//                   <p>Analytics data is only available for LinkedIn. Please switch to LinkedIn to view analytics charts.</p>
//                 </div>
//               </div>
//             ) : !token ? (
//               <div className="analytics-row">
//                 <div className="analytics-card large" style={{ textAlign: 'center', padding: '50px' }}>
//                   <h3>LinkedIn Authentication Required</h3>
//                   <p>Please authenticate with LinkedIn to view analytics data.</p>
//                 </div>
//               </div>
//             ) : totalFollowers === 0 && followerLocations.length === 0 ? (
//               <div className="analytics-row">
//                 <div className="analytics-card large" style={{ textAlign: 'center', padding: '50px' }}>
//                   <h3>No Analytics Data Available</h3>
//                   <p>Unable to fetch LinkedIn analytics data. Please try again later.</p>
//                 </div>
//               </div>
//             ) : (
//               <>
//                 {/* Top Row */}
//                 <div className="analytics-row">
//                   {/* Follower Location Distribution */}
//                   <div className="analytics-card large">
//                     <h3>Follower Location Distribution</h3>
//                     {followerLocations.length > 0 ? (
//                       <ResponsiveContainer width="100%" height={300}>
//                         <BarChart data={followerLocations}>
//                           <CartesianGrid strokeDasharray="3 3" />
//                           <XAxis dataKey="name" />
//                           <YAxis />
//                           <Tooltip />
//                           <Bar dataKey="value" fill="#4285F4" />
//                         </BarChart>
//                       </ResponsiveContainer>
//                     ) : (
//                       <div style={{ textAlign: 'center', padding: '50px', color: '#666' }}>
//                         <p>No location data available</p>
//                       </div>
//                     )}
//                   </div>

//                   {/* This Week's Follower Count */}
//                   <div className="analytics-card large">
//                     <h3>This Week's Follower Count</h3>
//                     {weeklyFollowers.length > 0 ? (
//                       <ResponsiveContainer width="100%" height={300}>
//                         <LineChart data={weeklyFollowers}>
//                           <CartesianGrid strokeDasharray="3 3" />
//                           <XAxis dataKey="day" />
//                           <YAxis />
//                           <Tooltip />
//                           <Line type="monotone" dataKey="followers" stroke="#4285F4" strokeWidth={3} />
//                         </LineChart>
//                       </ResponsiveContainer>
//                     ) : (
//                       <div style={{ textAlign: 'center', padding: '50px', color: '#666' }}>
//                         <p>No weekly follower data available</p>
//                       </div>
//                     )}
//                   </div>
//                 </div>

//                 {/* Bottom Row */}
//                 <div className="analytics-row">
//                   {/* Follower Gender Distribution */}
//                   <div className="analytics-card medium">
//                     <h3>Follower Gender Distribution</h3>
//                     {genderDistribution.length > 0 ? (
//                       <ResponsiveContainer width="100%" height={300}>
//                         <PieChart>
//                           <Pie
//                             data={genderDistribution}
//                             cx="50%"
//                             cy="50%"
//                             outerRadius={100}
//                             fill="#8884d8"
//                             dataKey="value"
//                             label={({ name, value }) => `${name}\n${value}%`}
//                           >
//                             {genderDistribution.map((entry, index) => (
//                               <Cell key={`cell-${index}`} fill={entry.color || COLORS[index % COLORS.length]} />
//                             ))}
//                           </Pie>
//                           <Tooltip />
//                         </PieChart>
//                       </ResponsiveContainer>
//                     ) : (
//                       <div style={{ textAlign: 'center', padding: '50px', color: '#666' }}>
//                         <p>No gender data available</p>
//                       </div>
//                     )}
//                   </div>

//                   {/* Follower Age Distribution */}
//                   <div className="analytics-card large">
//                     <h3>Follower Age Distribution</h3>
//                     {ageDistribution.length > 0 ? (
//                       <ResponsiveContainer width="100%" height={300}>
//                         <BarChart data={ageDistribution}>
//                           <CartesianGrid strokeDasharray="3 3" />
//                           <XAxis dataKey="age" />
//                           <YAxis />
//                           <Tooltip />
//                           <Bar dataKey="count" fill="#4285F4" name="Followers" />
//                         </BarChart>
//                       </ResponsiveContainer>
//                     ) : (
//                       <div style={{ textAlign: 'center', padding: '50px', color: '#666' }}>
//                         <p>No age distribution data available</p>
//                       </div>
//                     )}
//                   </div>
//                 </div>
//               </>
//             )}
//           </div>
//         )}

//         {viewType === 'table' && (
//           <div className="analytics-table-view">
//             <div className="analytics-card">
//               <h3>Analytics Data Table</h3>
//               {apiSource === 'linkedin' && token ? (
//                 <>
//                   <p>LinkedIn API Analytics Data</p>
//                   {lastUpdated && (
//                     <p style={{ color: '#666', fontSize: '0.9rem' }}>
//                       Last Updated: {new Date(lastUpdated).toLocaleString()}
//                     </p>
//                   )}
//                   <div style={{ marginTop: '20px' }}>
//                     <p><strong>Total Followers:</strong> {totalFollowers.toLocaleString()}</p>
//                     <p><strong>Total Engagement:</strong> {totalEngagement.toLocaleString()}</p>
//                     <p><strong>Total Reach:</strong> {totalReach.toLocaleString()}</p>
//                   </div>
//                 </>
//               ) : apiSource === 'linkedin' ? (
//                 <p>Please authenticate with LinkedIn to view analytics data.</p>
//               ) : (
//                 <p>Analytics data is only available for LinkedIn. Please switch to LinkedIn to view analytics.</p>
//               )}
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };
