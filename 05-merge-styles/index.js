const fs = require('fs');
const path = require('path');
const stylePath = path.join(__dirname, 'styles');
const newFilePath = path.join(__dirname, 'project-dist', 'bundle.css');
let arr = [];
async function mergeStyles() {
  let readStyleDir = await fs.promises.readdir(stylePath, {
    withFileTypes: true,
  });
  async function givItemFile() {
    for (const file of readStyleDir) {
      const ext = await path.extname(file.name.toString());
      if (ext === '.css') {
        let itemFile = await fs.promises.readFile(
          path.join(file.path, file.name),
          'utf-8',
        );
        arr.push(itemFile);
      }
    }
  }
  await givItemFile();
  await fs.promises.open(newFilePath, 'a');
  await fs.promises.writeFile(newFilePath, '', 'utf-8');
  arr.forEach((item) => {
    fs.promises.appendFile(newFilePath, item, 'utf-8');
  });
}
mergeStyles();
