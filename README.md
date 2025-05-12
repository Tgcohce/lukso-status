# UP Micro-Blog

A mini dApp for LUKSO's Nexus Hackathon that allows users to post and view short text updates stored directly on their Universal Profiles.

![UP Micro-Blog Screenshot](https://github.com/user-attachments/assets/7a6fb854-38df-49aa-bbd8-b971aec87ec0)


## Features

- Connect your LUKSO Universal Profile using @up-provider
- Write and publish short text status updates (max 280 characters)
- Store updates on-chain directly on your Universal Profile using LSP0 ERC725Account standard
- View a feed of your latest status updates

## Technology Stack

- React for the frontend
- @up-provider for connecting to Universal Profiles
- LSP0 ERC725Account's ERC725Y interface for data storage
- ethers.js for blockchain interactions

## How It Works

This dApp leverages LUKSO's Universal Profiles (UPs) as both the identity layer and data storage. Each post is stored directly on the user's UP using the LSP0 ERC725Account standard's ERC725Y interface (setData/getData functions).

The posts are stored as a JSON array under a specific bytes32 data key on the UP. This approach fulfills the "Build using LSPs" requirement by utilizing the capabilities of the LSP0 standard.

## Getting Started

1. Clone this repository
2. Install dependencies: `npm install`
3. Start the development server: `npm start`
4. Connect your Universal Profile using the UP Browser Extension

## Requirements

- LUKSO UP Browser Extension
- A LUKSO Universal Profile on the network

## Deploying to The Grid

This mini dApp is designed to be deployed on LUKSO's The Grid. Follow these steps to deploy your own instance:

1. **Create a Universal Profile for your dApp**
   - Create a new Universal Profile using the LUKSO Browser Extension
   - This will serve as the identity for your mini dApp on The Grid

2. **Update the Grid Configuration**
   - Edit the `lukso-grid-config.json` file
   - Update the `upProfile` field with your Universal Profile address
   - Customize other fields as needed

3. **Build the Application**
   ```bash
   npm run build
   ```

4. **Deploy to The Grid**
   - Upload your build folder to The Grid using your Universal Profile
   - Follow the deployment instructions on The Grid platform

## Architecture

```
┌─────────────────────────────────────┐
│            UP Micro-Blog             │
└───────────────────┬─────────────────┘
                    │
        ┌───────────▼───────────┐
        │    @up-provider       │
        │    Integration        │
        └───────────┬───────────┘
                    │
┌───────────────────▼───────────────────┐
│          Universal Profile             │
│                                        │
│  ┌────────────────────────────────┐    │
│  │       LSP0 ERC725Account       │    │
│  │                                │    │
│  │   ┌─────────────────────────┐  │    │
│  │   │      ERC725Y Storage    │  │    │
│  │   │                         │  │    │
│  │   │  ┌──────────────────┐   │  │    │
│  │   │  │  Microblog Posts │   │  │    │
│  │   │  └──────────────────┘   │  │    │
│  │   └─────────────────────────┘  │    │
│  └────────────────────────────────┘    │
└────────────────────────────────────────┘
```

The architecture leverages LUKSO's Universal Profiles as both the identity and data storage layer. The mini dApp connects to the user's UP using the @up-provider library, which enables seamless integration with The Grid. All posts are stored directly on-chain in the user's Universal Profile using the ERC725Y storage interface of the LSP0 ERC725Account standard.

## Note

This is a hackathon project for LUKSO's Nexus Hackathon (May 2025).
