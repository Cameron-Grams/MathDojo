 function registerAccount( name, email, password ){
    $.ajax({
      method: 'POST',
      url: '/api/register',
      data: JSON.stringify( { name, email, password } ),
      success: function(data) {
        manageNewUser( data );
      },
      dataType: 'json',
      contentType: 'application/json'
    });
  }
  
  function manageNewUser( data ){
      console.log( data );
      //send the data to the dashboard page--will produce a blank dashboard page
      console.log( 'id: ', data[ '_id' ] );
//      location.href = `dashboard.html?_id=${ data[ '_id' ] }`;
      location.href = 'login.html';
  }
  
  $( '#sendRegistration' ).on( 'click', () => {
    let name = $( '#enterName' ).val();
    let email = $( '#enterEmail' ).val();
    let password = $( '#enterPassword' ).val();
    registerAccount( name, email, password );
  } ); 