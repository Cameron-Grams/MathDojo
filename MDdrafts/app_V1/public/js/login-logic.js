 function logintoAccount( email, password ){
    $.ajax({
      method: 'POST',
      url: '/api/authenticate',
      data: JSON.stringify( { email, password } ),
      success: manageLogin,
      error: () => { alert( 'bad login' ) },
      dataType: 'json',
      contentType: 'application/json'
    });
  };

function manageLogin( data ){
    console.log( data );
    localStorage.removeItem( 'token' );
    localStorage.setItem( 'token', data.token );
   
    location.href = 'dashboard.html';

}

// login returns JWT
// need to route to the dashboard
// need to query the db for past sessions on the dashboard...
// at the dashboard route to training with id and generate new session... 


$( '#logIn' ).on( 'click', () => {
  let email = $( '#enterEmail' ).val();
  let password = $( '#enterPassword' ).val();
  logintoAccount( email, password );
} );