import * as DatabaseHelper from '../../tools/DatabaseHelper.js'

let Home = {
  render: async () => {
    let view = `
    <nav class="nav-container">
      <div class="nav-container-nav">
        <a class="nav-ref" href="">Overview</a>
        <a class="nav-ref" href="">Albums</a>
        <a class="nav-ref" href="">Playlists</a>
        <a class="nav-ref" href="">Likes</a>
        <a class="nav-ref" href="">Following</a>
      </div>
    </nav>
    
    <section class="albums-section">
      <h3 class="section-title">Albums</h3>
      <div class="cover-section-div">
        <ul id="cover-list-id" class="cover-list">
        </ul>
        </div>
      </section> 
    `;
    return view;
  },
  after_render: async () => {

    console.log("Hello");

    const header = document.getElementById("header-content");
    const content = document.getElementById("main-content");

    const albumsUl = document.getElementById('cover-list-id');

    firebase.auth().onAuthStateChanged(async user => {
      if (user) {

      } else {

      }
    });

    const albums = await DatabaseHelper.loadAlbums();

    if (albums) {
      albums.forEach(async function(album) {
        console.log(album.coverId);
        const coverImgUrl = await DatabaseHelper.getAlbumImageById(album.coverId);
        let li = document.createElement('LI');
        li.className = 'cover-list-item';
        li.innerHTML = `
            <div class="cover-div">
              <a href="#">
                <img class="cover-image" src=${coverImgUrl}>
                <div class="play-image-div">
                  <img class="play-image" src="../../images/play_image.png"/>
                </div>
              </a>
            </div>
            <a class="section-album-text" href="/#/album/${album.coverId}">${album.name}</a>
            <p class="section-author-text">${album.author}</p>
        `;
        albumsUl.appendChild(li);
      });
    }

  }
}

export default Home;