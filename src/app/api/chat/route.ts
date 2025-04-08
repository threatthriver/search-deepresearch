import prompts from '@/lib/prompts';
import MetaSearchAgent from '@/lib/search/metaSearchAgent';
import crypto from 'crypto';
import { AIMessage, BaseMessage, HumanMessage } from '@langchain/core/messages';
import { EventEmitter } from 'stream';
import {
  getAvailableChatModelProviders,
  getAvailableEmbeddingModelProviders,
} from '@/lib/providers';
import { getFileDetails } from '@/lib/utils/files';
import { BaseChatModel } from '@langchain/core/language_models/chat_models';
import { searchHandlers } from '@/lib/search';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

type Message = {
  messageId: string;
  chatId: string;
  content: string;
};

type ChatModel = {
  provider: string;
  name: string;
};

type EmbeddingModel = {
  provider: string;
  name: string;
};

type Body = {
  message: Message;
  optimizationMode: 'speed' | 'balanced' | 'quality';
  focusMode: string;
  history: Array<[string, string]>;
  files: Array<string>;
  chatModel: ChatModel;
  embeddingModel: EmbeddingModel;
  systemInstructions: string;
};

const handleEmitterEvents = async (
  stream: EventEmitter,
  writer: WritableStreamDefaultWriter,
  encoder: TextEncoder,
  aiMessageId: string,
) => {
  let recievedMessage = '';
  let sources: any[] = [];

  stream.on('data', (data) => {
    const parsedData = JSON.parse(data);
    if (parsedData.type === 'response') {
      writer.write(
        encoder.encode(
          JSON.stringify({
            type: 'message',
            data: parsedData.data,
            messageId: aiMessageId,
          }) + '\n',
        ),
      );

      recievedMessage += parsedData.data;
    } else if (parsedData.type === 'sources') {
      writer.write(
        encoder.encode(
          JSON.stringify({
            type: 'sources',
            data: parsedData.data,
            messageId: aiMessageId,
          }) + '\n',
        ),
      );

      sources = parsedData.data;
    }
  });
  stream.on('end', () => {
    writer.write(
      encoder.encode(
        JSON.stringify({
          type: 'messageEnd',
          messageId: aiMessageId,
        }) + '\n',
      ),
    );
    writer.close();

    // We've removed the database operations here
    // Messages are now stored in browser localStorage instead
  });
  stream.on('error', (data) => {
    const parsedData = JSON.parse(data);
    writer.write(
      encoder.encode(
        JSON.stringify({
          type: 'error',
          data: parsedData.data,
        }),
      ),
    );
    writer.close();
  });
};

// This function is now a no-op since we're using browser localStorage for history
const handleHistorySave = async (
  message: Message,
  humanMessageId: string,
  focusMode: string,
  files: string[],
) => {
  // History is now managed in the browser via localStorage
  // See useChatHistory.ts for implementation
  return;
};

export const POST = async (req: Request) => {
  try {
    const body = (await req.json()) as Body;
    const { message } = body;

    if (message.content === '') {
      return Response.json(
        {
          message: 'Please provide a message to process',
        },
        { status: 400 },
      );
    }

    const [chatModelProviders, embeddingModelProviders] = await Promise.all([
      getAvailableChatModelProviders(),
      getAvailableEmbeddingModelProviders(),
    ]);

    const chatModelProvider =
      chatModelProviders[
        body.chatModel?.provider || Object.keys(chatModelProviders)[0]
      ];
    const chatModel =
      chatModelProvider[
        body.chatModel?.name || Object.keys(chatModelProvider)[0]
      ];

    // Safely get the embedding provider and model
    const embeddingProviderKey = body.embeddingModel?.provider ||
      (Object.keys(embeddingModelProviders).length > 0 ? Object.keys(embeddingModelProviders)[0] : 'deep_research');

    const embeddingProvider = embeddingModelProviders[embeddingProviderKey] || {};

    // Safely get the embedding model
    const embeddingModelKey = body.embeddingModel?.name ||
      (Object.keys(embeddingProvider).length > 0 ? Object.keys(embeddingProvider)[0] : '');

    const embeddingModel = embeddingProvider[embeddingModelKey];

    let llm: BaseChatModel | undefined;
    let embedding = embeddingModel?.model;

    if (chatModelProvider && chatModel) {
      llm = chatModel.model;
    }

    if (!llm) {
      return Response.json({ error: 'Invalid chat model' }, { status: 400 });
    }

    // Make embedding optional for chat functionality
    // If no embedding model is available, we can still use the chat model
    if (!embedding) {
      console.warn('No embedding model available, proceeding with chat only');
    }

    const humanMessageId =
      message.messageId ?? crypto.randomBytes(7).toString('hex');
    const aiMessageId = crypto.randomBytes(7).toString('hex');

    // Handle case where history might be undefined or not an array
    const history: BaseMessage[] = Array.isArray(body.history)
      ? body.history.map((msg) => {
          if (msg[0] === 'human') {
            return new HumanMessage({
              content: msg[1],
            });
          } else {
            return new AIMessage({
              content: msg[1],
            });
          }
        })
      : [];

    const handler = searchHandlers[body.focusMode];

    if (!handler) {
      return Response.json(
        {
          message: 'Invalid focus mode',
        },
        { status: 400 },
      );
    }

    const stream = await handler.searchAndAnswer(
      message.content,
      history,
      llm,
      embedding,
      body.optimizationMode,
      body.files,
      body.systemInstructions,
    );

    const responseStream = new TransformStream();
    const writer = responseStream.writable.getWriter();
    const encoder = new TextEncoder();

    handleEmitterEvents(stream, writer, encoder, aiMessageId);
    handleHistorySave(message, humanMessageId, body.focusMode, body.files);

    return new Response(responseStream.readable, {
      headers: {
        'Content-Type': 'text/event-stream',
        Connection: 'keep-alive',
        'Cache-Control': 'no-cache, no-transform',
      },
    });
  } catch (err) {
    console.error('An error occurred while processing chat request:', err);

    // Create a more detailed error message
    let errorMessage = 'An error occurred while processing chat request';

    // Check for specific error types
    if (err instanceof Error) {
      if (err.message.includes('ECONNREFUSED')) {
        errorMessage = 'Could not connect to search service. SearxNG may not be running or configured correctly.';
      } else if (err.message.includes('Invalid URL')) {
        errorMessage = 'Invalid search service URL. Please check your SearxNG configuration.';
      }
    }

    return Response.json(
      { message: errorMessage, error: err instanceof Error ? err.message : String(err) },
      { status: 500 },
    );
  }
};
