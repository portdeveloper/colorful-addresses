import React from 'react';
import { render, screen } from '@testing-library/react';
import { Emojified } from '../Emojified';

describe('Emojified Component', () => {
  const validAddress = '0x1234567890123456789012345678901234567890';
  const invalidAddress = '0x123invalid';

  it('should render valid address with emojis', () => {
    render(<Emojified address={validAddress} />);
    
    const element = screen.getByText(/0x1234\.\.\.7890/);
    expect(element).toBeInTheDocument();
    expect(element.textContent).toMatch(/0x1234\.\.\.7890 .+/); // Address + space + emojis
  });

  it('should render full address when showFullAddress is true', () => {
    render(<Emojified address={validAddress} showFullAddress={true} />);
    
    const element = screen.getByText(new RegExp(validAddress.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));
    expect(element).toBeInTheDocument();
  });

  it('should render invalid addresses with error emojis', () => {
    render(<Emojified address={invalidAddress} />);
    
    const element = screen.getByText(/❌⚠️❓/);
    expect(element).toBeInTheDocument();
    expect(element.textContent).toBe('0x123invalid ❌⚠️❓');
  });

  it('should apply custom spacing', () => {
    render(<Emojified address={validAddress} spacing="  " />);
    
    const element = screen.getByText(/0x1234\.\.\.7890/);
    expect(element.textContent).toMatch(/0x1234\.\.\.7890  .+/);
  });

  it('should apply custom className', () => {
    render(<Emojified address={validAddress} className="custom-class" />);
    
    const element = screen.getByText(/0x1234\.\.\.7890/);
    expect(element).toHaveClass('custom-class');
  });

  it('should apply custom styles', () => {
    const customStyle = { color: 'red', fontSize: '16px' };
    render(<Emojified address={validAddress} style={customStyle} />);
    
    const element = screen.getByText(/0x1234\.\.\.7890/);
    expect(element).toHaveStyle('color: red');
    expect(element).toHaveStyle('font-size: 16px');
  });

  it('should generate consistent output for the same address', () => {
    const { unmount } = render(<Emojified address={validAddress} />);
    const firstRender = screen.getByText(/0x1234\.\.\.7890/).textContent;
    unmount();
    
    render(<Emojified address={validAddress} />);
    const secondRender = screen.getByText(/0x1234\.\.\.7890/).textContent;
    
    expect(firstRender).toBe(secondRender);
  });
});