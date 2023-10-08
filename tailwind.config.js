// @ts-check
import { join } from 'path';

import { skeleton } from '@skeletonlabs/tw-plugin';

import forms from '@tailwindcss/forms';
import typography from '@tailwindcss/typography';

/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./src/**/*.{html,js,svelte,ts}',
    join(require.resolve(
      '@skeletonlabs/skeleton'),
      '../**/*.{html,js,svelte,ts}'
    )
  ],
  theme: {
    container: {
      center: true,
    },
    extend: {},
  },
  plugins: [
    typography,
    forms,
    skeleton({
      themes: { preset: ["rocket"] }
    })
  ],
}

