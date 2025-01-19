const fs = require('fs');
const path = require('path');
let size;
const folderPath = path.join(__dirname, 'secret-folder');

fs.readdir(folderPath, { withFileTypes: true }, (err, files) => {
  if (err) {
    console.error('Ошибка чтения');
    return;
  }
  files.forEach(async (file) => {
    if (!file.isDirectory()) {
      let exst = await path.extname(file.name.toString());
      let filePath = path.join(folderPath, file.name.toString());
      let fileName = path.basename(filePath);
      fs.stat(filePath, async (err, stats) => {
        if (err) {
          console.error('Ошибка:', err);
          return;
        }
        size = stats.size;
        console.log(
          `${fileName.toString().replace(exst, '')} - ${exst.replace(
            '.',
            '',
          )} - ${+size / 1000}kb`,
        );
      });
    }
  });
});
