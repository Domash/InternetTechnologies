let Home = {
  render: async () => {
    let view = `
    <nav class="nav-container">
      <div class="nav-container-nav">
        <a class="nav-ref" href="">Overview</a>
        <a class="nav-ref" href="">Albums</a>
        <a class="nav-ref" href="">Playlists</a>
        <a class="nav-ref" href="">Likes</a>
        <a class="nav-ref" href="">Following</a>
      </div>
    </nav>
    
    `;
    return view;
  },
  after_render: async () => {

    console.log("Hello");

    const header = document.getElementById("header-content");
    const content = document.getElementById("main-content");

    firebase.auth().onAuthStateChanged(async user => {
      if (user) {

      } else {

      }
    })

  }
}

export default Home;