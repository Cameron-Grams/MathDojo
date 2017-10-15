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
        success: beginDisplay(),
        error: () => { location.href = 'login.html' }
    })
}

function getSession(sessionId){
    $.ajax({
      method: 'GET',
      headers: {
          Authorization: localStorage.getItem( 'token' )
      },
      url: `/api/sendSession/${sessionId}`,
      success: (data) => {displaySessionProblems(data)},
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

function displaySessionProblems(data){
    console.log(data);
    $('#js-sessionTitleInformation')


}

function beginDisplay(){
    const getSessionName = getQueryVariable('sessionId');
    getSession(getSessionName);
}

$(checkUser);