//user token information is generated in the user authentication step and stored on local storage
const token = localStorage.getItem('token');

//if the user has a valid token they are redirected to the index page, the user dashboard for their profile 
if (token){
  location.href = 'index.html';
}

//the loader css is faded out after the page loads 
function readyLogIn(){
  $('#loader-wrapper').fadeOut();
}

//the AJAX call to authenticate the user and derive a user token 
 function logintoAccount( email, password ){
    $.ajax({
      method: 'POST',
      url: '/api/user/authenticate',
      data: JSON.stringify( { email, password } ),
      success: manageLogin,
      error: () => { 
        alert( 'bad login' )
        readyLogIn();
        $('.inputEntries').val('');
      },
      dataType: 'json',
      contentType: 'application/json'
    });
  };

//previous tokens are removed and the current newly issued token is stored in local storage, the user is then redirected to train at the index  
function manageLogin(data){
    localStorage.removeItem('token');
    localStorage.setItem('token', data.token);
    location.href = `index.html`;
}

//the event handler to log in with a return to 'enter' 
$('#enterPassword').on( 'keypress', (e) => {
  let email = $('#enterEmail').val();
  let password = $('#enterPassword').val();
  if (e.keyCode === 13){
    logintoAccount(email,password);
  }
})

//the event handler to log in by hitting the log in button
$('#logIn').on('click', () => {
  $('#loader-wrapper').fadeIn();
  let email = $('#enterEmail').val();
  let password = $('#enterPassword').val();
  logintoAccount(email, password);
} );
