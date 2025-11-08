// /**
//  * LINKEDIN ACCOUNT STORAGE SERVICE
//  * Manages LinkedIn account information in localStorage
//  */

// // LinkedIn account storage keys
// const LINKEDIN_STORAGE_KEYS = {
//     ACCESS_TOKEN: 'linkedin_access_token',
//     PROFILE: 'linkedin_profile_data',
//     CONNECTION_DATE: 'linkedin_connection_date',
//     ACCOUNT_STATUS: 'linkedin_account_status'
// };

// /**
//  * Save LinkedIn account information after successful authentication
//  */
// export const saveLinkedInAccount = (profileData, accessToken) => {
//     try {
//         const accountInfo = {
//             id: profileData.id,
//             firstName: profileData.firstName?.localized?.en_US || profileData.localizedFirstName,
//             lastName: profileData.lastName?.localized?.en_US || profileData.localizedLastName,
//             profilePicture: profileData.profilePicture,
//             emailAddress: profileData.emailAddress,
//             accessToken: accessToken,
//             connectionDate: new Date().toISOString(),
//             status: 'connected'
//         };

//         // Store individual components
//         localStorage.setItem(LINKEDIN_STORAGE_KEYS.ACCESS_TOKEN, accessToken);
//         localStorage.setItem(LINKEDIN_STORAGE_KEYS.PROFILE, JSON.stringify(accountInfo));
//         localStorage.setItem(LINKEDIN_STORAGE_KEYS.CONNECTION_DATE, accountInfo.connectionDate);
//         localStorage.setItem(LINKEDIN_STORAGE_KEYS.ACCOUNT_STATUS, 'connected');

//         console.log('LinkedIn account information saved successfully');
//         return accountInfo;
//     } catch (error) {
//         console.error('Error saving LinkedIn account:', error);
//         return null;
//     }
// };

// /**
//  * Get stored LinkedIn account information
//  */
// export const getLinkedInAccount = () => {
//     try {
//         const profileData = localStorage.getItem(LINKEDIN_STORAGE_KEYS.PROFILE);
//         const accessToken = localStorage.getItem(LINKEDIN_STORAGE_KEYS.ACCESS_TOKEN);
//         const status = localStorage.getItem(LINKEDIN_STORAGE_KEYS.ACCOUNT_STATUS);

//         if (!profileData || !accessToken) {
//             return null;
//         }

//         const account = JSON.parse(profileData);
//         return {
//             ...account,
//             accessToken,
//             status: status || 'connected'
//         };
//     } catch (error) {
//         console.error('Error retrieving LinkedIn account:', error);
//         return null;
//     }
// };

// /**
//  * Check if LinkedIn account is connected
//  */
// export const isLinkedInConnected = () => {
//     const status = localStorage.getItem(LINKEDIN_STORAGE_KEYS.ACCOUNT_STATUS);
//     const accessToken = localStorage.getItem(LINKEDIN_STORAGE_KEYS.ACCESS_TOKEN);
//     return status === 'connected' && !!accessToken;
// };

// /**
//  * Disconnect LinkedIn account (remove all stored data)
//  */
// export const disconnectLinkedInAccount = () => {
//     try {
//         Object.values(LINKEDIN_STORAGE_KEYS).forEach(key => {
//             localStorage.removeItem(key);
//         });
//         console.log('LinkedIn account disconnected successfully');
//         return true;
//     } catch (error) {
//         console.error('Error disconnecting LinkedIn account:', error);
//         return false;
//     }
// };

// /**
//  * Get LinkedIn connection summary for account page
//  */
// export const getLinkedInAccountSummary = () => {
//     const account = getLinkedInAccount();
//     if (!account) {
//         return {
//             connected: false,
//             message: 'No LinkedIn account connected'
//         };
//     }

//     const connectionDate = new Date(account.connectionDate);
//     const formattedDate = connectionDate.toLocaleDateString('en-US', {
//         year: 'numeric',
//         month: 'long',
//         day: 'numeric'
//     });

//     return {
//         connected: true,
//         fullName: `${account.firstName} ${account.lastName}`,
//         connectionDate: formattedDate,
//         status: account.status,
//         profileId: account.id
//     };
// };

// /**
//  * Update LinkedIn account status
//  */
// export const updateLinkedInAccountStatus = (newStatus) => {
//     try {
//         localStorage.setItem(LINKEDIN_STORAGE_KEYS.ACCOUNT_STATUS, newStatus);
//         return true;
//     } catch (error) {
//         console.error('Error updating LinkedIn account status:', error);
//         return false;
//     }
// };
