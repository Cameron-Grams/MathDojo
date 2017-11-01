const token = localStorage.getItem( 'token' );

//event handler to redirect to the login page
function returnToIndex(){
    console.log('in return');

    if ( token ){ 
        location.href = 'index.html'; 
    } else {
        location.href = 'login.html';
    }
};



