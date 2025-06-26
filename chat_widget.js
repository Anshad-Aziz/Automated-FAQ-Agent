const chatToggle = document.getElementById('chat-toggle');
const chatWindow = document.getElementById('chat-window');
const chatClose = document.getElementById('chat-close');
const chatMessages = document.getElementById('chat-messages');
const chatInput = document.getElementById('chat-input');

// API Configuration
const API_KEY = LYZR_API_KEY; // Lyzr.ai API key
const API_URL = LYZR_API_URL // Base URL from agent config
const RAG_ID = LYZR_RAG_ID; // RAG ID from agent config

// Toggle chat window visibility
chatToggle.addEventListener('click', () => {
  chatWindow.classList.toggle('hidden');
});

chatClose.addEventListener('click', () => {
  chatWindow.classList.add('hidden');
});

// Handle user input (send on Enter key)
chatInput.addEventListener('keypress', async (e) => {
  if (e.key === 'Enter' && chatInput.value.trim()) {
    const userQuery = chatInput.value.trim();
    addMessage(userQuery, 'user');
    chatInput.value = '';

    try {
      const response = await sendQueryToLyzr(userQuery);
      addMessage(response.answer, 'bot');
    } catch (error) {
      addMessage('Sorry, something went wrong. Please try again or contact support@learnflow.com.', 'bot');
    }
  }
});

// Add message to chat window
function addMessage(text, type) {
  const messageDiv = document.createElement('div');
  messageDiv.classList.add('message', type);
  messageDiv.textContent = text;
  chatMessages.appendChild(messageDiv);
  chatMessages.scrollTop = chatMessages.scrollHeight; // Auto-scroll to bottom
}

// Send query to Lyzr.ai API
async function sendQueryToLyzr(query) {
  const response = await fetch(`${API_URL}/query/${RAG_ID}`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ query })
  });

  if (!response.ok) {
    throw new Error(`API error: ${response.status}`);
  }

  const data = await response.json();
  // Assuming the API returns a JSON response with an 'answer' field
  // Append the agent's sign-off
  return {
    answer: `${data.answer} Is there anything else I can help you with?`
  };
}