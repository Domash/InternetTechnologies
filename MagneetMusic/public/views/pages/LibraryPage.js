import * as DatabaseHelper from '../../tools/DatabaseHelper.js'

let LibraryPage = {
  render: async () => {
    let view = `
      <section class="album-page-section">
        <h1 class="text-album-name" id ="search-product-id">Library:</h3>
        <div class="album-list-div">
          <ul id="songs-list-id" class="album-list-ul">
          </ul>
        </div>
      </section>
    `;
    return view;
  },
  after_render: async () => {
    const songsListTag = document.getElementById('songs-list-id');

    let songs = await DatabaseHelper.loadSongs();

    var indexInPlaylist = 0;
    for (let song of songs) {
      let index = song.mp3Id; 

      indexInPlaylist++;
      const coverImgUrl = await DatabaseHelper.getAlbumImageById(song.coverId);
      let li = document.createElement('LI');
      li.className = 'album-list-li';
      li.innerHTML = `
        <div class="track-div">
          <div class="track-cover-div">
          <div class="play-image-div">
            <img id ="${index}" class ="play-image-track" src="../../images/play_image.png"/>
          </div>
            <img id = "${index}" class="track-cover-image" src=${coverImgUrl}>
          </div>
          <p class="track-number">${indexInPlaylist}.</p>
          <p class="track-name">${song.author + "/" + song.name}</p>
        </div>
        <div class="track-len-div">
          <p class="track-len-text">3.00</p>
        </div>
      `;

      songsListTag.appendChild(li);
    }

    songsListTag.addEventListener("click", async function(e) {
      if (e.target && e.target.nodeName == "IMG") {
        console.log(e.target.id);
        if(firebase.auth().currentUser) {
          DatabaseHelper.updateUserMusicQueue(firebase.auth().currentUser.email, [e.target.id]);
        } else {
          alert("Login first.");
        }
      }
    });
  }
}

export default LibraryPage;