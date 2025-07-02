const express = require('express');
const axios = require('axios');
require('dotenv').config();
const { searchPlaces } = require('../utils/placesApi');
const { getAiTaskSuggestionsOnly, getTaskVendorSuggestions } = require('../controllers/taskController'); // Import getTaskVendorSuggestions

const router = express.Router();

// Route for AI task suggestions only
router.get('/tasks-only/:eventId', getAiTaskSuggestionsOnly);

// New route for fetching vendor suggestions for a specific task
router.post('/get-vendor-suggestions', getTaskVendorSuggestions);

// This function is no longer needed here as categorization is handled in getTaskVendorSuggestions
// function classifyTask(task) {
//   const lowerTask = task.toLowerCase();
//   if (lowerTask.includes("venue") || lowerTask.includes("location") || lowerTask.includes("space")) {
//     return "venue_booking";
//   }
//   if (lowerTask.includes("catering") || lowerTask.includes("food") || lowerTask.includes("drinks")) {
//     return "catering";
//   }
//   if (lowerTask.includes("invitation") || lowerTask.includes("guest list") || lowerTask.includes("rsvp")) {
//     return "invitation";
//   }
//   if (lowerTask.includes("transport") || lowerTask.includes("shuttle") || lowerTask.includes("ride")) {
//     return "transport";
//   }
//   if (lowerTask.includes("decoration") || lowerTask.includes("decor") || lowerTask.includes("flowers")) {
//     return "decoration";
//   }
//   if (lowerTask.includes("photography") || lowerTask.includes("photographer") || lowerTask.includes("photos")) {
//     return "photography";
//   }
//   if (lowerTask.includes("sound") || lowerTask.includes("audio") || lowerTask.includes("speakers")) {
//     return "sound";
//   }
//   if (lowerTask.includes("entertainment") || lowerTask.includes("music") || lowerTask.includes("dj") || lowerTask.includes("band") || lowerTask.includes("performer")) {
//     return "entertainment";
//   }
//   if (lowerTask.includes("security") || lowerTask.includes("guards") || lowerTask.includes("safety")) {
//     return "security";
//   }
//   return "general";
// }

router.post("/suggest-tasks-enriched", async (req, res) => {
  const { eventName, eventDescription, venueNeeded, cateringNeeded } = req.body;

  const prompt = `Suggest 4 to 5 lines a breif 6 to 8 words of sentence tasks for an event: ${eventName}. ${eventDescription}. ${
    venueNeeded ? "A venue is required." : ""
  } ${cateringNeeded ? "Catering is needed." : ""}`;

  try {
    const cohereResponse = await axios.post(
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

    const tasks = cohereResponse.data.generations[0].text
      .split("\n")
      .filter((line) => line.trim() !== "");

    // Only return tasks and their derived categories, without providers
    const enrichedTasks = tasks.map((task) => ({
      task,
      category: "general" // Simplified category for initial display, actual categorization happens when fetching vendors
    }));

    res.json({ suggestions: enrichedTasks });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to get enriched suggestions" });
  }
});

module.exports = router;
