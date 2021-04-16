const form = document.getElementById('myForm');
const signup = document.getElementById('signup');

signup.addEventListener('click', () => {
  if(signup.textContent === "Sign Up"){
    form.innerHTML = `
        <form action="/sign_up" method="POST">
          <div class="mb-3">
            <label for="firstName" class="form-label">First Name</label>
            <input type="text" class="form-control" name="firstName" id="firstName" aria-describedby="emailHelp" required>
          </div>
          <div class="mb-3">
            <label for="lastName" class="form-label">Last Name</label>
            <input type="text" class="form-control" name="lastName" id="lastName" aria-describedby="emailHelp" required>
          </div>
          <div class="mb-3">
            <label for="exampleInputEmail1" class="form-label">Email address</label>
            <input type="email" name="email" class="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" required>
            <div id="emailHelp" class="form-text">We'll never share your email with anyone else.</div>
          </div>
          <div class="mb-3">
            <label for="exampleInputPassword1" class="form-label">Password</label>
            <input type="password" name="password" class="form-control" id="exampleInputPassword1" required>
          </div>
          <div class="mb-3">
            <label for="exampleInputPasswordConfirmation" class="form-label">Confirm Password</label>
            <input type="password" name="confirmPassword" class="form-control" id="exampleInputPasswordConfirmation" required>
          </div>
          <button type="submit" class="btn btn-primary">Sign Up</button>
        </form> 
    `;
    signup.textContent = "Log In";
  } else {
    form.innerHTML = `
      <form action="/login" method="POST">
      <div class="mb-3">
        <label for="exampleInputEmail1" class="form-label">Email address</label>
        <input type="email" name="email" class="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" required>
        <div id="emailHelp" class="form-text">We'll never share your email with anyone else.</div>
      </div>
      <div class="mb-3">
        <label for="exampleInputPassword1" class="form-label">Password</label>
        <input type="password" name="password" class="form-control" id="exampleInputPassword1" required>
      </div>
      <div class="mb-3 form-check">
        <input type="checkbox" class="form-check-input" id="exampleCheck1">
        <label class="form-check-label" for="exampleCheck1">Remember Me</label>
      </div>
      <button type="submit" class="btn btn-primary">Log In</button>
      </form>
    `;

    signup.textContent = "Sign Up";
  }
});