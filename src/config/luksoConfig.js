// LUKSO Testnet Configuration
export const LUKSO_TESTNET_RPC = 'https://rpc.testnet.lukso.network';
export const LUKSO_TESTNET_CHAIN_ID = 4201;

// Data key for our micro-blog posts
export const MICRO_BLOG_POSTS_KEY_NAME = 'MyMicroBlogPostsLSP';

// ERC725Y Schema for our micro-blog posts
export const ERC725Y_SCHEMA = [
  {
    name: 'MicroBlogPosts',
    key: '0x4d6963726f426c6f67506f7374734c5350000000000000000000000000000000',
    keyType: 'Singleton',
    valueType: 'bytes',
    valueContent: 'String'
  }
];

// LUKSO Browser Extension configuration
export const UP_BROWSER_EXTENSION_CONFIG = {
  chainId: LUKSO_TESTNET_CHAIN_ID,
  rpcUrl: LUKSO_TESTNET_RPC
};
