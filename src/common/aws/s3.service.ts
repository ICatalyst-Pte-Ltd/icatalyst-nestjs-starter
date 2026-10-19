import { Injectable } from '@nestjs/common';
import {
  S3Client,
  PutObjectRequest,
  PutObjectOutput,
  DeleteObjectCommandInput,
  DeleteObjectCommandOutput,
  DeleteObjectCommand,
} from '@aws-sdk/client-s3';
import { Upload } from '@aws-sdk/lib-storage';
import { from, map, Observable } from 'rxjs';
import { S3RequestPresigner } from '@aws-sdk/s3-request-presigner';
import { parseUrl } from '@smithy/url-parser';
import { formatUrl } from '@aws-sdk/util-format-url';
import { Hash } from '@smithy/hash-node';
import { HttpRequest } from '@smithy/protocol-http';
import { S3Config } from './s3.config.js';

@Injectable()
export class S3Service {
  private s3Client: S3Client;

  constructor(config: S3Config) {
    // the endpoint can be overridden with the AWS_ENDPOINT_URL or
    // AWS_ENDPOINT_URL_S3 environment variables, e.g., for LocalStack
    this.s3Client = new S3Client({ forcePathStyle: config.forcePathStyle });
  }

  upload(s3Params: PutObjectRequest): Observable<PutObjectOutput> {
    const uploader = new Upload({
      client: this.s3Client,
      params: s3Params,
    });

    return from(uploader.done());
  }

  delete(
    s3Params: DeleteObjectCommandInput,
  ): Observable<DeleteObjectCommandOutput> {
    const command = new DeleteObjectCommand(s3Params);
    return from(this.s3Client.send(command));
  }

  createPresignedUrlWithoutClient({
    accessKeyId,
    bucket,
    expiresInSeconds,
    key,
    region,
    secretAccessKey,
  }: {
    accessKeyId: string;
    bucket: string;
    expiresInSeconds: number;
    key: string;
    region: string;
    secretAccessKey: string;
  }): Observable<string> {
    const url = parseUrl(`https://${bucket}.s3.${region}.amazonaws.com/${key}`);
    const presigner = new S3RequestPresigner({
      region: region,
      credentials: {
        accessKeyId: accessKeyId,
        secretAccessKey: secretAccessKey,
      },
      sha256: Hash.bind(null, 'sha256'),
    });

    return from(
      presigner.presign(new HttpRequest(url), { expiresIn: expiresInSeconds }),
    ).pipe(map(formatUrl));
  }
}
