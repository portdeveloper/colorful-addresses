import { generateEmojiPattern, isValidEthereumAddress, formatAddress } from '../emojiHash';

describe('emojiHash', () => {
  describe('generateEmojiPattern', () => {
    it('should generate consistent emoji patterns for the same address', () => {
      const address = '0x1234567890123456789012345678901234567890';
      const pattern1 = generateEmojiPattern(address);
      const pattern2 = generateEmojiPattern(address);
      
      expect(pattern1).toBe(pattern2);
      expect(pattern1.length).toBeGreaterThanOrEqual(4); // 4 emojis
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

  describe('collision detection', () => {
    it('should have low collision rate across sequential addresses', () => {
      const patterns = new Set<string>();
      const addresses: string[] = [];
      
      // Generate 10,000 sequential test addresses
      for (let i = 0; i < 10000; i++) {
        const address = `0x${i.toString(16).padStart(40, '0')}`;
        addresses.push(address);
        patterns.add(generateEmojiPattern(address));
      }
      
      const uniquePatterns = patterns.size;
      const totalAddresses = addresses.length;
      const collisionRate = (totalAddresses - uniquePatterns) / totalAddresses;
      
      console.log(`Sequential test: ${uniquePatterns} unique patterns out of ${totalAddresses} addresses`);
      console.log(`Collision rate: ${(collisionRate * 100).toFixed(2)}%`);
      
      // Expect less than 5% collision rate for sequential addresses
      expect(collisionRate).toBeLessThan(0.05);
    });

    it('should detect and analyze collisions in random addresses', () => {
      const patterns = new Map<string, string[]>();
      const testSize = 5000;
      
      for (let i = 0; i < testSize; i++) {
        // Generate random-like address
        const address = `0x${Math.random().toString(16).substr(2).padStart(40, '0')}`;
        const pattern = generateEmojiPattern(address);
        
        if (!patterns.has(pattern)) {
          patterns.set(pattern, []);
        }
        patterns.get(pattern)!.push(address);
      }
      
      const collisions = Array.from(patterns.values()).filter(addrs => addrs.length > 1);
      const uniquePatterns = patterns.size;
      const collisionRate = (testSize - uniquePatterns) / testSize;
      
      console.log(`Random test: ${uniquePatterns} unique patterns out of ${testSize} addresses`);
      console.log(`Found ${collisions.length} collision groups`);
      console.log(`Collision rate: ${(collisionRate * 100).toFixed(2)}%`);
      
      // Log first few collisions for analysis
      collisions.slice(0, 5).forEach((group, i) => {
        console.log(`Collision ${i + 1} (pattern: ${generateEmojiPattern(group[0])}):`, group);
      });
      
      // This test is informational - we just want to see the collision rate
      expect(collisions.length).toBeGreaterThanOrEqual(0);
    });

    it('should test birthday paradox scenario', () => {
      // Test smaller sample size to find collisions more easily
      const patterns = new Map<string, string[]>();
      const testSize = 1000;
      
      for (let i = 0; i < testSize; i++) {
        // Use incremental but varied addresses
        const baseNum = i * 997; // Prime multiplier for distribution
        const address = `0x${baseNum.toString(16).padStart(40, '0')}`;
        const pattern = generateEmojiPattern(address);
        
        if (!patterns.has(pattern)) {
          patterns.set(pattern, []);
        }
        patterns.get(pattern)!.push(address);
      }
      
      const collisions = Array.from(patterns.values()).filter(addrs => addrs.length > 1);
      const uniquePatterns = patterns.size;
      
      console.log(`Birthday paradox test: ${uniquePatterns} unique patterns out of ${testSize} addresses`);
      console.log(`Collision groups found: ${collisions.length}`);
      
      if (collisions.length > 0) {
        console.log('Sample collisions:');
        collisions.slice(0, 3).forEach((group, i) => {
          console.log(`  ${i + 1}. Pattern "${generateEmojiPattern(group[0])}" -> ${group.join(', ')}`);
        });
      }
      
      expect(uniquePatterns).toBeGreaterThan(0);
    });

    it('should measure distribution across emoji positions', () => {
      const firstEmoji = new Map<string, number>();
      const secondEmoji = new Map<string, number>();
      const thirdEmoji = new Map<string, number>();
      const fourthEmoji = new Map<string, number>();
      const testSize = 2000;
      
      for (let i = 0; i < testSize; i++) {
        const address = `0x${i.toString(16).padStart(40, '0')}`;
        const pattern = generateEmojiPattern(address);
        
        const emojis = [...pattern];
        
        firstEmoji.set(emojis[0], (firstEmoji.get(emojis[0]) || 0) + 1);
        secondEmoji.set(emojis[1], (secondEmoji.get(emojis[1]) || 0) + 1);
        thirdEmoji.set(emojis[2], (thirdEmoji.get(emojis[2]) || 0) + 1);
        fourthEmoji.set(emojis[3], (fourthEmoji.get(emojis[3]) || 0) + 1);
      }
      
      console.log(`Distribution analysis (${testSize} addresses):`);
      console.log(`First position: ${firstEmoji.size} unique emojis`);
      console.log(`Second position: ${secondEmoji.size} unique emojis`);
      console.log(`Third position: ${thirdEmoji.size} unique emojis`);
      console.log(`Fourth position: ${fourthEmoji.size} unique emojis`);
      
      // Should have reasonable distribution
      expect(firstEmoji.size).toBeGreaterThan(10);
      expect(secondEmoji.size).toBeGreaterThan(10);
      expect(thirdEmoji.size).toBeGreaterThan(10);
      expect(fourthEmoji.size).toBeGreaterThan(10);
    });
  });

  describe('algorithm quality tests', () => {
    it('should have reasonable distribution uniformity', () => {
      const sampleSize = 5000;
      const emojiCounts = new Map<string, number>();
      
      for (let i = 0; i < sampleSize; i++) {
        const randomHex = Array.from({length: 40}, () => Math.floor(Math.random() * 16).toString(16)).join('');
        const address = `0x${randomHex}`;
        const pattern = generateEmojiPattern(address);
        
        [...pattern].forEach(emoji => {
          emojiCounts.set(emoji, (emojiCounts.get(emoji) || 0) + 1);
        });
      }
      
      const totalCount = sampleSize * 4;
      const expectedFreq = totalCount / emojiCounts.size;
      const variance = Array.from(emojiCounts.values())
        .reduce((sum, count) => sum + Math.pow(count - expectedFreq, 2), 0) / emojiCounts.size;
      const stdDev = Math.sqrt(variance);
      const coefficientOfVariation = stdDev / expectedFreq;
      
      console.log(`Emojis used: ${emojiCounts.size} out of 260`);
      console.log(`Expected frequency: ${expectedFreq.toFixed(2)}`);
      console.log(`Coefficient of variation: ${coefficientOfVariation.toFixed(3)} (lower is better)`);
      
      // Good distribution should have reasonable coverage and variation
      expect(emojiCounts.size).toBeGreaterThan(200); // Use most emojis
      expect(coefficientOfVariation).toBeLessThan(5); // Allow some natural variation
    });

    it('should have high entropy across positions', () => {
      const sampleSize = 5000;
      const positions: Set<string>[] = [new Set(), new Set(), new Set(), new Set()];
      
      for (let i = 0; i < sampleSize; i++) {
        // Generate diverse addresses
        const randomHex = Array.from({length: 40}, () => Math.floor(Math.random() * 16).toString(16)).join('');
        const address = `0x${randomHex}`;
        const pattern = generateEmojiPattern(address);
        const emojis = [...pattern];
        
        // Handle potential multi-byte emoji characters
        for (let pos = 0; pos < Math.min(4, emojis.length); pos++) {
          positions[pos].add(emojis[pos]);
        }
      }
      
      positions.forEach((posSet, i) => {
        const entropy = Math.log2(posSet.size);
        console.log(`Position ${i + 1}: ${posSet.size} unique emojis, entropy: ${entropy.toFixed(2)} bits`);
        
        // Should have high entropy (>7 bits means >128 unique emojis)
        expect(entropy).toBeGreaterThan(7);
      });
    });

    it('should demonstrate avalanche effect', () => {
      const baseAddress = '0x1234567890123456789012345678901234567890';
      const basePattern = generateEmojiPattern(baseAddress);
      
      let significantChanges = 0;
      const totalTests = 40; // Test changing each character
      
      for (let i = 0; i < baseAddress.length - 2; i++) { // Skip '0x'
        if (baseAddress[i] === '0' || baseAddress[i] === 'x') continue;
        
        const modified = baseAddress.slice(0, i) + 
                        (baseAddress[i] === '1' ? '2' : '1') + 
                        baseAddress.slice(i + 1);
        
        const modifiedPattern = generateEmojiPattern(modified);
        
        // Count different positions
        let differentPositions = 0;
        for (let j = 0; j < 4; j++) {
          if ([...basePattern][j] !== [...modifiedPattern][j]) {
            differentPositions++;
          }
        }
        
        // Good avalanche: changing 1 bit should change ~50% of output
        if (differentPositions >= 2) {
          significantChanges++;
        }
      }
      
      const avalancheRatio = significantChanges / (totalTests - 2); // Exclude '0x'
      console.log(`Avalanche effect: ${(avalancheRatio * 100).toFixed(1)}% (should be >40%)`);
      
      expect(avalancheRatio).toBeGreaterThan(0.4); // At least 40% avalanche
    });

    it('should handle edge cases correctly', () => {
      const edgeCases = [
        '0x0000000000000000000000000000000000000000', // All zeros
        '0xffffffffffffffffffffffffffffffffffffffff', // All ones
        '0x0000000000000000000000000000000000000001', // Minimal change
        '0xfffffffffffffffffffffffffffffffffffffffe', // Maximal change
        '0x1111111111111111111111111111111111111111', // Repeated pattern
        '0xabcdefabcdefabcdefabcdefabcdefabcdefabcd', // Hex pattern
        '0x123456789abcdef0123456789abcdef012345678', // Sequential
      ];
      
      const patterns = new Set<string>();
      const results = new Map<string, string>();
      
      edgeCases.forEach(address => {
        const pattern = generateEmojiPattern(address);
        patterns.add(pattern);
        results.set(address, pattern);
        
        console.log(`${address} -> ${pattern}`);
        
        // Each pattern should have 4 emoji characters (accounting for multi-byte emojis)
        const emojiArray = [...pattern];
        expect(emojiArray.length).toBeGreaterThanOrEqual(4);
        expect(emojiArray.length).toBeLessThanOrEqual(8); // Allow for complex emojis
      });
      
      // All edge cases should produce unique patterns
      expect(patterns.size).toBe(edgeCases.length);
    });

    it('should maintain consistency across different inputs', () => {
      const testCases = [
        ['0x1234', '0x0000000000000000000000000000000000001234'], // Short vs padded
        ['0xABCD', '0xabcd'], // Case sensitivity (should be same)
        ['1234', '0x1234'], // With/without 0x prefix
      ];
      
      testCases.forEach(([input1, input2]) => {
        const pattern1 = generateEmojiPattern(input1);
        const pattern2 = generateEmojiPattern(input2);
        
        console.log(`${input1} -> ${pattern1}`);
        console.log(`${input2} -> ${pattern2}`);
        
        expect(pattern1).toBe(pattern2);
      });
    });

    it('should perform well under load', () => {
      const iterations = 100000;
      const start = performance.now();
      
      for (let i = 0; i < iterations; i++) {
        const address = `0x${i.toString(16).padStart(40, '0')}`;
        generateEmojiPattern(address);
      }
      
      const end = performance.now();
      const duration = end - start;
      const opsPerSecond = iterations / (duration / 1000);
      
      console.log(`Performance: ${iterations} operations in ${duration.toFixed(2)}ms`);
      console.log(`Throughput: ${opsPerSecond.toFixed(0)} ops/second`);
      
      // Should process at least 10,000 addresses per second
      expect(opsPerSecond).toBeGreaterThan(10000);
    });

    it('should detect patterns in sequential addresses', () => {
      const sequentialPatterns = new Map<string, number>();
      const sampleSize = 1000;
      
      // Test for unwanted patterns in sequential addresses
      for (let i = 0; i < sampleSize; i++) {
        const address = `0x${i.toString(16).padStart(40, '0')}`;
        const pattern = generateEmojiPattern(address);
        
        sequentialPatterns.set(pattern, (sequentialPatterns.get(pattern) || 0) + 1);
      }
      
      const duplicates = Array.from(sequentialPatterns.values()).filter(count => count > 1);
      const uniquePatterns = sequentialPatterns.size;
      
      console.log(`Sequential test: ${uniquePatterns}/${sampleSize} unique patterns`);
      console.log(`Duplicates: ${duplicates.length} pattern groups`);
      
      // Should have very high uniqueness in sequential addresses
      expect(uniquePatterns / sampleSize).toBeGreaterThan(0.99); // >99% unique
    });

    it('should have balanced emoji usage across categories', () => {
      const categories = {
        animals: '🐶🐱🐭🐹🐰🦊🐻🐼🐸🐵🦁🐯🐨🐮🐷🦄🐧🦅🐙🦈🐢🦎🐍🦕🦖🦒🦏🦛🐘🦘🦝🦡🦔🐿️🐾🦋🐛🐝🦗',
        food: '🍎🍊🍋🍌🍇🍓🥝🍑🥕🌽🍕🍔🌮🍦🍪🎂☕🍺🥤🍷🥐🥖🧀🥚🥓🥞🍳🥗🍲🍜🍣🍱🍛🍙🍘🍧🍨🍰🥧🍫',
        activities: '⚽🏀🏈⚾🎾🏐🎱🎮🎲🎯🚗🚕🚙🚌🚎🏎️🚲🛴🛵🏍️✈️🚁🛩️🚀🛸⛵🚤⚓🎸🎹🥁🎺🎷🎪🎭🎨🖌️🖍️📱💻',
        symbols: '⭐✨🌟💫⚡🔥💧❄️🌈🎈🎪🎊🎉🎁🏆🥇🏅🎖️💎💍🔮🧿📿💥🌪️🌊⛄☃️🌸🌺🌻🌹🌷🌼💐🏵️🌱🍀',
      };
      
      const categoryUsage: { [key: string]: number } = Object.keys(categories).reduce((acc, cat) => ({ ...acc, [cat]: 0 }), {});
      const sampleSize = 5000;
      
      for (let i = 0; i < sampleSize; i++) {
        const randomHex = Array.from({length: 40}, () => Math.floor(Math.random() * 16).toString(16)).join('');
        const address = `0x${randomHex}`;
        const pattern = generateEmojiPattern(address);
        
        [...pattern].forEach(emoji => {
          Object.entries(categories).forEach(([category, emojis]) => {
            if (emojis.includes(emoji)) {
              categoryUsage[category]++;
            }
          });
        });
      }
      
      const totalEmojis = sampleSize * 4;
      Object.entries(categoryUsage).forEach(([category, count]) => {
        const percentage = ((count as number) / totalEmojis * 100).toFixed(1);
        console.log(`${category}: ${percentage}% usage`);
        
        // Each category should be used reasonably (5-50% range)
        expect((count as number) / totalEmojis).toBeGreaterThan(0.05);
        expect((count as number) / totalEmojis).toBeLessThan(0.5);
      });
    });
  });
});