import { defineConfig } from 'eslint/config';
import nextCoreWebVitals from 'eslint-config-next/core-web-vitals';

export default defineConfig([
  {
    extends: [...nextCoreWebVitals],
    rules: {
      // React Compiler rules added by eslint-config-next 16. The flagged code predates them.
      // Kept as warnings during the framework upgrade; fixed or removed in Phase 2.
      'react-hooks/set-state-in-effect': 'warn',
      'react-hooks/refs': 'warn',
      'react-hooks/immutability': 'warn',
      'react-hooks/preserve-manual-memoization': 'warn',
    },
  },
]);
