import React from "react";
import { PAGE_BG, CARD_STYLE } from "../constants/theme";

/**
 * Full-page content wrapper.
 * The logo/title header has moved to <Navbar> — this component
 * only handles the background, centering, and the glassmorphic card.
 *
 * Props:
 *  - maxWidth  {number}    Max content width (default 720)
 *  - children  {ReactNode} Content rendered inside the card
 */
const PageLayout = ({ maxWidth = 720, children }) => (
  <div style={{
    ...PAGE_BG,
    paddingTop: 96,          // 64px navbar height + 32px breathing room
    alignItems: 'flex-start',
  }}>
    <div style={{ width: '100%', maxWidth }}>
      <div style={CARD_STYLE}>
        {children}
      </div>
    </div>
  </div>
);

export default PageLayout;