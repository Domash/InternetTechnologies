let RegisterPage = {
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
            <div class="div-help-auth-text">
              <input type="password" id="password_field2" placeholder="Password...">
            </div>
            <div class="div-button-auth">
              <button id="regin_button" class="btn-cyan">Register!</button>
            </div>
          </div>
        </div>
      </form>
    </section>
    `
    return view;
  },
  after_render: async () => {
    const login_button = document.getElementById("regin_button");

    login_button.addEventListener ("click", () => {
      event.preventDefault();

      const email = document.getElementById("email_field");
      const password = document.getElementById("password_field");
      const password2 = document.getElementById("password_field2");

      if (password.value != password2.value) {
        alert(`Password != Password2`)
      } else {
        const auth = firebase.auth();
        const promise = auth.createUserWithEmailAndPassword(email.value, password.value);

        promise.then(() => {
          window.location.href = '/#/';
        }).catch(e => alert(e.message));
      }

    });
  }
}

export default RegisterPage;