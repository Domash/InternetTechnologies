import * as DatabaseHelper from '../../tools/DatabaseHelper.js'

let Home = {
  render: async () => {
    let view = `
    <nav class="nav-container">
      <div class="nav-container-nav">
        <a class="nav-ref" href="/#/library">Library</a>
        <a class="nav-ref" href="#albums-title">Albums</a>
        <a class="nav-ref" href="#artist-title">Artists</a>
        <a class="nav-ref" href="/#/">Playlists</a>
        <a class="nav-ref" href="/#/">Upload Track</a>
      </div>
    </nav>
    
    <section class="albums-section">
      <h3 class="section-title" id="albums-title">Albums</h3>
      <div class="cover-section-div">
        <ul id="cover-list-id" class="cover-list">
        </ul>
      </div>
    </section> 

    <section class="artists-section">
      <h3 class="section-title" id="artist-title">Artists</h3>
      <div class="artists-section-div">
        <ul id="artists-list-id"class="artists-list">
        </ul>
      </div>
    </section> 
    `;
    return view;
  },
  after_render: async () => {

    const header = document.getElementById("header-content");
    const content = document.getElementById("main-content");

    const albumsUl = document.getElementById('cover-list-id');
    const artistsUl = document.getElementById('artists-list-id');

    firebase.auth().onAuthStateChanged(async user => {
      if (user) {

      } else {
        
      }
    });

    const albums = await DatabaseHelper.loadAlbums();
    const artists = await DatabaseHelper.loadArtists();

    if (albums) {
      albums.forEach(async function(album) {
        const coverImgUrl = await DatabaseHelper.getAlbumImageById(album.coverId);
        let li = document.createElement('LI');
        li.className = 'cover-list-item';
        li.innerHTML = `
            <div class="cover-div">
              <a href="#/">
                <img id ="${album.coverId - 1}" class="cover-image" src=${coverImgUrl}>
                <div class="play-image-div">
                  <img id ="${album.coverId - 1}" class="play-image" src="../../images/play_image.png"/>
                </div>
              </a>
            </div>
            <a class="section-album-text" href="/#/album/${album.coverId - 1}">${album.name}</a>
            <p class="section-author-text">${album.author}</p>
        `;
        albumsUl.appendChild(li);
      });
    }

    if (artists) {
      artists.forEach(async function(artist) {
        const coverImgUrl = await DatabaseHelper.getArtistImageById(artist.coverId);
        let li = document.createElement('LI');
        li.className = 'artists-list-item';
        li.innerHTML = `
          <div class ="artist-div">
            <a href="#/">
              <img class="goto-artist-image" src="${coverImgUrl}">
              <div class="goto-artist-image-div">
              </div>
            </a>
          </div>
          <a class="section-artists-text" href="/#/artist/${artist.coverId - 1}">${artist.name}</a>
        `;
        artistsUl.appendChild(li);
      });
    }

    albumsUl.addEventListener('click', async function(e) {
      if (e.target && e.target.nodeName == "IMG") {
        if(firebase.auth().currentUser) {
          let songs = await DatabaseHelper.getAlmubSongs(e.target.id);
          DatabaseHelper.updateUserMusicQueue(firebase.auth().currentUser.email, songs);
        } else {
          alert("Login first.");
        }
      }
    });

  }
}

export default Home;