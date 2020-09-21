let Player = {
  render: async () => {
    return `
      <section class="player-section">
        <div class="player-cover">
          <img class="" src="">
        </div>
        <div class="player-track-info">
          <p class="player-track-name">Name</p>
          <p class="player-track-name">Artist</p>
        </div>
        <div class="player-div-button">
          <button class="">
            <img id="play-image-id" class="" src="images/play-image.png">
          </button>
        </div> 
        <div class="slider">
        </div
        <audio id="player">
        </audio>
      </section>
    `;
  },
  after_render: async () => {
    const playImageTag = document.getElementById('play-image-id');
    playImageTag.src = '../../images/play_image.png';
  }
}

export default Player;