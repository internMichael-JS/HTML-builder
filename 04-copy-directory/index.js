const fs = require('fs');
const path = require('path');
const folderPath = path.join(__dirname, 'files');
const copyFolderPath = path.join(__dirname, 'files-copy');

async function copyDir() {
  await fs.promises.rm(copyFolderPath, { recursive: true, force: true });

  await fs.promises.mkdir(copyFolderPath, { recursive: true, force: true });

  let dirFile = await fs.readdir(
    folderPath,
    { withFileTypes: true },
    (err, files) => {
      if (err) {
        console.error('Ошибка чтения');
        return;
      }
      console.log(files);
      files.forEach((file) => {
        console.log(file);
        const filePath = path.join(__dirname, 'files', file.name);
        const newFilePath = path.join(__dirname, 'files-copy', file.name);
        fs.copyFile(filePath, newFilePath, (err) => {
          if (err) {
            console.error('Ошибка копирования');
            return;
          }
        });
      });
    },
  );
  console.log(dirFile);
}
copyDir();
