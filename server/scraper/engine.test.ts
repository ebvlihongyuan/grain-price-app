/**
 * 爬虫执行引擎单元测试
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { scrapeWebsite } from './engine';
import axios from 'axios';

// Mock axios
vi.mock('axios');

describe('Scraper Engine', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('scrapeWebsite', () => {
    it('should extract price from HTML with 收购价 pattern', async () => {
      const mockHtml = `
        <html>
          <body>
            <div>收购价格：2100元/吨</div>
          </body>
        </html>
      `;

      vi.mocked(axios.get).mockResolvedValueOnce({ data: mockHtml });

      const result = await scrapeWebsite('http://example.com');

      expect(result).not.toBeNull();
      expect(result?.price).toBe(210000); // 2100 * 100
    });

    it('should extract price from HTML with 价格 pattern', async () => {
      const mockHtml = `
        <html>
          <body>
            <div>当前价格：2050元/吨</div>
          </body>
        </html>
      `;

      vi.mocked(axios.get).mockResolvedValueOnce({ data: mockHtml });

      const result = await scrapeWebsite('http://example.com');

      expect(result).not.toBeNull();
      expect(result?.price).toBe(205000); // 2050 * 100
    });

    it('should return null if price cannot be extracted', async () => {
      const mockHtml = `
        <html>
          <body>
            <div>No price information</div>
          </body>
        </html>
      `;

      vi.mocked(axios.get).mockResolvedValueOnce({ data: mockHtml });

      const result = await scrapeWebsite('http://example.com');

      expect(result).toBeNull();
    });

    it('should handle network errors gracefully', async () => {
      vi.mocked(axios.get).mockRejectedValueOnce(new Error('Network error'));

      const result = await scrapeWebsite('http://example.com');

      expect(result).toBeNull();
    });

    it('should extract price from table structure', async () => {
      const mockHtml = `
        <html>
          <body>
            <table>
              <tr>
                <td>收购价</td>
                <td>2075元/吨</td>
              </tr>
            </table>
          </body>
        </html>
      `;

      vi.mocked(axios.get).mockResolvedValueOnce({ data: mockHtml });

      const result = await scrapeWebsite('http://example.com');

      expect(result).not.toBeNull();
      expect(result?.price).toBe(207500); // 2075 * 100
    });

    it('should handle decimal prices', async () => {
      const mockHtml = `
        <html>
          <body>
            <div>收购价：2100.5元/吨</div>
          </body>
        </html>
      `;

      vi.mocked(axios.get).mockResolvedValueOnce({ data: mockHtml });

      const result = await scrapeWebsite('http://example.com');

      expect(result).not.toBeNull();
      expect(result?.price).toBe(210050); // 2100.5 * 100
    });
  });
});
