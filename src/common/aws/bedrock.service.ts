import { Injectable, Logger } from '@nestjs/common';
import {
  BedrockRuntimeClient,
  ConverseCommand,
  ConverseCommandInput,
  ConverseCommandOutput,
  Tool,
  ToolConfiguration,
} from '@aws-sdk/client-bedrock-runtime';
import { from, Observable } from 'rxjs';

export interface BedrockConverseOptions {
  readonly modelId: string;
  readonly system?: string;
  readonly prompt: string;
  readonly tools?: ReadonlyArray<Tool>;
  readonly toolChoice?: ToolConfiguration['toolChoice'];
  readonly temperature?: number;
  readonly maxTokens?: number;
}

@Injectable()
export class BedrockService {
  private readonly logger = new Logger(BedrockService.name);
  private readonly client: BedrockRuntimeClient;

  constructor() {
    this.client = new BedrockRuntimeClient({});
  }

  converse(options: BedrockConverseOptions): Observable<ConverseCommandOutput> {
    const {
      modelId,
      system,
      prompt,
      tools,
      toolChoice,
      temperature = 0,
      maxTokens = 4096,
    } = options;

    const toolConfig: ConverseCommandInput['toolConfig'] =
      tools && tools.length > 0
        ? {
            tools: [...tools],
            ...(toolChoice && { toolChoice }),
          }
        : undefined;

    const input: ConverseCommandInput = {
      modelId,
      messages: [
        {
          role: 'user',
          content: [{ text: prompt }],
        },
      ],
      ...(system && {
        system: [{ text: system }],
      }),
      inferenceConfig: {
        temperature,
        maxTokens,
      },
      ...(toolConfig && { toolConfig }),
    };

    this.logger.debug({ method: this.converse.name, modelId, prompt });

    return from(this.client.send(new ConverseCommand(input)));
  }
}
