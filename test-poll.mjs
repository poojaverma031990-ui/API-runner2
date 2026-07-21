async function run() {
  const baseURL = 'https://text.pollinations.ai/openai';
  const fetchHeaders = {
    'Content-Type': 'application/json'
  };

  const fetchResponse = await fetch(baseURL, {
    method: 'POST',
    headers: fetchHeaders,
    body: JSON.stringify({
      model: 'openai',
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
