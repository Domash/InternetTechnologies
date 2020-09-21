import * as DatabaseHelper from '../../tools/DatabaseHelper.js'

let Player = {
  render: async () => {
    return `
      <section class="player-section">
        <div class="player-cover">
          <img class="" id="player-cover">
        </div>

        <div class="player-main-div">
          <div class="play-pause-btn">  
            <img class="play-pause-img" id="play-pause-id" src="images/play.png">
          </div>
 
          <div class="controls">
            <div class="slider" data-direction="horizontal">
              <div class="progress">
                <div class="pin" id="progress-pin"></div>
              </div>
            </div>
            <p class="total-time">0:00</span>
          </div>
      
          <audio id="player">
          </audio>
        </div>

      </section>
    `;
  },
  after_render: async () => {
    const playImageTag = document.getElementById('play-pause-id');
    const player = document.getElementById('player');
    const playerCoverImgTag = document.getElementById('player-cover');
    
    playerCoverImgTag.src = "images/play.png";

    let isPlayerActive = false;

    await getSong();

    async function getSong() {
      let songId = 1;
      const songUrl = await DatabaseHelper.loadSongFileById(songId);
      console.log(songUrl);
      player.src = songUrl;
      console.log(player.src);
    }



    function swapPlayerStatus() {
      console.log(player.paused);
      if (isPlayerActive) {
        isPlayerActive = false;
        player.pause();
      } else {
        isPlayerActive = true;
        console.log("PLAY");
        player.play();
      }
    }

    playImageTag.addEventListener("click", async function(e) {
      console.log("CLICK");
      swapPlayerStatus();
    });

    player.addEventListener('ended', function () {
      player.play();
    });
  }

}

export default Player;