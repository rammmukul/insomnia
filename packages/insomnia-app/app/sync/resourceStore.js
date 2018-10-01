import path from 'path';
import fs from 'fs';
import process from 'process';
import { promisify } from 'util';

const l = console.log;
const REPO = 'https://github.com/insomniatest/insomniatest.git';
const gtihub = 'github.com/insomniatest/insomniatest.git';
const USER = 'insomniatest';
const PASS = 'ins0mniatest';
const remote = `https://${USER}:${PASS}@${gtihub}`;
const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);

const repoDir = path.join(process.env.HOME, '.testGitRepo');
if (!fs.existsSync(repoDir)) {
  fs.mkdirSync(repoDir);
}
l('<><><>>>><', repoDir);
const simpleGit = require('simple-git/promise');

const git = simpleGit(repoDir);
async function init() {
  const isRepo = await git.checkIsRepo();
  if (!isRepo) {
    await git.init();
    await git.addRemote('remoteDB', REPO);
  }

  l(await git.pull('remoteDB', 'master'));
  await writeFile(path.join(repoDir, 'db.json'), `{"data": "${Date.now().toLocaleString()}"}`);
  const dbFile = await readFile(path.join(repoDir, 'db.json'));
  l('readFile', dbFile.toString());
  await git.add(path.join(repoDir, 'db.json'));
  await git.commit('commited', l);
  await git.raw(['push', '--set-upstream', remote, 'master']);
}

init();
