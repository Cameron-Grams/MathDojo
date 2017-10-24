const token = localStorage.getItem('token');

if (token){
  location.href = 'dashboard.html';
}

 function registerAccount( name, email, password ){
    $.ajax({
      method: 'POST',
      url: '/api/user/register',
      data: JSON.stringify( { name, email, password } ),
      success: manageNewUser,
      error: (data) => {
          $('#loader-wrapper').fadeOut();
          console.log(data);
          displayErrorMessage(data);
        },
      dataType: 'json',
      contentType: 'application/json'
    });
  }
  
function displayErrorMessage(data){
  const dataObject = JSON.parse(data.responseText);
  const errorMessage = `<h2>${dataObject["message"]}</h2>`; 
  console.log(dataObject["message"]);
  $('#registration').prepend(errorMessage);
}

function manageNewUser( data ){
    location.href = 'login.html';
}
   
$( '#registrationForm' ).on( 'submit', (e) => {
  e.preventDefault(); 
  $('#loader-wrapper').fadeIn()
  let name = $( '#enterName' ).val();
  let email = $( '#enterEmail' ).val();
  let password = $( '#enterPassword' ).val();
  registerAccount( name, email, password );
} ); 