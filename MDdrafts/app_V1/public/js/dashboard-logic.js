function checkUser( ){
    const token = localStorage.getItem( 'token' );
    if ( !token ){
        location.href = 'login.html';
    }
    $.ajax( {
        url: '/api/dashboard',
        headers: {
            Authorization: token,
        },
        success: ( data ) => { 
            displayUserRecord( data );
        },
        error: () => { location.href = 'login.html' }
    })
}
//loader for time to authenticate and load
function identifyUser(){
    const userId = getQueryVariable('userId');

    requestUserInfo(userId);
    console.log(userData);
}

function displayUserRecord( data ){
    const lengthOfTraining = data.length;
    for (let i = 0; i < lengthOfTraining; i++){
        const pastPracticeSession = dateFormat(data[i]).pastPractice; 
         $('#js-pastPractices').prepend(pastPracticeSession);
    }
    const userName = identifyUser();
    console.log(userName);
    $('#userName').html(userName);
};
 
function requestSession( operation, number, min, max ){
    $.ajax({
      method: 'POST',
      headers: {
          Authorization: localStorage.getItem( 'token' )
      },
      url: '/api/generate-session',
      data: JSON.stringify( { operation, number, min, max } ),
      success: function(data) {
        location.href= `training.html?sessionId=${ data._id }` },
      dataType: 'json',
      contentType: 'application/json'
    });
 }

function getQueryVariable( variable )
{
       var query = window.location.search.substring( 1 );
       var vars = query.split( "&" );
       for ( var i=0;i<vars.length;i++ ) {
               var pair = vars[ i ].split( "=" );
               if( pair[ 0 ] == variable ){ return pair[ 1 ]; }
       }
       return( false );
}


//handler for initial start of practice session, enters the session values
$( '#js-startExercise' ).on( 'click', function(){  
    let operation = $( '#js-operationType' ).val();   
    let number = $( '#js-practiceType' ).val();
    let min = $( '#js-minRange' ).val();
    let max = $( '#js-maxRange' ).val();
    requestSession( operation, number, min, max );
} );

//handler to clear values in input boxes
$( '.js-inputBox' ).focus( function(){
    $( this ).val( '' );
} );

$( function(){
    checkUser();
} );
