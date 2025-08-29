import { EMOJI_SET } from './emojiSet';

function fnv1aHash(str: string): number {
  let hash = 2166136261;
  for (let i = 0; i < str.length; i++) {
    hash ^= str.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

function murmurhash3(str: string, seed: number = 0): number {
  let h1 = seed >>> 0;
  let k1;
  
  for (let i = 0; i < str.length; i++) {
    k1 = str.charCodeAt(i);
    k1 = Math.imul(k1, 0xcc9e2d51);
    k1 = (k1 << 15) | (k1 >>> 17);
    k1 = Math.imul(k1, 0x1b873593);
    
    h1 ^= k1;
    h1 = (h1 << 13) | (h1 >>> 19);
    h1 = Math.imul(h1, 5) + 0xe6546b64;
  }
  
  h1 ^= str.length;
  h1 ^= h1 >>> 16;
  h1 = Math.imul(h1, 0x85ebca6b);
  h1 ^= h1 >>> 13;
  h1 = Math.imul(h1, 0xc2b2ae35);
  h1 ^= h1 >>> 16;
  
  return h1 >>> 0;
}

function getEmojiForPosition(address: string, position: number): string {
  const primes = [97, 101, 103, 107];
  const salt = primes[position];
  
  const fullHash = fnv1aHash(address + salt.toString());
  const segmentHash = murmurhash3(address.slice(position * 6, position * 6 + 16), position * 1009);
  
  const combinedHash = (fullHash * salt) ^ (segmentHash * primes[(position + 1) % 4]);
  const index = Math.abs(combinedHash) % EMOJI_SET.length;
  
  return EMOJI_SET[index];
}

export function generateEmojiPattern(address: string): string {
  const cleanAddress = address.toLowerCase().replace(/^0x/, '');
  
  if (cleanAddress.length < 32) {
    const paddedAddress = cleanAddress.padStart(40, '0');
    return generateEmojiPattern('0x' + paddedAddress);
  }
  
  const emoji1 = getEmojiForPosition(cleanAddress, 0);
  const emoji2 = getEmojiForPosition(cleanAddress, 1);
  const emoji3 = getEmojiForPosition(cleanAddress, 2);
  const emoji4 = getEmojiForPosition(cleanAddress, 3);
  
  return `${emoji1}${emoji2}${emoji3}${emoji4}`;
}

export function isValidEthereumAddress(address: string): boolean {
  if (!address || typeof address !== 'string') return false;
  
  const cleanAddress = address.replace(/^0x/, '');
  
  if (cleanAddress.length !== 40) return false;
  
  return /^[a-fA-F0-9]{40}$/.test(cleanAddress);
}

export function formatAddress(address: string, showFullAddress: boolean = false): string {
  if (!showFullAddress && address.length >= 42) {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  }
  return address;
}