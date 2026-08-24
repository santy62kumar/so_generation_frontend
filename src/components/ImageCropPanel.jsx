import React, { useState, useRef, useEffect } from "react";

import { Button } from "@/components/ui/button";

// Must match the slide canvas size in pdfgenerator.py (SLIDE_W / SLIDE_H).
const SLIDE_W = 1456;
const SLIDE_H = 816;

// Placeholder color for the live drag box before its image paints in —
// never actually visible since the <img> inside always fills it 100%.
// Export padding uses the real background asset instead, see handleApply.
const PAD_COLOR = "#ffffff";
const MIN_BOX = 40; // minimum box width/height, in slot-space px

/**
 * ImageCropPanel
 * ----------------------------------------------------------------------
 * Shows the full slide (real background asset, real 1456x816 aspect) with
 * the uploaded image placed as a freely movable/resizable box inside the
 * exact target slot. The user has full manual control:
 *   - drag inside the box to move it
 *   - drag a CORNER handle to resize both dimensions
 *   - drag a SIDE handle to resize just that one dimension (crop/stretch
 *     that axis independently — deliberately allowed, it's the user's call)
 *   - scroll/pinch over the frame to scale proportionally
 *   - "Fill Frame" / "Fit Whole Image" one-click presets for the common cases
 *
 * All box math happens in slot-space (the same pixel units as the export
 * target), so it's resolution-independent and the export is a direct 1:1
 * copy of the box — no separate scale conversion needed.
 *
 * Props:
 *  - file          File    the raw image the user just picked
 *  - backgroundSrc string  URL of the slide background asset (e.g. 6.jpg / 7.jpg)
 *  - slot          { x, y, w, h }  slot rect in slide-space px — w/h also
 *                  double as the export resolution
 *  - label         string  shown in the header
 *  - onApply(croppedFile)
 *  - onCancel()
 */
