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
  };

function sendForDashboard( data ){
    $.ajax({
        method: 'POST',
        url: '/api/authenticate',
        data: data,
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
    location.href = `dashboard.html?_id=${ data.user[ '_id' ] }`;
    sendForDashboard( data );
}

// login returns JWT
// need to route to the dashboard
// need to query the db for past sessions on the dashboard...
// at the dashboard route to training with id and generate new session... 

$( '#newRegistration' ).on( 'click', () => {
  location.href = 'register.html';
})


$( '#logIn' ).on( 'click', () => {
  let email = $( '#enterEmail' ).val();
  let password = $( '#enterPassword' ).val();
  logintoAccount( email, password );
} );