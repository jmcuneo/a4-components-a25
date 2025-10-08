//https://www.npmjs.com/package/@vitejs/plugin-react
import {defineConfig} from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
    plugins: [react()],
});