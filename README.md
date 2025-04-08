# 🧠✨ InsightFlow - AI-Powered Insights <!-- omit in toc -->

<div align="center">
  <h3>Created by Aniket Kumar</h3>
  <p>Powered by Cerebras Llama 3.3 70B</p>
</div>

<hr/>

## Table of Contents <!-- omit in toc -->

- [Overview](#overview)
- [Preview](#preview)
- [Features](#features)
- [Installation](#installation)
  - [Local Development](#local-development)
  - [Deployment on Render](#deployment-on-render)
- [Browser Integration](#browser-integration)
- [License](#license)
- [Acknowledgements](#acknowledgements)

## Overview

InsightFlow is an advanced AI assistant powered by Cerebras Llama 3.3 70B, providing intelligent insights and answers to your questions. It features a clean, modern UI and uses web search capabilities with fallback to web scraping when needed.

The application stores chat history in browser localStorage for a seamless experience across sessions, and supports both dark and light modes for comfortable viewing in any environment.

## Preview

![video-preview](.assets/perplexica-preview.gif)

## Features

- **Cerebras Llama 3.3 70B**: Powered by one of the most advanced open-source large language models available today.
- **Web Search Capabilities**: Uses web scraping as a fallback when SearxNG is not available.
- **Browser Storage for History**: Chat history is stored securely in your browser's localStorage.
- **Clean Modern UI**: Intuitive interface with smooth animations and visual feedback.
- **Dark and Light Mode**: Support for both dark and light themes for comfortable viewing.
- **Responsive Design**: Works well on both desktop and mobile devices.
- **Welcome Message**: Personalized welcome message from the creator.
- **History Management**: View, search, and manage your chat history.

## Installation

### Local Development

1. Clone the repository:

   ```bash
   git clone https://github.com/yourusername/insightflow.git
   cd insightflow
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Create a `config.toml` file in the root directory with the following content:

   ```toml
   [GENERAL]
   SIMILARITY_MEASURE = "cosine"
   KEEP_ALIVE = "5m"

   [MODELS.CEREBRAS]
   API_KEY = "csk-5f9ftpvvtker983wvkkcym8eem65tey64khtptwhxfmenp9w"

   [API_ENDPOINTS]
   SEARXNG = "http://localhost:4000"

   [APP]
   CREATOR = "Aniket Kumar"
   VERSION = "1.0.0"
   ```

4. Run the development server:

   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

### Deployment on Render

This project is configured for easy deployment on Render.com:

1. Fork or clone this repository to your GitHub account
2. Sign up for a Render account at https://render.com
3. Create a new Web Service on Render
4. Connect your GitHub repository
5. Render will automatically detect the configuration in `render.yaml`
6. Click "Create Web Service"

Render will automatically build and deploy your application.

## Browser Integration

You can add InsightFlow to your browser's search bar for quick access:

1. Open your browser's settings
2. Navigate to the 'Search Engines' section
3. Add a new site search with the URL: `http://localhost:3000/?q=%s` (or your deployed URL)
4. Now you can use InsightFlow directly from your browser's search bar

## License

This project is open source and available under the MIT License.

## Acknowledgements

InsightFlow is based on the Perplexica project, with significant UI improvements and integration with Cerebras Llama 3.3 70B.

---

Created with ❤️ by Aniket Kumar
