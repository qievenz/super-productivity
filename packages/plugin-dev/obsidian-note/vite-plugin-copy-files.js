import { resolve } from 'path';
import fs from 'fs';

export default function copyFiles() {
  return {
    name: 'copy-files',
    closeBundle() {
      const filesToCopy = ['manifest.json', 'icon.svg', 'config.schema.json', 'index.html'];
      filesToCopy.forEach((file) => {
        const src = resolve(__dirname, 'src', file);
        const dest = resolve(__dirname, 'dist', file);
        if (fs.existsSync(src)) {
          fs.copyFileSync(src, dest);
        }
      });
    },
  };
}
