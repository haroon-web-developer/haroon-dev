
export async function chatWithAssistant(prompt) {
  try {
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ prompt }),
    });

    if (!response.ok) {
      let errorMessage = `Server responded with status: ${response.status}`;
      try {
        const errData = await response.json();
        if (errData && errData.error) {
          errorMessage = `Server Error (${response.status}): ${errData.error}${errData.message ? ' - ' + errData.message : ''}`;
        }
      } catch (e) {
        // Fallback to text if not JSON
        try {
          const errText = await response.text();
          if (errText) {
            errorMessage += ` - ${errText}`;
          }
        } catch (_) {}
      }
      throw new Error(errorMessage);
    }

    const data = await response.json();
    return data.text || "I'm sorry, I couldn't process that request.";
  } catch (error) {
    console.error("Assistant Error:", error);
    return "I'm having trouble connecting to Haroon's brain right now. Please try again later!";
  }
}
