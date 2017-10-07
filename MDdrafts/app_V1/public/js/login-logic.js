 function logintoAccount( email, password ){
    $.ajax({
      method: 'POST',
      url: '/api/authenticate',
      data: JSON.stringify( { email, password } ),
      success: function(data) {
        manageLogin( data );
      },
      dataType: 'json',
      contentType: 'application/json'
    });
  }
  
function manageLogin( data ){
    console.log( data );
    // JWT and ...
}

// login returns JWT
// need to route to the dashboard
// need to query the db for past sessions on the dashboard...
// at the dashboard route to training with id and generate new session... 

$( '#logIn' ).on( 'click', () => {
  let email = $( ' ' ).val();
  let password = $( ' ' ).val();
  logintoAccount( email, password );
} );