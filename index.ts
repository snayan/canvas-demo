import { getQuery } from 'common/util';
import './index.scss';

function success() {
  console.log('load module success');
}

function fail() {
  console.log('load module fail');
}

async function main() {
  let query = getQuery();
  let example = query.module || 'main';
  if (example === 'main') {
    await import(/* webpackPreload: true */ './example/main');
  } else {
    await import(`./example/${example}`);
  }
}

/* register pwa */
function registerPWA() {
  if (process.env.NODE_ENV === 'production' && 'serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker
        .register('./dist/service-worker.js')
        .then((registration) => {
          console.log('SW registered: ', registration);
        })
        .catch((registrationError) => {
          console.log('SW registration failed: ', registrationError);
        });
    });
  }
}

/* 主函数 */
main();
registerPWA();
