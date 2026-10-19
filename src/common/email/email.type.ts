import { StreamableFile } from '@nestjs/common';

export interface AttachmentOptions {
  contentType: string;
  fileName: string;
  attachment: StreamableFile;
}
