# Pixelated image hover

A standalone interaction study using `src/assets/images/profile/scan-pic.webp`. Hover the image with a desktop mouse to reveal a pixelated canvas whose existing dots bend and gently orbit near the cursor. Touch devices and reduced-motion settings keep the original image static.

Change the `img` source in `index.html` to try another image. The frame and canvas fit its natural aspect ratio automatically.

From the repository root, run `npm run dev`, then open `/references/pixelated-logo-hover/` on the local Vite URL. The demo uses the existing Vite server and adds no dependencies. It is not linked from the portfolio or included in the production build.