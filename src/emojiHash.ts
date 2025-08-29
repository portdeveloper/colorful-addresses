import { EMOJI_SET } from './emojiSet';

function simpleHash(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash);
}

function getEmojiAtIndex(hash: number, offset: number): string {
  const index = (hash + offset * 12345) % EMOJI_SET.length;
  return EMOJI_SET[index];
}

export function generateEmojiPattern(address: string): string {
  const cleanAddress = address.toLowerCase().replace(/^0x/, '');
  const hash = simpleHash(cleanAddress);
  
  const emoji1 = getEmojiAtIndex(hash, 0);
  const emoji2 = getEmojiAtIndex(hash, 1);
  const emoji3 = getEmojiAtIndex(hash, 2);
  
  return `${emoji1}${emoji2}${emoji3}`;
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