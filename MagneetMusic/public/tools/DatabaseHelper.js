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

export async function loadSongFileById(id) {
  let storageReference = firebase.storage().ref();
  const songReference = storageReference.child('songsFiles/' + id + '.mp3');
  const url = await songReference.getDownloadURL();
  return url;
}