const express = require('express');
const axios = require('axios');

const router = express.Router();

router.post("/suggest-tasks", async (req, res) => {
  const { eventName, eventDescription, venueNeeded, cateringNeeded } = req.body;

  const prompt = `Suggest 4 to 5 lines a breif 6 to 8 words of sentence tasks for an event: ${eventName}. ${eventDescription}. ${
    venueNeeded ? "A venue is required." : ""
  } ${cateringNeeded ? "Catering is needed." : ""}`;

  try {
    const response = await axios.post(
      "https://api.cohere.ai/v1/generate",
      {
        model: "command-r-plus",
        prompt,
        max_tokens: 300,
        temperature: 0.7,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.COHERE_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    const suggestions = response.data.generations[0].text;
    res.json({ suggestions: suggestions.trim() });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to get suggestions" });
  }
});

module.exports = router;
