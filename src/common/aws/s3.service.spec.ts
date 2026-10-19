import type { Mock } from 'vitest';
import {
  S3Client,
  PutObjectRequest,
  DeleteObjectCommand,
  DeleteObjectCommandInput,
  DeleteObjectCommandOutput,
  PutObjectOutput,
} from '@aws-sdk/client-s3';
import { S3Service } from './s3.service.js';
import { mockClient } from 'aws-sdk-client-mock';
import { Readable } from 'node:stream';
import { firstValueFrom, Observable } from 'rxjs';
import { S3RequestPresigner } from '@aws-sdk/s3-request-presigner';
import { parseUrl } from '@smithy/url-parser';
import { formatUrl } from '@aws-sdk/util-format-url';
import { HttpRequest } from '@smithy/protocol-http';
import { Hash } from '@smithy/hash-node';

// Mock the S3Client and Upload classes
const s3Mock = mockClient(S3Client);
vi.mock('@aws-sdk/lib-storage', () => ({
  Upload: vi.fn().mockImplementation(function () {
    return { done: vi.fn().mockResolvedValue({} as PutObjectOutput) };
  }),
}));

vi.mock('@smithy/hash-node', () => ({
  Hash: {
    bind: vi.fn().mockReturnValue(() => {}),
  },
}));

vi.mock('@aws-sdk/s3-request-presigner');
vi.mock('@aws-sdk/client-s3');
vi.mock('@smithy/url-parser');
vi.mock('@smithy/protocol-http');
vi.mock('@aws-sdk/util-format-url');

describe('S3Service', () => {
  let s3Service: S3Service;

  beforeEach(() => {
    s3Service = new S3Service();
    s3Mock.reset();
    vi.clearAllMocks();
  });

  describe('upload', () => {
    it('should upload a file to S3', async () => {
      const s3Params: PutObjectRequest = {
        Bucket: 'test-bucket',
        Key: 'test-key',
        Body: Readable.from('test-body'),
      };

      const output = await firstValueFrom(s3Service.upload(s3Params));

      expect(output).toEqual({});
    });
  });

  describe('delete', () => {
    it('should delete a file from S3', async () => {
      const s3Params: DeleteObjectCommandInput = {
        Bucket: 'test-bucket',
        Key: 'test-key',
      };

      const deleteResponse: DeleteObjectCommandOutput = { $metadata: {} };
      s3Mock.on(DeleteObjectCommand).resolves(deleteResponse);

      const output = await firstValueFrom(s3Service.delete(s3Params));

      expect(output).toEqual(deleteResponse);
    });
  });

  describe('createPresignedUrlWithoutClient', () => {
    it('should return an Observable of a presigned URL', async () => {
      const mockPresignedUrl = 'https://example.com/presigned-url';
      (parseUrl as Mock).mockReturnValue({ hostname: 'test.com' });
      (formatUrl as Mock).mockReturnValue(mockPresignedUrl);
      (HttpRequest as unknown as Mock).mockImplementation(function () {
        return {};
      });
      (S3RequestPresigner as Mock).mockImplementation(function () {
        return { presign: vi.fn().mockResolvedValue({}) };
      });
      (Hash.bind as Mock).mockReturnValue(() => {});

      const result = s3Service.createPresignedUrlWithoutClient({
        accessKeyId: 'test-access-key',
        bucket: 'test-bucket',
        expiresInSeconds: 300,
        key: 'test-key',
        region: 'region',
        secretAccessKey: 'test-secret-key',
      });

      expect(result).toBeInstanceOf(Observable);

      const url = await firstValueFrom(result);

      expect(url).toBe(mockPresignedUrl);
      expect(parseUrl).toHaveBeenCalledWith(
        'https://test-bucket.s3.region.amazonaws.com/test-key',
      );
      expect(S3RequestPresigner).toHaveBeenCalledWith({
        region: 'region',
        credentials: {
          accessKeyId: 'test-access-key',
          secretAccessKey: 'test-secret-key',
        },
        sha256: expect.any(Function),
      });
    });

    it('should handle presigner errors', async () => {
      const error = new Error('Failed to generate presigned URL');
      (S3RequestPresigner as Mock).mockImplementation(function () {
        return { presign: vi.fn().mockRejectedValue(error) };
      });

      const result = s3Service.createPresignedUrlWithoutClient({
        accessKeyId: 'test-access-key',
        bucket: 'test-bucket',
        expiresInSeconds: 300,
        key: 'test-key',
        region: 'region',
        secretAccessKey: 'test-secret-key',
      });

      await expect(firstValueFrom(result)).rejects.toBe(error);
    });
  });
});
