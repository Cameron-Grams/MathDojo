 function registerAccount( name, email, password ){
    $.ajax({
      method: 'POST',
      url: '/api/register',
      data: JSON.stringify( { name, email, password } ),
      success: manageNewUser( data ),
      dataType: 'json',
      contentType: 'application/json'
    });
  }
  
  function manageNewUser( data ){
      console.log( data );
      console.log( 'id: ', data[ '_id' ] );
      location.href = 'login.html';
  }
   
  $( '#sendRegistration' ).on( 'click', () => {
    let name = $( '#enterName' ).val();
    let email = $( '#enterEmail' ).val();
    let password = $( '#enterPassword' ).val();
    registerAccount( name, email, password );
  } ); 