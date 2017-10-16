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
   
    location.href = `dashboard.html?userId=${data._id}`;

}

$( '#logIn' ).on( 'click', () => {
  let email = $( '#enterEmail' ).val();
  let password = $( '#enterPassword' ).val();
  logintoAccount( email, password );
} );