import Utils from '../../tools/Utils.js'
import * as DatabaseHelper from '../../tools/DatabaseHelper.js'

let ArtistPage = {
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


  }
}

export default ArtistPage;