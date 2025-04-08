// This API route is now a placeholder since we're using browser localStorage
// for chat history instead of a database

export const GET = async (
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) => {
  try {
    const { id } = await params;

    // Since we're using localStorage, we return a message instructing the client
    // to use localStorage instead
    return Response.json(
      {
        message: 'Chat history is now stored in browser localStorage',
        chatId: id
      },
      { status: 200 },
    );
  } catch (err) {
    console.error('Error in getting chat by id: ', err);
    return Response.json(
      { message: 'An error has occurred.' },
      { status: 500 },
    );
  }
};

export const DELETE = async (
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) => {
  try {
    const { id } = await params;

    // Since we're using localStorage, we return a message instructing the client
    // to use localStorage instead
    return Response.json(
      {
        message: 'Chat history is now stored in browser localStorage. Use localStorage.removeItem() to delete chats.',
        chatId: id
      },
      { status: 200 },
    );
  } catch (err) {
    console.error('Error in deleting chat by id: ', err);
    return Response.json(
      { message: 'An error has occurred.' },
      { status: 500 },
    );
  }
};
