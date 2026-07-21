async function run() {
  const baseURL = 'https://api.groq.com/openai/v1/chat/completions';
  const fetchHeaders = {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer test' // dummy key for testing error message
  };

  const fetchResponse = await fetch(baseURL, {
    method: 'POST',
    headers: fetchHeaders,
    body: JSON.stringify({
      model: 'llama3-8b-8192',
      messages: [{ role: 'user', content: 'Hi' }],
      stream: true
    })
  });

  if (!fetchResponse.ok) {
    const err = await fetchResponse.text();
    console.error(`API Error: ${fetchResponse.status} ${err}`);
  } else {
    console.log("Success! Status:", fetchResponse.status);
    const text = await fetchResponse.text();
    console.log(text.substring(0, 100));
  }
}
run();
