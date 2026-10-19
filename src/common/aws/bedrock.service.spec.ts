import {
  BedrockRuntimeClient,
  ConverseCommand,
  ConverseCommandOutput,
  Tool,
} from '@aws-sdk/client-bedrock-runtime';
import { mockClient } from 'aws-sdk-client-mock';
import { firstValueFrom, Observable } from 'rxjs';
import { BedrockService } from './bedrock.service.js';

const bedrockMock = mockClient(BedrockRuntimeClient);

describe('BedrockService', () => {
  let bedrockService: BedrockService;

  beforeEach(() => {
    bedrockService = new BedrockService();
    bedrockMock.reset();
  });

  describe('converse', () => {
    const mockResponse: ConverseCommandOutput = {
      $metadata: {},
      metrics: { latencyMs: 100 },
      output: {
        message: {
          role: 'assistant',
          content: [{ text: 'Hola' }],
        },
      },
      stopReason: 'end_turn',
      usage: {
        inputTokens: 10,
        outputTokens: 5,
        totalTokens: 15,
      },
    };

    it('should return an Observable', () => {
      bedrockMock.on(ConverseCommand).resolves(mockResponse);

      const result = bedrockService.converse({
        modelId: 'anthropic.claude-3-haiku-20240307-v1:0',
        prompt: 'Translate ["Hello"] to Spanish',
      });

      expect(result).toBeInstanceOf(Observable);
    });

    it('should send a basic prompt and return the response', async () => {
      bedrockMock.on(ConverseCommand).resolves(mockResponse);

      const output = await firstValueFrom(
        bedrockService.converse({
          modelId: 'anthropic.claude-3-haiku-20240307-v1:0',
          prompt: 'Translate ["Hello"] to Spanish',
        }),
      );

      expect(output).toEqual(mockResponse);
    });

    it('should include system message when provided', async () => {
      bedrockMock.on(ConverseCommand).resolves(mockResponse);

      await firstValueFrom(
        bedrockService.converse({
          modelId: 'anthropic.claude-3-haiku-20240307-v1:0',
          system: 'Translate an array of texts.',
          prompt: 'Translate ["Hello"] to Spanish',
        }),
      );

      const [call] = bedrockMock.commandCalls(ConverseCommand);
      expect(call.args[0].input.system).toEqual([
        { text: 'Translate an array of texts.' },
      ]);
    });

    it('should not include system message when not provided', async () => {
      bedrockMock.on(ConverseCommand).resolves(mockResponse);

      await firstValueFrom(
        bedrockService.converse({
          modelId: 'anthropic.claude-3-haiku-20240307-v1:0',
          prompt: 'Translate ["Hello"] to Spanish',
        }),
      );

      const [call] = bedrockMock.commandCalls(ConverseCommand);
      expect(call.args[0].input.system).toBeUndefined();
    });

    it('should include toolConfig when tools are provided', async () => {
      const tool: Tool = {
        toolSpec: {
          name: 'save_translations',
          description: 'Save translated texts.',
          inputSchema: {
            json: {
              type: 'object',
              properties: {
                translations: { type: 'array', items: { type: 'string' } },
              },
              required: ['translations'],
            },
          },
        },
      };

      const toolUseResponse: ConverseCommandOutput = {
        $metadata: {},
        metrics: { latencyMs: 150 },
        output: {
          message: {
            role: 'assistant',
            content: [
              {
                toolUse: {
                  toolUseId: 'tool-1',
                  name: 'save_translations',
                  input: { translations: ['Hola'] },
                },
              },
            ],
          },
        },
        stopReason: 'tool_use',
        usage: { inputTokens: 20, outputTokens: 10, totalTokens: 30 },
      };
      bedrockMock.on(ConverseCommand).resolves(toolUseResponse);

      const output = await firstValueFrom(
        bedrockService.converse({
          modelId: 'anthropic.claude-3-haiku-20240307-v1:0',
          prompt: 'Translate ["Hello"] to Spanish',
          tools: [tool],
          toolChoice: { tool: { name: 'save_translations' } },
        }),
      );

      expect(output).toEqual(toolUseResponse);
      const [call] = bedrockMock.commandCalls(ConverseCommand);
      const { toolConfig } = call.args[0].input;
      expect(toolConfig?.tools).toHaveLength(1);
      expect(toolConfig?.tools?.[0].toolSpec?.name).toBe('save_translations');
      expect(toolConfig?.toolChoice).toEqual({
        tool: { name: 'save_translations' },
      });
    });

    it('should not include toolConfig when tools are empty', async () => {
      bedrockMock.on(ConverseCommand).resolves(mockResponse);

      await firstValueFrom(
        bedrockService.converse({
          modelId: 'anthropic.claude-3-haiku-20240307-v1:0',
          prompt: 'Translate ["Hello"] to Spanish',
          tools: [],
        }),
      );

      const [call] = bedrockMock.commandCalls(ConverseCommand);
      expect(call.args[0].input.toolConfig).toBeUndefined();
    });

    it('should use default temperature and maxTokens', async () => {
      bedrockMock.on(ConverseCommand).resolves(mockResponse);

      await firstValueFrom(
        bedrockService.converse({
          modelId: 'anthropic.claude-3-haiku-20240307-v1:0',
          prompt: 'Hello',
        }),
      );

      const [call] = bedrockMock.commandCalls(ConverseCommand);
      expect(call.args[0].input.inferenceConfig).toEqual({
        temperature: 0,
        maxTokens: 4096,
      });
    });

    it('should use custom temperature and maxTokens', async () => {
      bedrockMock.on(ConverseCommand).resolves(mockResponse);

      await firstValueFrom(
        bedrockService.converse({
          modelId: 'anthropic.claude-3-haiku-20240307-v1:0',
          prompt: 'Hello',
          temperature: 0.7,
          maxTokens: 2048,
        }),
      );

      const [call] = bedrockMock.commandCalls(ConverseCommand);
      expect(call.args[0].input.inferenceConfig).toEqual({
        temperature: 0.7,
        maxTokens: 2048,
      });
    });

    it('should handle Bedrock errors', async () => {
      const error = new Error('Bedrock service unavailable');
      bedrockMock.on(ConverseCommand).rejects(error);

      await expect(
        firstValueFrom(
          bedrockService.converse({
            modelId: 'anthropic.claude-3-haiku-20240307-v1:0',
            prompt: 'Hello',
          }),
        ),
      ).rejects.toBe(error);
    });

    it('should construct the correct message format', async () => {
      bedrockMock.on(ConverseCommand).resolves(mockResponse);

      await firstValueFrom(
        bedrockService.converse({
          modelId: 'anthropic.claude-3-haiku-20240307-v1:0',
          prompt: 'Translate ["Hello","Goodbye"] to French',
        }),
      );

      const [call] = bedrockMock.commandCalls(ConverseCommand);
      expect(call.args[0].input.modelId).toBe(
        'anthropic.claude-3-haiku-20240307-v1:0',
      );
      expect(call.args[0].input.messages).toEqual([
        {
          role: 'user',
          content: [{ text: 'Translate ["Hello","Goodbye"] to French' }],
        },
      ]);
    });
  });
});
