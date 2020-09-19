let Header = {
  render: async () => {
    return `
    <header class="header">
      <div class="h-nav-container-left">
        <a class="h-nav-ref" href="">Home</a>
        <input type="text" placeholder="Search...">
      </div>
      <div id="h-nav-right" class="h-nav-container-right">
        <a id="log-in-link" class="div-header-buttons" href="?#/signin"><p>Login</p></a>
        <a id="reg-in-link" class="div-header-buttons" href="?#/signup"><p>Registration</p></a>
      </div>
    
      </div>
      </header>
    `;
  },
  after_render: async () => {

    const header = document.getElementById("header-content");
    const h_nav_right = document.getElementById("log-in-link");

    firebase.auth().onAuthStateChanged(async user => {
      if (user) {
        document.getElementById("log-in-link").style.display = 'none';
        document.getElementById("reg-in-link").style.display = 'none';
        document.getElementById("log-in-link").style.display = '';
        document.getElementById("reg-in-link").style.display = '';
      } else {

      }
    
    });
  }
}

export default Header;