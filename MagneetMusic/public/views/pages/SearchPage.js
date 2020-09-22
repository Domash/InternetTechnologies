import Utils from '../../tools/Utils.js'
import * as DatabaseHelper from '../../tools/DatabaseHelper.js'

let SearchPage = {
  render: async () => {
    let view = `
      <section class="album-page-section">
        <h1 class="text-album-name" id ="search-product-id">Search product: </h3>
        <div class="album-list-div">
          <ul id="songs-list-id" class="album-list-ul">
          </ul>
        </div>
      </section>
    `;
    return view;
  },
  after_render: async () => {

    let request = Utils.parseRequestURL();
    let query = decodeURIComponent(request.id);

    const searchProductTag = document.getElementById('search-product-id');
    const songsListTag = document.getElementById('songs-list-id');

    searchProductTag.innerHTML = "Search product: " + query; 

    let snapshot = await firebase.database().ref('/songs');
    snapshot.on("value", async function(snapshot) {
      let songs = snapshot.val();

      var index = 0;
      for (let song of songs) {
        let match = song.name.toLowerCase().includes(query.toLocaleLowerCase()) || 
                    song.author.toLowerCase().includes(query.toLocaleLowerCase());

        if (match) {
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
      }
    });

  }
}

export default SearchPage;