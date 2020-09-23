import * as DatabaseHelper from '../../tools/DatabaseHelper.js'

let Player = {
  render: async () => {
    let view = `
      <section class="player-section" id="player-section">
        <div class="player-cover">
          <img class="player-cover" id="player-cover" str="images/cover-image.png">
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
    const playerSection = document.getElementById('player-content');
    
    const prevButton = document.getElementById('prev-id');
    const nextButton = document.getElementById('next-id');

    let user;
    let queueIndex = 0;
    let musicQueue = [];
    let isFirstRun = true;
    let isPlayerActive = false;


    firebase.auth().onAuthStateChanged(async firebaseUser => {
      if (firebaseUser) {
          isFirstRun = true;
          user = firebase.auth().currentUser.email;
          await loadMusicQueue();
          playerSection.classList.remove("hidden");
      } else {
          isPlayerActive = false;
          player.pause();
          playPauseImgTag.src = "images/play.png";
          playerSection.classList.add("hidden");
      }
    });

    async function loadMusicQueue() {
      let snapshot = await firebase.database().ref('/users_music_queue');
      snapshot.on('value', async function(snapshot) {
        let userMusicQueue = snapshot.val();

        for (const [index, queue] of userMusicQueue.entries()) {
          if (queue) {
            if (queue.user == user) {
              const queueSnapshot = await firebase.database().ref('/users_music_queue/' + index + '/queue').once('value');
              let songs = queueSnapshot.val();

              console.log(songs);

              if (isFirstRun && songs == null) {
                playerSection.classList.add("hidden");
                break;
              } 
              playerSection.classList.remove("hidden");

              musicQueue = [];
              if(songs) {
                for (let [id, songId] of Object.entries(songs)) {
                  musicQueue.push(songId.id);
                }
                
                queueIndex = 0;
                await loadSong();
              }

              break;
            }
          }
        }

        if (!isFirstRun) {
          play();
        }

        isFirstRun = false;
      });
    }

    async function loadSong() {
      let songId = musicQueue[queueIndex];
      const song = await DatabaseHelper.getSongById(songId - 1);
      //console.log(song);
      player.src = await DatabaseHelper.loadSongFileById(songId);
      playerCoverImgTag.src = await DatabaseHelper.getAlbumImageById(song.coverId);
    }

    function play() {
      console.log("PLAY");
      isPlayerActive = true;
      player.play();
      playPauseImgTag.src = "images/stop.png";
    }

    function pause() {
      isPlayerActive = false;
      player.pause();
      playPauseImgTag.src = "images/play.png";
    }

    function updateProgress() {
      var current = player.currentTime;
      var percent = (current / player.duration) * 100;
      progressTag.style.width = percent + '%';
    }

    async function prev() {
      queueIndex = queueIndex - 1;
      if (queueIndex == -1) {
        queueIndex = musicQueue.length - 1;
      }
      await loadSong();
      play();
    }

    async function next() {
      queueIndex = queueIndex + 1;
      if (queueIndex == musicQueue.length) {
        queueIndex = 0;
      }
      await loadSong();
      play();
    }

    prevButton.addEventListener('click', async function(e) {
      await prev();
    });

    nextButton.addEventListener('click', async function(e) {
      await next();
    });

    playImageTag.addEventListener("click", async function(e) {
      if (isPlayerActive) {
        pause();
      } else {
        play();
      }
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