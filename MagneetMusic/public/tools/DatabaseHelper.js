export async function loadSongs() {
  const snapshot = await firebase.database().ref('/songs').once('value');
  return snapshot.val();
}

export async function loadAlbums() {
  const snapshot = await firebase.database().ref('/albums').once('value');
  return snapshot.val();
}

export async function loadArtists() {
  const snapshot = await firebase.database().ref('/artists').once('value');
  return snapshot.val();
}

export async function loadPlaylists() {
  const snapshot = await firebase.database().ref('/playlists').once('value');
  return snapshot.val();
}

export async function getArtistById(id) {
  const snapshot = await firebase.database().ref('/artists/' + id).once('value');
  return snapshot.val();
}

export async function getAlbumImageById(id) {
  let storageReference = firebase.storage().ref();
  const imageReference = storageReference.child('albumsCovers/' + id + '.jpg');
  const url = await imageReference.getDownloadURL();
  return url;
}

export async function getArtistImageById(id) {
  let storageReference = firebase.storage().ref();
  const imageReference = storageReference.child('artistsCovers/' + id + '.jpg');
  const url = await imageReference.getDownloadURL();
  return url;
}

export async function getPlaylistCoverById(id) {
  let storageReference = firebase.storage().ref();
  const imageReference = storageReference.child('playlistsCovers/' + id + '.jpg');
  const url = await imageReference.getDownloadURL();
  return url;
}

export async function getSongById(id) {
  const snaphot = await firebase.database().ref('/songs/' + id).once('value');
  return snaphot.val();
}

export async function loadSongFileById(id) {
  let storageReference = firebase.storage().ref();
  const songReference = storageReference.child('songsFiles/' + id + '.mp3');
  const url = await songReference.getDownloadURL();
  return url;
}

export async function loadUsersMusicQueue() {
  const snapshot = await firebase.database().ref('/users_music_queue');
  return snapshot.val();
}

export async function getUsersCount() {
  const snapshot = await firebase.database().ref('/users_cnt').once('value');
  return snapshot.val();
}

export async function setUsersCount(cnt) {
  await firebase.database().ref('/users_cnt').set(cnt);
}

export async function updateUserMusicQueue(user, newMusic) {
  
  const snapshot = await firebase.database().ref('/users_music_queue').once('value');
  const queues = snapshot.val();

  let userId = 0;

  for (let [index, queue] of queues.entries()) {
    if (queue) {
      if (queue.user == user) {
        userId = index;
        break;
      }
    }
  }

  firebase.database().ref('/users_music_queue/' + userId + '/queue/').remove();

  let i = 0;
  for(let songId of newMusic) {
    console.log("new music" + songId);
    firebase.database().ref('/users_music_queue/' + userId + '/queue/' + i + '/id').set(songId);
    i = i + 1;
  }
}