"use strict";

import LoginPage from './views/pages/LoginPage.js';
import RegisterPage from './views/pages/RegisterPage.js';
import Home from './views/pages/Home.js'
import Error404 from './views/pages/Error404.js';

import Header from './views/components/Header.js';

import Utils from './tools/Utils.js';

const routes = {
  '/': Home,
  '/signin': LoginPage,
  '/signup': RegisterPage
}

const router = async () => {
  const header = null || document.getElementById('header-content');
  const main_content = null || document.getElementById("main-content");

  header.innerHTML = await Header.render();
  await Header.after_render();

  let request = Utils.parseRequestURL()

  let parsedURL = (request.resource ? '/' + request.resource : '/') + (request.id ? '/:id' : '') + (request.verb ? '/' + request.verb : '')
  console.log(parsedURL)

  let page = routes[parsedURL] ? routes[parsedURL] : Error404
  main_content.innerHTML = await page.render();
  
  await page.after_render();
}

// Listen on hash change:
window.addEventListener('hashchange', router);

// Listen on page load:
window.addEventListener('load', router);