import React from "react";

/**
 * Brand header shown at the top of every page.
 * Pass an optional `subtitle` for contextual text below the logo.
 */
const AuthHeader = ({ subtitle }) => (
  <div className="text-center mb-6">
    <img
      src="https://www.modula.in/images/modula_jsw.svg"
      alt="Modula by JSW"
      className="h-10 mx-auto mb-3"
    />
    {subtitle && (
      <p className="text-sm text-muted-foreground">{subtitle}</p>
    )}
  </div>
);

export default AuthHeader;