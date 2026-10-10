import test from 'node:test';
import assert from 'node:assert/strict';
import { runInNewContext } from 'node:vm';
import { resolveConfig } from 'vite';
import { rolldown } from 'rolldown';

await test('prebundled navigation runs in a browser without a Node process global', async () => {
  const config = await resolveConfig({ logLevel: 'silent' }, 'serve');
  // Use the project's actual client optimizer options and the installed router.
  // This reproduces the stageAppNavigationFailureTarget error from a Link click.
  const options = config.environments.client.optimizeDeps.rolldownOptions;
  const bundle = await rolldown({
    ...options,
    input: 'node_modules/vinext/dist/client/app-nav-failure-handler.js',
    platform: 'browser',
  });
  try {
    const { output } = await bundle.generate({
      format: 'iife',
      name: 'navigation',
    });
    const listeners = new Map();
    const browser = {
      URL,
      console,
      window: {
        location: new URL('http://localhost/demos/brand/folio'),
        addEventListener: (name, listener) => listeners.set(name, listener),
        removeEventListener: (name) => listeners.delete(name),
      },
    };
    runInNewContext(output[0].code, browser);
    assert.doesNotThrow(() => {
      browser.navigation.stageAppNavigationFailureTarget(
        '/demos/brand/folio/login',
      );
      browser.navigation.clearAppNavigationFailureTarget();
      const dispose = browser.navigation.installAppNavigationFailureListeners();
      dispose();
    });
    assert.equal(listeners.size, 0);
    assert.equal('process' in browser, false);
  } finally {
    await bundle.close();
  }
});
