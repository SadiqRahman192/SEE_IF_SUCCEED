const { GoogleGenerativeAI } = require('@google/generative-ai');
const Event = require('../models/Event');
const Task = require('../models/Task');
const { searchPlaces } = require('../utils/placesApi'); // Import searchPlaces

// Access your API key as an environment variable (see "Set up your API key" above)
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// @desc    Get AI task suggestions only
// @route   GET /api/ai/tasks-only/:eventId
// @access  Private
exports.getAiTaskSuggestionsOnly = async (req, res) => {
  const { eventId } = req.params;

  try {
    const event = await Event.findById(eventId);
    if (!event || event.userId.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'Not authorized to access this event' });
    }

    const prompt = `Suggest 5 to 7 concise tasks (each 6-8 words) for an event titled "${event.title}" happening on ${event.date.toDateString()} in ${event.location}. ${
      event.venueNeeded ? "A venue is required." : ""
    } ${event.cateringNeeded ? "Catering is needed." : ""}.
    
    Provide the output as a JSON array of strings, where each string is a task. Example: ["Book venue", "Arrange catering"].`;

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    let suggestions;
    try {
      // Attempt to extract JSON from markdown code block if present
      const jsonMatch = text.match(/```json\n([\s\S]*?)\n```/);
      const jsonString = jsonMatch ? jsonMatch[1] : text;
      
      suggestions = JSON.parse(jsonString);
      if (!Array.isArray(suggestions) || !suggestions.every(s => typeof s === 'string')) {
        throw new Error('Parsed response is not an array of strings.');
      }
    } catch (parseError) {
      console.error('Failed to parse Gemini API task suggestions response as JSON:', parseError);
      console.error('Raw Gemini API task suggestions response:', text);
      return res.status(500).json({ msg: 'Failed to parse AI task suggestions. Raw response: ' + text });
    }

    res.json({ suggestions });

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// @desc    Get vendor suggestions for a task based on its title and event context
// @route   POST /api/vendors/by-task
// @access  Private
exports.getTaskVendorSuggestions = async (req, res) => {
  const { taskTitle, eventId } = req.body;

  try {
    console.log(`[getTaskVendorSuggestions] Received request for task: "${taskTitle}", eventId: "${eventId}"`);

    const event = await Event.findById(eventId);
    if (!event) {
      console.error(`[getTaskVendorSuggestions] Event not found for ID: ${eventId}`);
      return res.status(404).json({ msg: 'Event not found' });
    }
    if (event.userId.toString() !== req.user.id) {
      console.error(`[getTaskVendorSuggestions] Not authorized: User ${req.user.id} tried to access event ${eventId} owned by ${event.userId}`);
      return res.status(401).json({ msg: 'Not authorized to access this event' });
    }
    console.log(`[getTaskVendorSuggestions] Found event: ${event.title}, Location: ${event.location}`);

    // Step 1: Use Gemini to categorize the task and get initial suggestions
    const categorizationPrompt = `Analyze the following task and determine its category. If it's related to booking a venue or catering, categorize it as 'venue_booking' or 'catering_booking' respectively. Otherwise, categorize it as 'general'. Also, extract any relevant keywords for searching (e.g., "event venue", "catering service").
    Task: "${taskTitle}" for an event titled "${event.title}" happening on ${event.date.toDateString()} in ${event.location}.

    Provide the output as a JSON object with 'category' (string) and 'keywords' (string, comma-separated, optional) fields. If no specific keywords are found, leave 'keywords' empty.`;

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const categorizationResult = await model.generateContent(categorizationPrompt);
    const categorizationResponse = await categorizationResult.response;
    const categorizationText = categorizationResponse.text();
    console.log(`[getTaskVendorSuggestions] Gemini categorization raw response:`, categorizationText);

    let categorization;
    try {
      const jsonMatch = categorizationText.match(/```json\n([\s\S]*?)\n```/);
      const jsonString = jsonMatch ? jsonMatch[1] : categorizationText;
      categorization = JSON.parse(jsonString);
      console.log(`[getTaskVendorSuggestions] Gemini categorization parsed:`, categorization);
    } catch (parseError) {
      console.error('Failed to parse Gemini API categorization response as JSON:', parseError);
      console.error('Raw Gemini API categorization response:', categorizationText);
      return res.status(500).json({ msg: 'Failed to parse task categorization from AI. Raw response: ' + categorizationText });
    }

    let suggestedProviders = [];
    let category = categorization.category || 'general';
    const keywords = categorization.keywords || '';

    if (category === 'venue_booking' || category === 'catering_booking') {
      try {
        const placesKeyword = category === 'venue_booking' ? 'event venue' : 'catering service';
        const query = keywords || placesKeyword;
        console.log(`[getTaskVendorSuggestions] Searching places with location: "${event.location}", query: "${query}"`);
        const places = await searchPlaces(event.location, query);
        console.log(`[getTaskVendorSuggestions] OpenCage search results:`, places);
        
        suggestedProviders = places.slice(0, 5).map(place => ({
          name: place.name,
          address: place.address,
          phone: place.phone || 'N/A',
          booking_link: place.booking_link || 'N/A'
        }));
      } catch (placesError) {
        console.error(`[getTaskVendorSuggestions] Error fetching providers from Places API for ${category}:`, placesError.message);
        // Fallback to Gemini if places API fails
        category = 'general'; 
      }
    }

    // Fallback or general suggestions from Gemini
    if (category === 'general' || suggestedProviders.length === 0) {
      const generalPrompt = `Suggest vendors for the task: "${taskTitle}" for an event titled "${event.title}" happening on ${event.date.toDateString()} in ${event.location}. Provide 5 suggestions with their names, a brief description, and a relevant contact method (e.g., website, phone number, or email). Format the output as a JSON array of objects, where each object has 'name', 'description', and 'contact' fields.`;
      console.log(`[getTaskVendorSuggestions] Falling back to general Gemini suggestions with prompt:`, generalPrompt);
      const generalResult = await model.generateContent(generalPrompt);
      const generalResponse = await generalResult.response;
      const generalText = generalResponse.text();
      console.log(`[getTaskVendorSuggestions] Gemini general raw response:`, generalText);

      try {
        const jsonMatch = generalText.match(/```json\n([\s\S]*?)\n```/);
        const jsonString = jsonMatch ? jsonMatch[1] : generalText;
        suggestedProviders = JSON.parse(jsonString);
        console.log(`[getTaskVendorSuggestions] Gemini general parsed:`, suggestedProviders);
      } catch (parseError) {
        console.error('Failed to parse Gemini API general suggestions response as JSON:', parseError);
        console.error('Raw Gemini API general suggestions response:', generalText);
        return res.status(500).json({ msg: 'Failed to parse general vendor suggestions from AI. Raw response: ' + generalText });
      }
    }

    res.json({
      task: taskTitle,
      category: category,
      suggested_providers: suggestedProviders
    });

  } catch (err) {
    console.error(`[getTaskVendorSuggestions] Uncaught error: ${err.message}`, err);
    res.status(500).send('Server Error');
  }
};
