import './app.css';

import { Observable } from 'rxjs';
import { forkJoin } from 'rxjs/observable';

import pages from '~/pages';
import { load$ } from '~/utils';

/**
 * @name initialize-app
 */

// fonts or icons
Observable
  ::forkJoin(
    load$('https://fonts.googleapis.com/icon?family=Material+Icons')
  )
  .subscribe(result => {
    const style = document.createElement('style');

    [].forEach.call(
      result,
      (item, index) => style.innerHTML += result[index]
    );

    document.head.appendChild(style);
  });

// firebase config
firebase.initializeApp({
  apiKey: 'AIzaSyDBA0yVS0JuIqGaoN9nafvPFxPSVgmxwnw',
  authDomain: 'web-go-demo.firebaseapp.com',
  databaseURL: 'https://web-go-demo.firebaseio.com',
  projectId: 'web-go-demo',
  storageBucket: 'web-go-demo.appspot.com',
  messagingSenderId: '584431831746'
});

// service worker
if (
  'serviceWorker' in navigator &&
  (window.location.protocol === 'https:' || window.location.hostname === 'localhost')
) {
  navigator.serviceWorker
    .register('service-worker.js')
    .then(registration => {
      registration.onupdatefound = () => {
        if (navigator.serviceWorker.controller) {
          const { installing } = registration;

          installing.onstatechange = () => {
            /* eslint-disable indent */
            switch (installing.state) {
              case 'installed':
                registration.update();
                break;
              case 'activated':
                location.reload();
                break;
              case 'redundant':
                throw new Error('The installing service worker became redundant.');
              default:
                console.log('Service Worker');
            }
            /* eslint-enable indent */
          };
        }
      };
    })
    .catch(error => {
      console.error('Error during service worker registration:', error);
    });
}

// bootstrap
if (process.env.NODE_ENV === 'production') {
  Raven.config('https://70484e0dda784a1081081ca9c8237792@sentry.io/236866').install();
  Raven.context(() => pages());
} else {
  pages();
}
