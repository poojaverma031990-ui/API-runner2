async function run() {
  const baseURL = 'https://text.pollinations.ai/openai';
  const fetchHeaders = {
    'Content-Type': 'application/json'
  };

  for(let i=0; i<5; i++) {
    const fetchResponse = await fetch(baseURL, {
      method: 'POST',
      headers: fetchHeaders,
      body: JSON.stringify({
        model: 'openai',
        messages: [{ role: 'user', content: 'Hi ' + i }],
        stream: true
      })
    });

    if (!fetchResponse.ok) {
      const err = await fetchResponse.text();
      console.error(`Req ${i} API Error: ${fetchResponse.status} ${err}`);
    } else {
      console.log(`Req ${i} Success! Status:`, fetchResponse.status);
    }
  }
}
run();