export default function ImageCropPanel({ file, backgroundSrc, slot, label, onApply, onCancel }) {
  const [imgEl, setImgEl] = useState(null);
  const [bgImgEl, setBgImgEl] = useState(null);
  // box is in SLOT-SPACE px (same units as slot.w / slot.h / the export canvas).
  const [box, setBox] = useState({ x: 0, y: 0, w: slot.w, h: slot.h });
  const [dragKind, setDragKind] = useState(null); // null | 'move' | handle id

  const slideRef = useRef(null);
  const [slideW, setSlideW] = useState(800);
  const displayScale = slideW / SLIDE_W;

  const slotDisp = {
    x: slot.x * displayScale,
    y: slot.y * displayScale,
    w: slot.w * displayScale,
    h: slot.h * displayScale,
  };

  const coverBox = img => {
    const s = Math.max(slot.w / img.width, slot.h / img.height);
    const w = img.width * s, h = img.height * s;
    return { x: (slot.w - w) / 2, y: (slot.h - h) / 2, w, h };
  };
  const containBox = img => {
    const s = Math.min(slot.w / img.width, slot.h / img.height);
    const w = img.width * s, h = img.height * s;
    return { x: (slot.w - w) / 2, y: (slot.h - h) / 2, w, h };
  };

  // Load the picked file so we know its natural dimensions.
  useEffect(() => {
    if (!file) return;
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => setImgEl(img);
    img.src = url;
    return () => URL.revokeObjectURL(url);
  }, [file]);

  // Load the slide background asset too — needed so any part of the slot
  // the uploaded image doesn't cover can be filled with the exact same
  // background crop that's already showing there, not a placeholder color.
  useEffect(() => {
    if (!backgroundSrc) { setBgImgEl(null); return; }
    const img = new Image();
    img.onload = () => setBgImgEl(img);
    img.src = backgroundSrc;
  }, [backgroundSrc]);

  // Default to "Fill Frame" whenever a new image (or a differently-shaped
  // slot) comes in. Doesn't re-run on plain window resizes since box lives
  // in resolution-independent slot-space.
  useEffect(() => {
    if (imgEl) setBox(coverBox(imgEl));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [imgEl, slot.w, slot.h]);

  useEffect(() => {
    const el = slideRef.current;
    if (!el) return;
    const ro = new ResizeObserver(entries => {
      const w = entries[0]?.contentRect?.width;
      if (w) setSlideW(w);
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const dispBox = {
    x: slotDisp.x + box.x * displayScale,
    y: slotDisp.y + box.y * displayScale,
    w: box.w * displayScale,
    h: box.h * displayScale,
  };

  // ── Move (drag inside the box) ───────────────────────────────────
  const startMove = e => {
    e.preventDefault();
    e.stopPropagation();
    beginDrag("move", e, box);
  };

  // ── Resize via a handle ───────────────────────────────────────────
  // handleId contains 'n'/'s' for the vertical edge touched and/or 'e'/'w'
  // for the horizontal edge touched, e.g. 'ne', 'e', 's'.
  const startResize = handleId => e => {
    e.preventDefault();
    e.stopPropagation();
    beginDrag(handleId, e, box);
  };

  const dragRef = useRef(null);
  const beginDrag = (kind, e, startBox) => {
    dragRef.current = { kind, startX: e.clientX, startY: e.clientY, startBox };
    setDragKind(kind);
  };

  useEffect(() => {
    if (!dragKind) return;
    const onMove = e => {
      const { kind, startX, startY, startBox } = dragRef.current;
      const dx = (e.clientX - startX) / displayScale;
      const dy = (e.clientY - startY) / displayScale;

      if (kind === "move") {
        setBox({ ...startBox, x: startBox.x + dx, y: startBox.y + dy });
        return;
      }

      let { x, y, w, h } = startBox;
      const isCorner = kind.length === 2; // 'nw'/'ne'/'se'/'sw' vs single-edge 'n'/'s'/'e'/'w'

      if (isCorner) {
        // Corner handles: lock to the box's starting aspect ratio.
        const aspect = startBox.w / startBox.h;

        let rawW = startBox.w;
        let rawH = startBox.h;
        if (kind.includes("e")) rawW = startBox.w + dx;
        if (kind.includes("w")) rawW = startBox.w - dx;
        if (kind.includes("s")) rawH = startBox.h + dy;
        if (kind.includes("n")) rawH = startBox.h - dy;

        // Drive the resize off whichever axis moved more, derive the other
        // dimension from it so w/h stay in the original ratio.
        const wChange = Math.abs(rawW - startBox.w);
        const hChange = Math.abs(rawH - startBox.h);
        if (wChange >= hChange) {
          w = Math.max(MIN_BOX, rawW);
          h = w / aspect;
        } else {
          h = Math.max(MIN_BOX, rawH);
          w = h * aspect;
        }
        // Re-check the min on whichever dimension we derived.
        if (w < MIN_BOX) { w = MIN_BOX; h = w / aspect; }
        if (h < MIN_BOX) { h = MIN_BOX; w = h * aspect; }

        // Keep the opposite corner anchored in place.
        x = kind.includes("w") ? startBox.x + (startBox.w - w) : startBox.x;
        y = kind.includes("n") ? startBox.y + (startBox.h - h) : startBox.y;
      } else {
        // Side handles: free crop — resize just the one axis touched.
        if (kind.includes("e")) w = Math.max(MIN_BOX, startBox.w + dx);
        if (kind.includes("w")) {
          w = Math.max(MIN_BOX, startBox.w - dx);
          x = startBox.x + (startBox.w - w);
        }
        if (kind.includes("s")) h = Math.max(MIN_BOX, startBox.h + dy);
        if (kind.includes("n")) {
          h = Math.max(MIN_BOX, startBox.h - dy);
          y = startBox.y + (startBox.h - h);
        }
      }
      setBox({ x, y, w, h });
    };
    const onUp = () => setDragKind(null);
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
    window.addEventListener("pointercancel", onUp);
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
      window.removeEventListener("pointercancel", onUp);
    };
  }, [dragKind, displayScale]);

  // Scroll/pinch to scale proportionally around the box's own center.
  const handleWheel = e => {
    if (!imgEl) return;
    e.preventDefault();
    const factor = 1 - e.deltaY * 0.0015;
    setBox(prev => {
      const newW = Math.max(MIN_BOX, prev.w * factor);
      const newH = Math.max(MIN_BOX, prev.h * factor);
      const cx = prev.x + prev.w / 2;
      const cy = prev.y + prev.h / 2;
      return { x: cx - newW / 2, y: cy - newH / 2, w: newW, h: newH };
    });
  };

  const handleApply = () => {
    if (!imgEl) return;
    const canvas = document.createElement("canvas");
    canvas.width = slot.w;
    canvas.height = slot.h;
    const ctx = canvas.getContext("2d");

    // Fill any part of the slot the image doesn't cover with the EXACT
    // same crop of the slide background that's already sitting there —
    // replicating CSS `background-size: cover; background-position: center`
    // over the full SLIDE_W x SLIDE_H canvas, then reading out just this
    // slot's region. Padding ends up visually identical to the real slide,
    // not an approximation.
    if (bgImgEl) {
      const coverScale = Math.max(SLIDE_W / bgImgEl.width, SLIDE_H / bgImgEl.height);
      const dW = bgImgEl.width * coverScale;
      const dH = bgImgEl.height * coverScale;
      const offX = (SLIDE_W - dW) / 2;
      const offY = (SLIDE_H - dH) / 2;
      const srcX = (slot.x - offX) / coverScale;
      const srcY = (slot.y - offY) / coverScale;
      const srcW = slot.w / coverScale;
      const srcH = slot.h / coverScale;
      ctx.drawImage(bgImgEl, srcX, srcY, srcW, srcH, 0, 0, slot.w, slot.h);
    }

    // Sharp foreground image at the user's chosen box.
    ctx.drawImage(imgEl, 0, 0, imgEl.width, imgEl.height, box.x, box.y, box.w, box.h);

    canvas.toBlob(
      blob => {
        const croppedFile = new File([blob], file.name.replace(/\.[^.]+$/, "") + "_cropped.jpg", {
          type: "image/jpeg",
        });
        onApply(croppedFile);
      },
      "image/jpeg",
      0.92
    );
  };

  const HANDLES = [
    { id: "nw", cursor: "nwse-resize" },
    { id: "n",  cursor: "ns-resize"   },
    { id: "ne", cursor: "nesw-resize" },
    { id: "e",  cursor: "ew-resize"   },
    { id: "se", cursor: "nwse-resize" },
    { id: "s",  cursor: "ns-resize"   },
    { id: "sw", cursor: "nesw-resize" },
    { id: "w",  cursor: "ew-resize"   },
  ];

  const handlePos = id => {
    const midX = dispBox.x + dispBox.w / 2;
    const midY = dispBox.y + dispBox.h / 2;
    const left = dispBox.x, right = dispBox.x + dispBox.w;
    const top = dispBox.y, bottom = dispBox.y + dispBox.h;
    switch (id) {
      case "nw": return { x: left, y: top };
      case "n":  return { x: midX, y: top };
      case "ne": return { x: right, y: top };
      case "e":  return { x: right, y: midY };
      case "se": return { x: right, y: bottom };
      case "s":  return { x: midX, y: bottom };
      case "sw": return { x: left, y: bottom };
      case "w":  return { x: left, y: midY };
      default:   return { x: 0, y: 0 };
    }
  };

  return (
    <div className="flex h-full flex-col bg-brand-canvas">
      {/* Header */}
      <div className="border-b border-border px-10 pt-7 pb-5">
        <p className="mb-1.5 text-sm font-bold tracking-[0.6px] text-brand-deep uppercase">
          Position &amp; Crop — {label}
        </p>
        <p className="text-sm leading-relaxed text-brand-muted">
          Drag inside the box to move it, drag a <strong>corner</strong> to resize both sides while
          keeping the aspect ratio, drag a <strong>side</strong> to crop or stretch just that edge.
          Scroll to scale. Any empty space is filled with the exact same slide background showing
          through — seamless, not a flat color.
        </p>
      </div>

      {/* Slide preview */}
      <div className="flex min-h-0 flex-1 items-center justify-center overflow-auto p-8">
        <div
          ref={slideRef}
          onWheel={handleWheel}
          className="relative w-full max-w-[900px] rounded-md bg-brand-dark bg-cover bg-center shadow-[0_20px_40px_-12px_rgba(58,26,26,0.35)]"
          style={{
            aspectRatio: `${SLIDE_W} / ${SLIDE_H}`,
            backgroundImage: backgroundSrc ? `url(${backgroundSrc})` : undefined,
          }}
        >
          {imgEl ? (
            <>
              {/* Frame — fixed, clips the image visually to the real target slot */}
              <div
                className="absolute overflow-hidden rounded-sm outline-2 -outline-offset-2 outline-brand-warm"
                style={{
                  left: slotDisp.x, top: slotDisp.y,
                  width: slotDisp.w, height: slotDisp.h,
                }}
              >
                <div
                  onPointerDown={startMove}
                  className={dragKind === "move" ? "absolute cursor-grabbing touch-none select-none" : "absolute cursor-grab touch-none select-none"}
                  style={{
                    left: dispBox.x - slotDisp.x,
                    top: dispBox.y - slotDisp.y,
                    width: dispBox.w,
                    height: dispBox.h,
                    background: PAD_COLOR,
                  }}
                >
                  <img
                    src={imgEl.src}
                    alt=""
                    draggable={false}
                    className="pointer-events-none block size-full"
                  />
                </div>
              </div>

              {/* Dashed outline of the box's true bounds, even where it extends past the frame */}
              <div
                className="pointer-events-none absolute border-[1.5px] border-dashed border-danger-soft"
                style={{
                  left: dispBox.x, top: dispBox.y,
                  width: dispBox.w, height: dispBox.h,
                }}
              />

              {/* Resize handles */}
              {HANDLES.map(({ id, cursor }) => {
                const p = handlePos(id);
                return (
                  <div
                    key={id}
                    onPointerDown={startResize(id)}
                    className="absolute size-3.5 -translate-x-1/2 -translate-y-1/2 touch-none rounded-[3px] border-2 border-brand-warm bg-white shadow-[0_1px_4px_rgba(0,0,0,0.4)]"
                    style={{ left: p.x, top: p.y, cursor }}
                  />
                );
              })}
            </>
          ) : (
            <div className="absolute inset-0 flex items-center justify-center text-sm font-medium text-white/85">
              Loading image…
            </div>
          )}
        </div>
      </div>

      {/* Controls */}
      <div className="border-t border-border px-10 pt-5 pb-8">
        <div className="mx-auto max-w-[900px]">
          <div className="mb-5 flex gap-2.5">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => imgEl && setBox(coverBox(imgEl))}
              disabled={!imgEl}
            >
              Fill Frame
            </Button>
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => imgEl && setBox(containBox(imgEl))}
              disabled={!imgEl}
            >
              Fit Whole Image
            </Button>
          </div>

          <div className="flex gap-3">
            <Button
              variant="outline"
              size="lg"
              className="flex-1 border-2 border-brand-warm"
              onClick={onCancel}
            >
              Cancel
            </Button>
            <Button
              size="lg"
              className="flex-2"
              onClick={handleApply}
              disabled={!imgEl || (!!backgroundSrc && !bgImgEl)}
            >
              Apply Changes
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
