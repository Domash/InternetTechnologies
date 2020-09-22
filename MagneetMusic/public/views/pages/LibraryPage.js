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

    let snapshot = await firebase.database().ref('/songs');
    snapshot.on("value", async function(snapshot) {
      let songs = snapshot.val();

      var index = 0;
      for (let song of songs) {
        index++;
        const coverImgUrl = await DatabaseHelper.getAlbumImageById(song.coverId);
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
            <p class="track-name">${song.author + "/" + song.name}</p>
          </div>
          <div class="track-len-div">
            <p class="track-len-text">3.00</p>
          </div>
        `;

        songsListTag.appendChild(li);
      }
    });
  }
}

export default LibraryPage;