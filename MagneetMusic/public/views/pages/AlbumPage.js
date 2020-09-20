import Utils from '../../tools/Utils.js'
import * as DatabaseHelper from '../../tools/DatabaseHelper.js'

let AlbumPage = {
  render: async () => {
    let view = `
      <section class="album-page-section">
        <div class="logo-div">
          <div class="top-logo-div">
            <img class="logo-image" src="../assets/images/background.png">
          </div>
          <div class="bottom-logo-div">
            <h3 id="album-name-id" class="text-album-name">Album</h3>
            <p id="artist-name-id" class="text-album-description">Description</p>
          </div>
        </div>

        <div class="album-list-div">
          <ul id="songs-list-id" class="album-list-ul">
          </ul>
        </div>
      </section>  
    `
    return view;
  },
  after_render: async () => {

    let request = Utils.parseRequestURL()

    let albumId = decodeURIComponent(request.id);
    albumId--;

    const albumNameTag = document.getElementById('album-name-id');
    const artistNameTag = document.getElementById('artist-name-id');
    const songsListTag = document.getElementById('songs-list-id');

    let snapshot = await firebase.database().ref('albums/' + albumId);

    snapshot.on("value", async function(snapshot) {
      let album = snapshot.val();
      let songs = album.songs;

      albumNameTag.innerHTML = album.name;
      artistNameTag.innerHTML = album.author;

      const coverImgUrl = await DatabaseHelper.getAlbumImageById(album.coverId);

      for (const songId of songs) {
        let songSnaphot = await firebase.database().ref('/songs/' + songId).once('value');
        let song = songSnaphot.val();

        let li = document.createElement('LI');
        li.className = 'album-list-li';
        li.innerHTML = `
          <div class="track-div">
            <div class="track-cover-div">
              <img class="track-cover-image" src=${coverImgUrl}>
            </div>
            <p class="track-number">${song.mp3Id}</p>
            <p class="track-name">${song.name}</p>
          </div>
          <div class="track-len-div">
            <p class="track-len-text">3.00</p>
          </div>
        `;

        songsListTag.appendChild(li);
      }


    })


  }
}

export default AlbumPage;