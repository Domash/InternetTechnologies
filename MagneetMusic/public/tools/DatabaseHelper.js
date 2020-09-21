export async function loadSongs() {

}

export async function loadAlbums() {
  const snapshot = await firebase.database().ref('/albums').once('value');
  return snapshot.val();
}

export async function getAlbumImageById(id) {
  let storageReference = firebase.storage().ref();
  const imageReference = storageReference.child('albumsCovers/' + id + '.jpg');
  const url = await imageReference.getDownloadURL();
  return url;
}

export async function loadArtists() {
  
}

export async function loadPlaylists() {

}

export async function loadPlaylistCover(id) {

}

export async function loadArtistCover(id) {

}

export async function loadSongFileById(id) {
  let storageReference = firebase.storage().ref();
  const songReference = storageReference.child('songsFiles/' + id + '.mp3');
  const url = await songReference.getDownloadURL();
  return url;
}