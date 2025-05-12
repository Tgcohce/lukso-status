import { storePostsOnUP, fetchPostsFromUP } from './luksoBlockchain';

// Maximum number of posts to store
const MAX_POSTS = 20;

/**
 * Create a new post and store it on the user's Universal Profile
 * This uses LSP0 ERC725Account's setData function (part of ERC725Y)
 * @param {string} account - The Universal Profile address
 * @param {string} text - The post text content
 * @returns {Promise<string>} The transaction hash
 */
export const createPost = async (account, text) => {
  if (!account || !text) {
    throw new Error('Missing required parameters');
  }

  try {
    // Create the new post object
    const newPost = {
      text,
      timestamp: Date.now(),
      author: account // Add author field to track who created the post
    };

    // Get existing posts from the Universal Profile
    const existingPosts = await fetchPosts(account);
    
    // Add the new post at the beginning of the array
    const updatedPosts = [newPost, ...existingPosts];
    
    // Limit to MAX_POSTS
    const limitedPosts = updatedPosts.slice(0, MAX_POSTS);
    
    // Convert posts array to JSON string
    const postsJson = JSON.stringify(limitedPosts);
    
    // Store the posts on the Universal Profile using LSP0 ERC725Account
    const txHash = await storePostsOnUP(account, postsJson);
    
    return txHash;
  } catch (error) {
    console.error('Error creating post:', error);
    throw error;
  }
};

/**
 * Fetch posts from the user's Universal Profile
 * This uses LSP0 ERC725Account's getData function (part of ERC725Y)
 * @param {string} account - The Universal Profile address
 * @returns {Promise<Array>} The posts array
 */
export const fetchPosts = async (account) => {
  if (!account) {
    throw new Error('Missing required parameters');
  }

  try {
    // Fetch posts from the Universal Profile using LSP0 ERC725Account
    return await fetchPostsFromUP(account);
  } catch (error) {
    console.error('Error fetching posts:', error);
    // If there's an error parsing (likely because no posts exist yet), return empty array
    return [];
  }
};
