// This API route is now a placeholder since we're using browser localStorage
// for chat history instead of a database

export const GET = async (req: Request) => {
  try {
    // Since we're using localStorage, we return a message instructing the client
    // to use localStorage instead
    return Response.json(
      {
        message: 'Chat history is now stored in browser localStorage',
        chats: []
      },
      { status: 200 },
    );
  } catch (err) {
    console.error('Error in getting chats: ', err);
    return Response.json(
      { message: 'An error has occurred.' },
      { status: 500 },
    );
  }
};
