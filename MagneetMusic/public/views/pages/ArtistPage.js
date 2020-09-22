import Utils from '../../tools/Utils.js'
import * as DatabaseHelper from '../../tools/DatabaseHelper.js'

let ArtistPage = {
  render: async () => {
    let view = `
      <section class="albums-section">
        <div class="artists-section-div">
        <div class="top-logo-div">
          <img id="logo-img-id" class="logo-image" src="../assets/images/background.png">
        </div>
        <div class="bottom-logo-div">
            <h3 id="artist-name-id" class="text-album-name">Album</h3>
        </div>
        <div class="album-list-div">
          <ul id="songs-list-id" class="album-list-ul">
          </ul>
        </div>
        </div>
      </section>
    `
    return view;
  },
  after_render: async () => {

    let request = Utils.parseRequestURL();

    let artistId = decodeURIComponent(request.id);

    console.log(artistId);

    const logoTag = document.getElementById('logo-img-id');
    const artistNameTag = document.getElementById('artist-name-id');
    const songsListTag = document.getElementById('songs-list-id');

    let artist = await DatabaseHelper.getArtistById(artistId);
    let coverArtistImg = await DatabaseHelper.getArtistImageById(artist.coverId);

    artistNameTag.innerHTML = artist.name;
    logoTag.src = coverArtistImg;

    let songs = await DatabaseHelper.loadSongs();

    var indexInPlaylist = 0;
    for (let song of songs) {
      if (song.author.toLowerCase() == artist.name.toLowerCase()) {
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
    }

  }
}

export default ArtistPage;