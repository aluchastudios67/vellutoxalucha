const { spawn } = require('child_process');
const p = spawn('npx', ['vercel', 'link']);
p.stdout.on('data', d => {
  const s = d.toString();
  process.stdout.write(s);
  if (s.includes('Set up')) p.stdin.write('y\n');
  if (s.includes('Which scope')) p.stdin.write('\n');
  if (s.includes('Link to existing project?')) p.stdin.write('y\n');
  if (s.includes('What’s the name of your existing project?')) p.stdin.write('vellutoxalucha\n');
});
p.stderr.on('data', d => process.stderr.write(d));
