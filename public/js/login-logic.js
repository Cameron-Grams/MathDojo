const token = localStorage.getItem('token');

if (token){
  location.href = 'index.html';
}

function readyLogIn(){
  $('#loader-wrapper').fadeOut();
}

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

function manageLogin(data){
    console.log(data);
    localStorage.removeItem('token');
    localStorage.setItem('token', data.token);
    location.href = `index.html`;

}

$('#enterPassword').on( 'keypress', (e) => {
  let email = $('#enterEmail').val();
  let password = $('#enterPassword').val();
  if (e.keyCode === 13){
    logintoAccount(email,password);
  }
})

$('#logIn').on('click', () => {
  $('#loader-wrapper').fadeIn();
  let email = $('#enterEmail').val();
  let password = $('#enterPassword').val();
  logintoAccount(email, password);
} );
