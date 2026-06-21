const { spawnSync } = require('child_process');
const path = require('path');

const root = path.resolve(__dirname, '..');
const bin = (name) => path.join(root, 'node_modules', '.bin', name);
const hasCloudAuth = Boolean(process.env.TINA_CLIENT_ID && process.env.TINA_TOKEN);

const run = (command, args) => {
  const result = spawnSync(command, args, {
    cwd: root,
    stdio: 'inherit',
  });

  if (result.error) {
    throw result.error;
  }

  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }
};

run(process.execPath, [path.join(root, 'scripts', 'sync-featured.cjs')]);

if (hasCloudAuth) {
  run(bin('tinacms'), ['build']);
} else {
  run(bin('tinacms'), ['build', '--local', '--skip-cloud-checks']);
}

run(bin('vite'), ['build']);
