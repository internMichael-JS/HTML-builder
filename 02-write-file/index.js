const fs = require('fs');
const path = require('path');
const readline = require('readline');

const filePath = path.join(__dirname, 'text.txt');

fs.open(filePath, 'a', (err) => {
  if (err) throw err;
  console.log('File created. You can write your mind or exit.');
});

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const writeSteam = fs.createWriteStream(filePath, 'utf-8');

rl.on('line', (input) => {
  if (input.toString().trim().toLowerCase() === 'exit') {
    endProcess();
  } else {
    writeSteam.write(`${input}\n`);
  }
});
rl.on('pause', () => {
  console.log('Goodbye!');
  endProcess();
});
function endProcess() {
  writeSteam.end();
  rl.close();
}
