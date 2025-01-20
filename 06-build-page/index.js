const fs = require('fs');
const path = require('path');
const prodFolderPath = path.join(__dirname, 'project-dist');

async function doneTask() {
  await fs.promises.rm(prodFolderPath, { recursive: true, force: true });
  await fs.promises.mkdir(prodFolderPath, { recursive: true, force: true });

  const rempHtmlPath = path.join(__dirname, 'template.html');
  const newHtmlPath = path.join(prodFolderPath, 'index.html');
  await fs.promises.copyFile(rempHtmlPath, newHtmlPath);

  let htmlContent = await fs.promises.readFile(newHtmlPath, 'utf-8');
  console.log(111);
  const componentsFiles = await fs.promises.readdir(
    path.join(__dirname, 'components'),
    { withFileTypes: true },
    (err) => {
      if (err) {
        console.error('Ошибка чтения');
        return;
      }
    },
  );
  for (const file of componentsFiles) {
    let exst = await path.extname(file.name.toString());
    let filePath = await path.join(
      __dirname,
      'components',
      file.name.toString(),
    );
    let fileName = await path.basename(filePath);
    const componentsContent = await fs.promises.readFile(filePath, 'utf-8');
    htmlContent = htmlContent.replaceAll(
      `{{${fileName.toString().replace(exst, '')}}}`,
      `${componentsContent}`,
    );
    fs.promises.writeFile(newHtmlPath, htmlContent, 'utf-8');
    console.log(htmlContent);
  }
}

const stylePath = path.join(__dirname, 'styles');
const newStyleFilePath = path.join(__dirname, 'project-dist', 'style.css');
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
  await fs.promises.open(newStyleFilePath, 'a');
  await fs.promises.writeFile(newStyleFilePath, '', 'utf-8');
  arr.forEach((item) => {
    fs.promises.appendFile(newStyleFilePath, item, 'utf-8');
  });
}

let folderAssetsPath = path.join(__dirname, 'assets');
let copyFolderPath = path.join(__dirname, 'project-dist', 'assets');

async function copyDir(folderAssetsPath, copyFolderPath) {
  await fs.promises.rm(copyFolderPath, { recursive: true, force: true });
  await fs.promises.mkdir(copyFolderPath, { recursive: true, force: true });

  let dirFile = await fs.readdir(
    folderAssetsPath,
    { withFileTypes: true },
    (err, files) => {
      if (err) {
        console.error('Ошибка чтения');
        return;
      }
      files.forEach((file) => {
        if (file.isDirectory()) {
          let newFolderAssetsPath = path.join(folderAssetsPath, file.name);
          let newCopyFolderPath = path.join(copyFolderPath, file.name);
          copyDir(newFolderAssetsPath, newCopyFolderPath);
        } else {
          const filePath = path.join(folderAssetsPath, file.name);
          const newFilePath = path.join(copyFolderPath, file.name);
          fs.copyFile(filePath, newFilePath, (err) => {
            if (err) {
              console.error('Ошибка копирования');
              return;
            }
          });
        }
      });
    },
  );
  return dirFile;
}
async function buildPage() {
  await doneTask();
  await mergeStyles();
  await copyDir(folderAssetsPath, copyFolderPath);
}
buildPage();
