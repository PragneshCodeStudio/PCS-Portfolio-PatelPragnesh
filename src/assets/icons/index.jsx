/* START BRAND ICON */
export const BrandFavIconWhite = ({ className = '' }) => (
  <svg className={className} width="512" height="512" viewBox="0 0 512 512" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M131.4 512V402L410.8 122.6V0H512V512H131.4Z" fill="#f2f2f2"/>
    <path d="M0 512V0H380.5V110L101.1 389.4V512H0Z" fill="#f2f2f2"/>
</svg>
)

export const BrandFavIconBlack = ({ className = '' }) => (
  <svg className={className} width="512" height="512" viewBox="0 0 512 512" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M131.4 512V402L410.8 122.6V0H512V512H131.4Z" fill="#0C0C0E"/>
    <path d="M0 512V0H380.5V110L101.1 389.4V512H0Z" fill="#0C0C0E"/>
</svg>
)

// Future SVG replace checklist:
// 1. Keep base, fill, and trace layers visually matching the same icon.
// 2. Keep data-experience-icon-fill on the fill group.
// 3. Keep data-experience-icon-trace on the trace group.
// 4. Add data-experience-draw-path to every stroke path that GSAP should draw.
// 5. Use stroke paths for the trace layer; filled-only icons cannot use strokeDashoffset cleanly.
export const BrandOutlineTraceIcon = ({
  className = '',
  baseClassName = 'text-secondary-text',
  traceClassName = 'text-white opacity-0',
  fillClassName = 'text-white opacity-0',
  baseOpacity = 0.05,
}) => (
  <svg
    className={className}
    viewBox="0 0 512 512"
    fill="none"
    aria-hidden="true"
  >
    {/* Base layer: always visible gray outline. Replace these paths when changing the icon. */}
    <g className={baseClassName} opacity={baseOpacity}>
      <path
        d="M504 8V504H139.4V405.313L416.457 128.257L418.8 125.914V8H504Z"
        stroke="currentColor"
        strokeWidth="16"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeMiterlimit="10"
      />
      <path
        d="M372.5 8V106.686L95.4434 383.743L93.0996 386.086V504H8V8H372.5Z"
        stroke="currentColor"
        strokeWidth="16"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeMiterlimit="10"
      />
    </g>
    {/* Fill layer: fades in after the stroke trace is complete. Keep geometry matching the icon. */}
    <g className={fillClassName} data-experience-icon-fill="">
      <path
        d="M504 8V504H139.4V405.313L416.457 128.257L418.8 125.914V8H504Z"
        fill="currentColor"
      />
      <path
        d="M372.5 8V106.686L95.4434 383.743L93.0996 386.086V504H8V8H372.5Z"
        fill="currentColor"
      />
    </g>
    {/* Trace layer: GSAP draws paths with data-experience-draw-path during Experience scroll. */}
    <g className={traceClassName} data-experience-icon-trace="">
      <path
        d="M504 8V504H139.4V405.313L416.457 128.257L418.8 125.914V8H504Z"
        stroke="currentColor"
        strokeWidth="16"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeMiterlimit="10"
        data-experience-draw-path=""
      />
      <path
        d="M372.5 8V106.686L95.4434 383.743L93.0996 386.086V504H8V8H372.5Z"
        stroke="currentColor"
        strokeWidth="16"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeMiterlimit="10"
        data-experience-draw-path=""
      />
    </g>
  </svg>
)
/* END BRAND ICON */
