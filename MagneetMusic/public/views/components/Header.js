let Header = {
  render: async () => {
    return `
    <header class="header">
      <div class="h-nav-container-left">
        <a class="h-nav-ref" href="">Home</a>
        <input type="text" placeholder="Search...">
      </div>
      <div id="h-nav-right" class="h-nav-container-right">
        <a id="log-out" class="div-header-buttons"><p>Logout</p></a>
        <a id="log-in" class="div-header-buttons" href="?#/signin"><p>Login</p></a>
        <a id="reg-in" class="div-header-buttons" href="?#/signup"><p>Registration</p></a>
      </div>
    
      </header>
    `;
  },
  after_render: async () => {
    const log_in_button = document.getElementById("log-in");
    const reg_in_button = document.getElementById("reg-in");
    const logout_button = document.getElementById("log-out");
    
    logout_button.addEventListener('click', e => {
      firebase.auth().signOut();
    })

    firebase.auth().onAuthStateChanged(async user => {
      if (user) {
        document.getElementById("log-out").style.display = '';
        document.getElementById("log-in").style.display = 'none';
        document.getElementById("reg-in").style.display = 'none';
      } else {
        document.getElementById("log-in").style.display = '';
        document.getElementById("reg-in").style.display = '';
        document.getElementById("log-out").style.display = 'None';
      }
    });

    // const search = document.getElementById();
    // search.addEventListener("keyup", function(event) {
    //   if (event.keyCode === 13) {
    //     event.preventDefault();
    //     document.location = "";
    //   }
    // });

  }
}

export default Header;