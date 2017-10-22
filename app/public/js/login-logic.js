const token = localStorage.getItem('token');

if (token){
  location.href = 'dashboard.html';
}

function readyLogIn(){
  $('#loader-wrapper').fadeOut();
}

 function logintoAccount( email, password ){
    $.ajax({
      method: 'POST',
      url: '/api/authenticate',
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
    location.href = `dashboard.html`;

}

$('#logIn').on('click', () => {
  $('#loader-wrapper').fadeIn();
  let email = $('#enterEmail').val();
  let password = $('#enterPassword').val();
  logintoAccount(email, password);
} );
