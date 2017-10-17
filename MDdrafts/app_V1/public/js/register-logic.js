const token = localStorage.getItem('token');

if (token){
  location.href = 'dashboard.html';
}

 function registerAccount( name, email, password ){
    $.ajax({
      method: 'POST',
      url: '/api/register',
      data: JSON.stringify( { name, email, password } ),
      success: manageNewUser,
      error: () => { $('#loader-wrapper').fadeOut()},
      dataType: 'json',
      contentType: 'application/json'
    });
  }
  
  function manageNewUser( data ){
      location.href = 'login.html';
  }
   
  $( '#sendRegistration' ).on( 'click', () => {
    $('#loader-wrapper').fadeIn()
    let name = $( '#enterName' ).val();
    let email = $( '#enterEmail' ).val();
    let password = $( '#enterPassword' ).val();
    registerAccount( name, email, password );
  } ); 