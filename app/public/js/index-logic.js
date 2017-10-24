var currentRank, currentLevel;

function checkUser( ){
    const token = localStorage.getItem( 'token' );
    if ( !token ){
        location.href = 'login.html';
    }
    $.ajax( {
        url: '/api/user/dashboard',
        headers: {
            Authorization: token,
        },
        success: (data) => {displayUserRecord(data)},
        error: () => { location.href = 'login.html' }
    });
}
   
function requestSession( operation, number, min, max ){
    $.ajax({
      method: 'POST',
      headers: {
          Authorization: localStorage.getItem( 'token' )
      },
      url: '/api/session',
      data: JSON.stringify( { operation, number, min, max } ),
      success: function(data) {
        location.href= `training.html?sessionId=${ data._id }&currentLevel=${currentLevel}` },
      dataType: 'json',
      contentType: 'application/json'
    });
 }

 
function parseJwt (token) {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace('-', '+').replace('_', '/');
    return JSON.parse(window.atob(base64));
};
 
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
        const sessionClass = dateFormat(data[i]).classColor;
        if (sessionClass === 'red'){
            $('#js-lowPerformance').prepend(pastPracticeSession);
        } 
        if (sessionClass === 'yellow'){
            $('#js-midPerformance').prepend(pastPracticeSession);
        }
        if (sessionClass === 'green'){
            $('#js-highPerformance').prepend(pastPracticeSession);
        }
    }
    const userName = payloadData.userName;
    $('#userName').html(userName);
    const rankObject = assessUserRank(currentLevel);  
    if ( rankObject.colorDiv === 'black'){
        $('#beltDiv').css('color', 'white');
    }
    if (rankObject.currentRank === 'FULL NINJA!'){
        $('#beltDiv').css('color', 'red');
    }
    $('#beltDiv').css( 'background-color', rankObject.colorDiv);
    $('#currentLevel').html(rankObject.currentRank);
    $('#loader-wrapper').fadeOut();
};

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


$('#js-maxRange').on('keypress', (e) => {
    if (e.keyCode === 13){
        sendValues();
    }
})

//handler for initial start of practice session, enters the session values
$( '#js-startExercise' ).on( 'click', sendValues);
   
function sendValues(){
    let operation = $( '#js-operationType' ).val();   
    let number = $( '#js-practiceType' ).val();
    let min = $( '#js-minRange' ).val();
    let max = $( '#js-maxRange' ).val();
    if ( isNaN(min) || isNaN(max)){
        reselectRange();
    } else {   
        return (+max - +min < 5) ? reselectRange(): requestSession( operation, number, min, max );
    }
};


//handler to clear values in input boxes
$( '.js-inputBox' ).focus( function(){
    $( this ).val( '' );
} )

$( function(){
    checkUser();
} );
