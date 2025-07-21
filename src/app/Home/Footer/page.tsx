import React from "react";

const Footer: React.FC = () => (
  <footer
    style={{
      width: "100%",
      padding: "1.5rem 0",
      background: "#f5f5f5",
      textAlign: "center",
      fontSize: "1rem",
      color: "#333",
      borderTop: "1px solid #e0e0e0",
      position: "relative",
      bottom: 0,
    }}
  >
    <span>
      &copy; {new Date().getFullYear()} GreenPax. All rights reserved.
      
      
    </span>
  </footer>
);

export default Footer;