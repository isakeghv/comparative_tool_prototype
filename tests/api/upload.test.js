import { describe, it, expect } from 'vitest';
import request from 'supertest';
import { setup } from '@nuxt/test-utils';
import path from 'path';

await setup({ server: true });

// Positive test: Uploading a valid PNG image
describe('POST /api/upload', () => {
    it('should upload a valid image file', async () => {
      const imagePath = path.resolve(__dirname, 'fixtures/test-image.jpg');
  
      const res = await request('http://localhost:3000')
        .post('/api/upload')
        .attach('file', imagePath); // send real file
  
      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.source).toMatch(/^\/artifacts\//);
    });

    // Edge/Negative test: Reject large file over 10MB
  it('should reject large files', async () => {
    const largeBuffer = Buffer.alloc(11 * 1024 * 1024); // 11MB
    const res = await request('http://localhost:3000')
      .post('/api/upload')
      .attach('file', largeBuffer, {
        filename: 'large.jpg',
        contentType: 'image/jpeg'
      });

    expect(res.body.success).toBe(false);
    expect(res.body.message).toContain('too large');
  });

  // Negative test: Reject .exe file
  it('should reject unsupported file types', async () => {
    const res = await request('http://localhost:3000')
      .post('/api/upload')
      .attach('file', Buffer.from('hello'), {
        filename: 'test.exe',
        contentType: 'application/octet-stream'
      });

    expect(res.body.success).toBe(false);
    expect(res.body.message).toContain('Invalid file type');
  });
});
