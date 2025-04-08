import Cerebras from '@cerebras/cerebras_cloud_sdk';

// Example script to demonstrate using the Cerebras API directly
async function main() {
  // Initialize the Cerebras client
  const cerebras = new Cerebras({
    apiKey: process.env['CEREBRAS_API_KEY']
  });

  // Create a chat completion with streaming
  const stream = await cerebras.chat.completions.create({
    messages: [
      {
        "role": "system",
        "content": "You are a helpful AI assistant."
      },
      {
        "role": "user",
        "content": "Explain quantum computing in simple terms."
      }
    ],
    model: 'llama-3.3-70b',
    stream: true,
    max_completion_tokens: 2048,
    temperature: 0.2,
    top_p: 1
  });

  // Process the streaming response
  console.log("Response from Cerebras Llama 3.3 70B model:");
  for await (const chunk of stream) {
    // Add type assertion to handle the unknown type
    const typedChunk = chunk as { choices: Array<{ delta?: { content?: string } }> };
    process.stdout.write(typedChunk.choices[0]?.delta?.content || '');
  }
  console.log("\n\nResponse complete!");
}

// Run the example
main().catch(error => {
  console.error("Error:", error);
});
