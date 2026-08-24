import React from "react";

/**
 * Brand header shown at the top of standalone screens (e.g. the DB login).
 * Pass an optional `subtitle` for contextual text below the logo.
 */
const AuthHeader = ({ subtitle }) => (
  <div className="mb-6 text-center">
    <img
      src="https://www.modula.in/images/modula_jsw.svg"
      alt="Modula by JSW"
      className="mx-auto mb-3 h-10 w-auto"
    />
    {subtitle && <p className="text-sm text-brand-muted">{subtitle}</p>}
  </div>
);

export default AuthHeader;
