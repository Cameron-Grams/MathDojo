<<<<<<< HEAD

=======
const token = localStorage.getItem( 'token' );
>>>>>>> remediation

//event handler to redirect to the login page
function returnToIndex(){
    console.log('in return');

    if ( token ){ 
        location.href = 'index.html'; 
    } else {
        location.href = 'login.html';
    }
};



