//ensures that valid tokens immediately go to the index 
const token = localStorage.getItem('token');

if (token){
  location.href = 'dashboard.html';
}

//AJAX call to create a new user
function registerAccount( name, email, password ){
    $.ajax({
      method: 'POST',
      url: '/api/user',
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
  
//function to display any errors returned from the user endpoint  
function displayErrorMessage(data){
  const dataObject = JSON.parse(data.responseText);
  const errorMessage = `<h2>${dataObject["message"]}</h2>`; 
  console.log(dataObject["message"]);
  $('#registration').prepend(errorMessage);
}

//redirect to the login page on successful generation of the new user
function manageNewUser( data ){
    location.href = 'login.html';
}
 
//handler for the inputs needed for registration, initiates the AJAX call
$( '#registrationForm' ).on( 'submit', (e) => {
  e.preventDefault(); 
  $('#loader-wrapper').fadeIn()
  let name = $( '#enterName' ).val();
  let email = $( '#enterEmail' ).val();
  let password = $( '#enterPassword' ).val();
  registerAccount( name, email, password );
} ); 