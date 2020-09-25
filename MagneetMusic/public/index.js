"use strict";

import Home from './views/pages/Home.js';
import Error404 from './views/pages/Error404.js';
import LoginPage from './views/pages/LoginPage.js';
import RegisterPage from './views/pages/RegisterPage.js';
import AlbumPage from './views/pages/AlbumPage.js';
import ArtistPage from './views/pages/ArtistPage.js';
import LibraryPage from './views/pages/LibraryPage.js';
import SearchPage from './views/pages/SearchPage.js';

import Header from './views/components/Header.js';
import Player from './views/components/Player.js';

import Utils from './tools/Utils.js';

const routes = {
  '/': Home,
  '/signin': LoginPage,
  '/signup': RegisterPage,
  '/album/:id': AlbumPage,
  '/artist/:id': ArtistPage,
  '/library': LibraryPage,
  '/search/:id': SearchPage
}

const router = async () => {
  const header = null || document.getElementById('header-content');
  const main_content = null || document.getElementById('main-content');
  const player_content = null || document.getElementById('player-content');

  header.innerHTML = await Header.render();
  await Header.after_render();

  main_content.innerHTML = await Home.render();
  await Home.after_render();

  player_content.innerHTML = await Player.render();
  await Player.after_render();

  let request = Utils.parseRequestURL()

  let parsedURL = (request.resource ? '/' + request.resource : '/') + (request.id ? '/:id' : '') + (request.verb ? '/' + request.verb : '')
  console.log(parsedURL)

  let page = routes[parsedURL] ? routes[parsedURL] : Error404
  main_content.innerHTML = await page.render();
  
  await page.after_render();
}

const routerForContinueslyPlaying = async () => {
  const header = null || document.getElementById('header-content');
  const main_content = null || document.getElementById('main-content');
  const player_content = null || document.getElementById('player-content');

  header.innerHTML = await Header.render();
  await Header.after_render();

  main_content.innerHTML = await Home.render();
  await Home.after_render();

  let request = Utils.parseRequestURL()

  let parsedURL = (request.resource ? '/' + request.resource : '/') + (request.id ? '/:id' : '') + (request.verb ? '/' + request.verb : '')
  console.log(parsedURL)

  let page = routes[parsedURL] ? routes[parsedURL] : Error404
  main_content.innerHTML = await page.render();
  
  await page.after_render();
}

// Listen on hash change:
window.addEventListener('hashchange', routerForContinueslyPlaying);

// Listen on page load:
window.addEventListener('load', router);