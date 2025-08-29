import { generateEmojiPattern, isValidEthereumAddress, formatAddress } from '../emojiHash';

describe('emojiHash', () => {
  describe('generateEmojiPattern', () => {
    it('should generate consistent emoji patterns for the same address', () => {
      const address = '0x1234567890123456789012345678901234567890';
      const pattern1 = generateEmojiPattern(address);
      const pattern2 = generateEmojiPattern(address);
      
      expect(pattern1).toBe(pattern2);
      expect(pattern1.length).toBeGreaterThanOrEqual(3); // 3 emojis
    });

    it('should generate different patterns for different addresses', () => {
      const address1 = '0x1234567890123456789012345678901234567890';
      const address2 = '0x1234567890123456789012345678901234567891';
      
      const pattern1 = generateEmojiPattern(address1);
      const pattern2 = generateEmojiPattern(address2);
      
      expect(pattern1).not.toBe(pattern2);
    });

    it('should handle addresses with and without 0x prefix', () => {
      const addressWith0x = '0x1234567890123456789012345678901234567890';
      const addressWithout0x = '1234567890123456789012345678901234567890';
      
      const pattern1 = generateEmojiPattern(addressWith0x);
      const pattern2 = generateEmojiPattern(addressWithout0x);
      
      expect(pattern1).toBe(pattern2);
    });

    it('should be case insensitive', () => {
      const addressLower = '0x1234567890abcdef1234567890abcdef12345678';
      const addressUpper = '0x1234567890ABCDEF1234567890ABCDEF12345678';
      
      const pattern1 = generateEmojiPattern(addressLower);
      const pattern2 = generateEmojiPattern(addressUpper);
      
      expect(pattern1).toBe(pattern2);
    });
  });

  describe('isValidEthereumAddress', () => {
    it('should validate correct Ethereum addresses', () => {
      expect(isValidEthereumAddress('0x1234567890123456789012345678901234567890')).toBe(true);
      expect(isValidEthereumAddress('1234567890123456789012345678901234567890')).toBe(true);
      expect(isValidEthereumAddress('0xabcdefABCDEF1234567890123456789012345678')).toBe(true);
    });

    it('should reject invalid addresses', () => {
      expect(isValidEthereumAddress('')).toBe(false);
      expect(isValidEthereumAddress('0x123')).toBe(false);
      expect(isValidEthereumAddress('0x12345678901234567890123456789012345678901')).toBe(false);
      expect(isValidEthereumAddress('0x123456789012345678901234567890123456789g')).toBe(false);
      expect(isValidEthereumAddress(null as any)).toBe(false);
      expect(isValidEthereumAddress(undefined as any)).toBe(false);
    });
  });

  describe('formatAddress', () => {
    const longAddress = '0x1234567890123456789012345678901234567890';

    it('should truncate addresses by default', () => {
      const formatted = formatAddress(longAddress);
      expect(formatted).toBe('0x1234...7890');
    });

    it('should show full address when requested', () => {
      const formatted = formatAddress(longAddress, true);
      expect(formatted).toBe(longAddress);
    });

    it('should handle short addresses', () => {
      const shortAddress = '0x1234';
      const formatted = formatAddress(shortAddress);
      expect(formatted).toBe(shortAddress);
    });
  });
});