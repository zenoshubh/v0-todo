import { execSync } from 'child_process';

console.log('[v0] Running pnpm db:push...');

try {
  execSync('pnpm db:push', { stdio: 'inherit' });
  console.log('[v0] Database schema pushed successfully!');
} catch (error) {
  console.error('[v0] Error running pnpm db:push:', error.message);
  process.exit(1);
}
