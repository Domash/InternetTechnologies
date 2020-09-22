import * as DatabaseHelper from '../../tools/DatabaseHelper.js'

let Player = {
  render: async () => {
    let view = `
      <section class="player-section">
        <div class="player-cover">
          <img class="player-cover" id="player-cover">
        </div>

        <div class="player-main-div">
          <div class="play-pause-btn">
            <img class="play-pause-img" id="prev-id" src="images/prev.png">
          </div>
          <div class="play-pause-btn">
            <img class="play-pause-img" id="play-pause-id" src="images/play.png">
          </div>
          <div class="play-pause-btn">
            <img class="play-pause-img" id="next-id" src="images/next.png">
          </div>

          <div class="controls">
            <div class="slider" id="slider-id" data-direction="horizontal">
              <div class="progress" id="progress-id">
                <div class="pin" id="progress-pin"></div>
              </div>
            </div>
            <p class="total-time" id="track-time">0:00</p>
          </div>
      
          <audio id="player">
          </audio>
        </div>

      </section>
    `;

    return view;
  },
  after_render: async () => {
    const playImageTag = document.getElementById('play-pause-id');
    const player = document.getElementById('player');
    const playerCoverImgTag = document.getElementById('player-cover');
    const playPauseImgTag = document.getElementById('play-pause-id');

    const trackTimeTag = document.getElementById('track-time');
    const progressTag = document.getElementById('progress-id');
    const progressPinTag = document.getElementById('progress-pin');
    const sliderTag = document.getElementById('slider-id');
    
    playPauseImgTag.src = "images/play.png";

    let isPlayerActive = false;

    let songsId = []

    await getSong();

    async function getSong() {
      let songId = 12;
      const songUrl = await DatabaseHelper.loadSongFileById(songId);
      const coverImgUrl = await DatabaseHelper.getAlbumImageById(2);
      player.src = songUrl;
      playerCoverImgTag.src = coverImgUrl;
    }

    function swapPlayerStatus() {
      console.log(player.paused);
      if (isPlayerActive) {
        isPlayerActive = false;
        player.pause();
        playPauseImgTag.src = "images/play.png";
      } else {
        isPlayerActive = true;
        player.play();
        playPauseImgTag.src = "images/stop.png";
      }
    }

    var flag = true;

    function updateProgress() {
      if (flag) {
        var current = player.currentTime;
        var percent = (current / player.duration) * 100;
        progressTag.style.width = percent + '%';
      }
    }

    playImageTag.addEventListener("click", async function(e) {
      swapPlayerStatus();
    });

    player.addEventListener('ended', function () {
      player.play();
    });

    player.addEventListener('timeupdate', function() {
      if (player.currentTime % 60 < 10){
        trackTimeTag.innerHTML = (player.currentTime / 60 | 0) + ":0" + (player.currentTime % 60 | 0);
      }else{
        trackTimeTag.innerHTML = (player.currentTime / 60 | 0) + ":" + (player.currentTime % 60 | 0);
      }
      updateProgress();
    });

    sliderTag.addEventListener('click', function(e) {
      var currElement = this;
      let shift = (e.offsetX  / currElement.offsetWidth) * 100;
      let newTime = (shift * player.duration | 0);
      player.currentTime = newTime / 100;
    });

    // progressPinTag.addEventListener('mousedrag', function(e) {
    //   console.log('kek');
    //   var currElement = this;
    //   flag = false;
    //   let shift = (e.offsetX  / currElement.offsetWidth) * 100;
    //   let newTime = (shift * player.duration | 0) / 100;
    //   var percent = (newTime / player.duration) * 100;
    //   progressTag.style.width = percent + '%';

    // });

    // sliderTag.addEventListener('mouseleave', function(e) {
    //   flag = true;
    // });

  }

}

export default Player;