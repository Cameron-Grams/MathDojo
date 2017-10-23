var currentRank, currentLevel;

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
        success: (data) => {displayUserRecord(data)},
        error: () => { location.href = 'login.html' }
    });
}

function parseJwt (token) {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace('-', '+').replace('_', '/');
    return JSON.parse(window.atob(base64));
};

//loader for time to authenticate and load
function identifyUser(){
    const userId = getQueryVariable('userId');
    requestUserInfo(userId);
    console.log(userData);
}

function displayUserRecord(data){
    currentLevel = 0;
    console.log('in display: ', data);
    const token = localStorage.getItem('token');
    const payloadData = parseJwt(token);
    const lengthOfTraining = data.length;
    for (let i = 0; i < lengthOfTraining; i++){
        const pastPracticeSession = dateFormat(data[i]).pastPractice; 
        currentLevel += dateFormat(data[i]).sessionPoints;
         $('#js-pastPractices').prepend(pastPracticeSession);
    }
    const userName = payloadData.userName;
    console.log('current Level: ', currentLevel);
    const rankObject = assessUserRank(currentLevel);
    $('#userName').html(userName);
    $('#beltDiv').css( 'background-color', rankObject.colorDiv);
    $('#currentLevel').html(rankObject.currentRank);
    $('#loader-wrapper').fadeOut();
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
        location.href= `training.html?sessionId=${ data._id }&currentLevel=${currentLevel}` },
      dataType: 'json',
      contentType: 'application/json'
    });
 }

function logOutSession(){
    localStorage.removeItem('token');
    location.href = 'login.html';
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

function reselectRange(){
    const instructions = '<h2 style="color:red">You must select number with a separation of more than 5.</h2>';
    $('#js-alerts').prepend(instructions);
}

//handler for initial start of practice session, enters the session values
$( '#js-startExercise' ).on( 'click', function(){  
    let operation = $( '#js-operationType' ).val();   
    let number = $( '#js-practiceType' ).val();
    let min = $( '#js-minRange' ).val();
    let max = $( '#js-maxRange' ).val();
    let reNumber = /[a-zA-Z]+/; //include test for other characters
    if ( !reNumber.test(min) && !reNumber.test(max)){
        return (+max - +min < 5) ? reselectRange(): requestSession( operation, number, min, max );
    } else {   
        reselectRange();
    }
} );

//handler to clear values in input boxes
$( '.js-inputBox' ).focus( function(){
    $( this ).val( '' );
} );

$( function(){
    checkUser();
} );
