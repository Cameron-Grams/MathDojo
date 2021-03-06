var currentRank, currentLevel;

//if the user is not authenticated with a token he is routed to the explanation page, where he can select to train and login
function checkUser( ){
    const token = sessionStorage.getItem( 'token' );
    if ( !token ){
        location.href = 'login.html';
    }
    $.ajax( {
        url: '/api/user/basic-info',
        headers: {
            Authorization: token,
        },
        success: (data) => {displayUserRecord(data)},
        error: () => { 
            sessionStorage.removeItem( 'token' );
            location.href = 'math-dojo.html' }
    });
}
   
//this is the call to generate the session from the session endpoint, it redirects to the training html page with json session data
function requestSession( operation, number, min, max ){
    $.ajax({
      method: 'POST',
      headers: {
          Authorization: sessionStorage.getItem( 'token' )
      },
      url: '/api/session',
      data: JSON.stringify( { operation, number, min, max } ),
      success: function(data) {
        location.href= `training.html?sessionId=${ data._id }&currentLevel=${currentLevel}` },
      dataType: 'json',
      contentType: 'application/json'
    });
 }
 
//the token is built at user authentication in the userRouter  
function parseJwt (token) {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace('-', '+').replace('_', '/');
    return JSON.parse(window.atob(base64));
};
  
//this function displays the data returned by the call to basic-info (the past sessions) and the data contained in the token
//from authentication (user name, level and id)
function displayUserRecord(data){
    currentLevel = 0;
    let sessionNumber = 1;
    const token = sessionStorage.getItem('token');
    const payloadData = parseJwt(token);
    const lengthOfTraining = data.length;
    for (let i = 0; i < lengthOfTraining; i++){
        if ( data[ i ].pointsAwarded >= 0 ){
            const sessionDetails = dateFormat(data[i]).pastPractice; 
            let numberSession = sessionNumber + i;
            const sessionClass = dateFormat(data[i]).classColor;
            const pastPracticeSession = `<div style="color:white">${numberSession}. ${sessionDetails}</div>`;        
            currentLevel += dateFormat(data[i]).sessionPoints;  
            $('#js-pastPractices').prepend(pastPracticeSession);
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

//the event handler for a call to log out; removes the token from local storage
function logOutSession(){
    sessionStorage.removeItem('token');
    location.href = 'login.html';
}
 
//the helper function to read the data passed between html pages in the URL
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

//the function to format an incorrect range selection alert
function reselectRange(){
    const instructions = '<h2 style="color:red">You must select numbers with a separation of more than 5.</h2>';
    $('#js-alerts').prepend(instructions);
}

//helper function to redirect to the instructions splash page
function showInstructions(){
    location.href="math-dojo.html";
}

// handlers to control the selection of training type by clicking images and image highlights by select
$( () => {
    $( '.deskTrainingTypeFormat').on( 'click', 'img', function(){
        $( '.deskTrainingTypeFormat > img' ).removeClass( 'active' );
        $( this ).addClass( 'active' );
        const value = $( this ).data( 'val' );
        $( '#js-practiceType' ).val( value ); 
    });
    $( '#js-practiceType' ).change( function(){
        const selected = $( '#js-practiceType option:selected' ).val();
        $( '.deskTrainingTypeFormat > img' ).removeClass( 'active' ); 
        $( `.deskTrainingTypeFormat > img[data-val = ${selected} ]` ).addClass( 'active' ); 
    })
})

//handler to send on enter
$('#js-maxRange').on('keypress', (e) => {
    if (e.keyCode === 13){
        sendValues();
    }
})

//handler for initial start of practice session, enters the session values
$( '#js-startExercise' ).on( 'click', sendValues);
   
//handler to read in values from inputs and call the AJAX call function, requestSession
function sendValues(){
    let selectMin, selectMax;
    let operation = $( '#js-operationType' ).val();   
    let number = $( '#js-practiceType' ).val();
    let min = $( '#js-minRange' ).val();
    let max = $( '#js-maxRange' ).val();
    let mobileMin = $( '#js-mobileMinRange' ).val(); 
    let mobileMax = $( '#js-mobileMaxRange' ).val(); 
    if ( ( isNaN(min) || isNaN(max) ) && ( isNaN( mobileMax ) || isNaN( mobileMin ) ) ){
        reselectRange();
    } else { 
        let validNumber = ( Math.abs(+max - +min) < 5) || ( Math.abs( +mobileMax - +mobileMin ) < 5 ); 
        [ selectMin, selectMax ] = ( isNaN( min ) && isNaN( max ) ) ? [ mobileMin, mobileMax ]: [ min, max ];
        return (validNumber) ? reselectRange(): requestSession( operation, number, selectMin, selectMax );
    }
};

//handler to clear values in input boxes
$( '.js-inputBox' ).focus( function(){
    $( this ).val( '' );
} )

$( function(){
    checkUser();
} );
