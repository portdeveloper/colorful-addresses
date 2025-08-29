import React from 'react';
import { generateEmojiPattern, isValidEthereumAddress, formatAddress } from './emojiHash';

export interface EmojifiedProps {
  address: string;
  showFullAddress?: boolean;
  spacing?: string;
  className?: string;
  style?: React.CSSProperties;
}

export const Emojified: React.FC<EmojifiedProps> = ({
  address,
  showFullAddress = false,
  spacing = ' ',
  className,
  style
}) => {
  if (!isValidEthereumAddress(address)) {
    return (
      <span className={className} style={style}>
        {address} ❌⚠️❓
      </span>
    );
  }

  const formattedAddress = formatAddress(address, showFullAddress);
  const emojiPattern = generateEmojiPattern(address);

  return (
    <span className={className} style={style}>
      {formattedAddress}{spacing}{emojiPattern}
    </span>
  );
};

export default Emojified;