const { GoogleGenerativeAI } = require('@google/generative-ai');
const axios = require('axios');
const asyncHandler = require('express-async-handler');
require('dotenv').config();

// Initialize Gemini API
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Initialize YouTube API
const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;

const generateBuild = asyncHandler(async (req, res) => {
  try {
    const { budget, useCase, cpuBrand, gpuBrand, resolution, peripherals } = req.body;

    // Validate input
    if (!budget || !useCase) {
      return res.status(400).json({ message: 'Budget and use case are required' });
    }

    // Format peripherals for the prompt
    const peripheralsText = peripherals.length > 0 
      ? `Additionally, include these peripherals in the budget: ${peripherals.join(', ')}.`
      : '';

    // Create a detailed prompt for Gemini
    const prompt = `
    I need a PC build recommendation with the following requirements:
    
    Budget: ₹${budget}
    Primary Use Case: ${useCase}
    CPU Preference: ${cpuBrand !== 'No Preference' ? cpuBrand : 'Any brand'}
    GPU Preference: ${gpuBrand !== 'No Preference' ? gpuBrand : 'Any brand'}
    Monitor Resolution: ${resolution}
    ${peripheralsText}

    Based on these requirements, please analyze the use case "${useCase}" in detail. For example, 
    for gaming I need a powerful GPU and good CPU, for video editing I need strong multi-core processor and plenty of RAM.
    
    Please provide a detailed PC build recommendation with the following components:
    1. CPU (with model, specs, and price)
    2. Motherboard (with model, specs, and price)
    3. RAM (with capacity, speed, and price)
    4. GPU (with model, specs, and price)
    5. Storage (with type, capacity, and price)
    6. Power Supply (with wattage, rating, and price)
    7. Case (with model and price)
    8. CPU Cooler (if needed, with price)
    ${peripherals.includes('Monitor') ? '9. Monitor (with size, resolution, and price)' : ''}
    ${peripherals.includes('Keyboard') ? '10. Keyboard (with type and price)' : ''}
    ${peripherals.includes('Mouse') ? '11. Mouse (with type and price)' : ''}

    For each component, please provide:
    1. Full name and model
    2. Key specifications
    3. Price in Indian Rupees (₹)
    4. A brief explanation of why this component is suitable for the specified use case

    Please also include:
    1. Total build cost calculation
    2. Component selection rationale based on the use case
    3. Compatibility check confirming all parts work together
    4. The names of important components that would benefit from video reviews (for YouTube search of famous reviewers)

    Format the response in JSON with the following structure:
    {
      "summary": "Brief summary of what this build is optimized for",
      "components": [
        {
          "name": "Component name",
          "type": "CPU/GPU/etc",
          "specs": "Key specifications",
          "price": price,
          "rationale": "Why this component was chosen"
        }
      ],
      "totalCost": total price,
      "compatibilityNotes": "Notes about compatibility",
      "reviewComponents": ["Component 1", "Component 2", "Component 3"]
    }
    `;

    // Call Gemini API
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const textResponse = response.text();

    // Extract JSON from response
    const jsonMatch = textResponse.match(/```json\n([\s\S]*?)\n```/) || 
                      textResponse.match(/({[\s\S]*})/) ||
                      null;
                      
    let buildData;
    try {
      if (jsonMatch && jsonMatch[1]) {
        buildData = JSON.parse(jsonMatch[1]);
      } else if (jsonMatch) {
        buildData = JSON.parse(jsonMatch[0]);
      } else {
        // As a fallback, try to parse the entire response
        buildData = JSON.parse(textResponse);
      }
    } catch (error) {
      console.error("Failed to parse JSON response:", error);
      return res.status(500).json({ 
        message: 'Failed to parse AI response',
        rawResponse: textResponse
      });
    }

    // Fetch YouTube videos for review components
    const youtubeData = await Promise.all(
      buildData.reviewComponents.map(async (component) => {
        try {
          const searchQuery = `${component} review`;
          const response = await axios.get('https://www.googleapis.com/youtube/v3/search', {
            params: {
              part: 'snippet',
              maxResults: 1,
              q: searchQuery,
              type: 'video',
              key: YOUTUBE_API_KEY
            }
          });

          return response.data.items.map(item => ({
            title: item.snippet.title,
            description: item.snippet.description,
            thumbnail: item.snippet.thumbnails.medium.url,
            videoId: item.id.videoId,
            component
          }));
        } catch (error) {
          console.error(`Failed to fetch YouTube videos for ${component}:`, error);
          return [];
        }
      })
    );

    // Flatten the array of arrays and add to the response
    buildData.youtubeReviews = youtubeData.flat();

    res.status(200).json(buildData);
  } catch (error) {
    console.error("Error generating build:", error);

    // Handle API key errors
    if (error.message.includes('API_KEY_INVALID')) {
      console.error('API key is invalid or expired. Please renew the API key.');
      return res.status(500).json({ 
        message: 'API key is invalid or expired. Contact the administrator.' 
      });
    }

    res.status(500).json({
      message: 'Failed to generate PC build recommendation',
      error: error.message
    });
  }
});

module.exports = generateBuild;