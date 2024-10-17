const express = require('express');
const cloudscraper = require('cloudscraper');
const cors = require('cors');

// Initialize Express app
const app = express();
app.use(cors());

// Route to fetch the M4A audio stream URL
app.get('/get-audio-url/:videoId', async (req, res) => {
    const { videoId } = req.params;
    if (!videoId) {
        return res.status(400).json({ error: "Missing videoId parameter" });
    }

    // Construct the API URL
    const apiUrl = `https://www.acethinker.com/downloader/api/apidl.php?url=https://youtu.be/${videoId}`;

    try {
        // Fetch API response using cloudscraper
        const response = await cloudscraper.get(apiUrl);

        // Parse the response data
        const data = JSON.parse(response);

        // Extract the M4A stream URL
        const formats = data?.res_data?.formats || [];
        const m4aFormat = formats.find(format => format.ext === 'm4a');
        const m4aUrl = m4aFormat ? m4aFormat.url : null;

        if (m4aUrl) {
            return res.json({ streamUrl: m4aUrl });
        } else {
            return res.status(404).json({ error: "M4A stream URL not found" });
        }

    } catch (error) {
        console.error("Error:", error);
        return res.status(500).json({ error: "An error occurred" });
    }
});

// Start the server
const PORT = 5000;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is running on port ${PORT}`);
});
