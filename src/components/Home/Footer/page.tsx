'use client';

import React, { forwardRef } from 'react';

const Footer = forwardRef<HTMLDivElement>((_, ref) => {
  console.log(Footer.displayName, 'rendered');
  return (
    <footer
      ref={ref}
      style={{
        width: '100%',
        height: '20vh',
        background: '#f5f5f5',
        padding: '1.5rem 0',
        textAlign: 'center',
        borderTop: '1px solid #e0e0e0',
        color: '#555',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      
      <div style={{ fontSize: '1rem', marginBottom: '0.5rem' }}>
        &copy; {new Date().getFullYear()} <strong>GreenPax</strong>. All rights reserved.
      </div>
      <div style={{ fontSize: '0.85rem' }}>
        <a
          href="/privacy"
          style={{ color: '#007bff', textDecoration: 'none', marginRight: '1rem' }}
        >
          Privacy Policy
        </a>
        <a
          href="/terms"
          style={{ color: '#007bff', textDecoration: 'none' }}
        >
          Terms of Service
        </a>
      </div>
    </footer>
  );
});

Footer.displayName = 'Footer';
export default Footer;
