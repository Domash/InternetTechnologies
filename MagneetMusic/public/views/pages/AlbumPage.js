import Utils from '../../tools/Utils.js'
import * as DatabaseHelper from '../../tools/DatabaseHelper.js'

let AlbumPage = {
  render: async () => {
    let view = `
      <section class="album-page-section">
        <div class="logo-div">
          <div class="top-logo-div">
            <img id="logo-img-id" class="logo-image" src="../assets/images/background.png">
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

    const logoTag = document.getElementById('logo-img-id');
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
      logoTag.src = coverImgUrl;

      var index = 0;
      for (const songId of songs) {
        index++;

        let songSnaphot = await firebase.database().ref('/songs/' + songId).once('value');
        let song = songSnaphot.val();

        let li = document.createElement('LI');
        li.className = 'album-list-li';
        li.innerHTML = `
          <div class="track-div">
            <div class="track-cover-div">
            <div class="play-image-div">
              <img class="play-image-track" src="../../images/play_image.png"/>
            </div>
              <img class="track-cover-image" src=${coverImgUrl}>
            </div>
            <p class="track-number">${index}.</p>
            <p class="track-name">${song.name}</p>
          </div>
          <div class="track-len-div">
            <p class="track-len-text">3.00</p>
          </div>
        `;

        songsListTag.appendChild(li);
      }
    });

    songsListTag.addEventListener("click", async function(e) {
      if (e.target && e.target.nodeName == "IMG") {
        console.log("PLAY");
      }
    });


  }
}

export default AlbumPage;