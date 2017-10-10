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
        success: () => { alert( 'all good' ) },
        error: () => { location.href = 'login.html' }
    })
}





function sendForSession( userId, operation, number, min, max ){
    location.href = `training.html?userId=${ userId }&operation=${ operation }&number=${ number }&min=${ min }&max=${ max }`;
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
    console.log( location.href );
    let userId = getQueryVariable( '_id' );
    let operation = $( '#js-operationType' ).val();   
    let number = $( '#js-practiceType' ).val();
    let min = $( '#js-minRange' ).val();
    let max = $( '#js-maxRange' ).val();
    sendForSession( userId, operation, number, min, max );
} );

//handler to clear values in input boxes
$( '.js-inputBox' ).focus( function(){
    $( this ).val( '' );
} );

$( function(){
    checkUser();
    
} );
