let Home = {
  render: async () => {
    let view = `
      <section>
        <h1> Page not found </h1>
      </section>
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
        window.location.href = "/#/";
      }
    })

  }
}

export default Home;