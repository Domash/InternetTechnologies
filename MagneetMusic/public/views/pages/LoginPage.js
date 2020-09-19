let LoginPage = {
  render: async () => {
    let view = `
    <section class="auth-section">
      <form class="log-form">
        <div>
          <div class="div-flex-auth">
            <div class="div-help-auth-text">
              <input type="email" id="email_field" placeholder="Email...">
            </div>
            <div class="div-help-auth-text">
              <input type="password" id="password_field" placeholder="Password...">
            </div>
            <div class="div-button-auth">
              <button id="login_button" class="btn-cyan">LogIn!</button>
            </div>
          </div>
        </div>
      </form>
    </section>
    `
    return view;
  },
  after_render: async () => {

    const login_button = document.getElementById("login_button");

    login_button.addEventListener ("click", () => {
      const email = document.getElementById("email_field");
      const password = document.getElementById("password_field");

      const auth = firebase.auth();
      const promise = auth.signInWithEmailAndPassword(email.value, password.value);

      promise.then(function(user) {
        window.location.href = "/#/";
      }).catch(e => alert(e.message));

      // firebase part
    });
  }
}

export default LoginPage;