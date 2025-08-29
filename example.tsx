import React from 'react';
import { Emojified } from './src/Emojified';

// Example usage of the Emojified component
export function ExampleApp() {
  const addresses = [
    '0x1234567890123456789012345678901234567890',
    '0x1234567890123456789012345678901234567891', // Only 1 char different!
    '0xabcdefabcdefabcdefabcdefabcdefabcdefabcd',
    '0x0000000000000000000000000000000000000001',
    '0xfffffffffffffffffffffffffffffffffffff',
  ];

  return (
    <div style={{ fontFamily: 'monospace', padding: '20px' }}>
      <h1>Emojified Address Demo</h1>
      
      <h2>Truncated Addresses (Default)</h2>
      {addresses.map((address, index) => (
        <div key={index} style={{ marginBottom: '10px' }}>
          <Emojified address={address} />
        </div>
      ))}

      <h2>Full Addresses</h2>
      {addresses.map((address, index) => (
        <div key={index} style={{ marginBottom: '10px' }}>
          <Emojified address={address} showFullAddress={true} />
        </div>
      ))}

      <h2>Custom Styling</h2>
      <Emojified 
        address={addresses[0]}
        style={{ 
          backgroundColor: '#f0f0f0', 
          padding: '8px', 
          borderRadius: '4px',
          fontSize: '18px'
        }}
        spacing="   "
      />

      <h2>Invalid Address Handling</h2>
      <Emojified address="0xinvalid" />
      <br />
      <Emojified address="0x123" />

      <h2>Similar Addresses Comparison</h2>
      <div style={{ border: '1px solid #ccc', padding: '10px', marginTop: '10px' }}>
        <p>Notice how similar addresses get very different emojis:</p>
        <Emojified address="0x1234567890123456789012345678901234567890" />
        <br />
        <Emojified address="0x1234567890123456789012345678901234567891" />
      </div>
    </div>
  );
}