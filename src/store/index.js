// vendor
import { Promise } from 'es6-promise';

// setting
import setting from '../setting';

// https://developer.github.com/v3/repos/#get
let URL = (name) => `https://api.github.com/repos/${setting.config.repo}/contents/${name}?ref=${setting.config.branch}`;

let store = {};

export default store;

/**
 * fetch post content from github
 *
 * @param title
 * @returns {Promise}
 */
store.getPost = (title, path = 'markdown') => {

  const POST_API_URL = `https://api.github.com/repos/${setting.config.repo}/contents/${path}/${title}?ref=${setting.config.branch}`;

  return new Promise((resolve, reject) => {

    const xhr = new XMLHttpRequest();

    xhr.open('GET', `${POST_API_URL}`);

    // https://developer.github.com/v3/media/#html
    xhr.setRequestHeader("Accept", "application/vnd.github.v3.html");
    xhr.onload = () => {
      const resText = xhr.responseText;
      resolve(resText);
    };

    xhr.onerror = () => reject;
    xhr.send();
  });
}

/**
 * fetch the list from cache or from github api
 *
 * @param page
 * @returns {Promise}
 */
store.getListByName = (name = 'markdown') => {
  return new Promise((resolve, reject) => {

    if (sessionStorage && sessionStorage.getItem(name)) {

      // read data from cache
      resolve(JSON.parse(sessionStorage.getItem(name)));
    } else {

      const xhr = new XMLHttpRequest();
      xhr.open('GET', URL(name));
      xhr.onload = () => {
        const resJson = xhr.responseText;
        
        // caching
        sessionStorage.setItem(name, resJson);
        resolve(JSON.parse(resJson));
      };
      xhr.onerror = () => reject;
      xhr.send();
    }
  });
}
