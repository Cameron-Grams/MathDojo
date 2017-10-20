var sessionId, currentLevel;
var questionNumber = 0;
var numberCorrect = 0;
var sessionProblemsArray = [];
var practiceLength;

//ensures that a user is logged in to see the training page
const token = localStorage.getItem( 'token' );
if ( !token ){
    location.href = 'login.html';
}

function logOutSession(){
    localStorage.removeItem('token');
    location.href = 'login.html';
}

function sendSession( sessionId ){
    $.ajax({
      method: 'GET',
      headers: {
        Authorization: localStorage.getItem( 'token' )
      },
      url: `/api/sendSession/${ sessionId}`,
      success: function(data) {
        console.log( 'data returned is: ', data );
        manageSessionData( data );
      },
      dataType: 'json',
      contentType: 'application/json'
    });
  }

  //mechanics of the AJAX call sending the PATCH request to the problem object
function updateProblem( sessionId, problemIndex, userResponse ){
    $.ajax({
      method: 'PATCH',
      headers: {
        Authorization: localStorage.getItem( 'token' )
      },
      url: `/api//session/${sessionId}/${problemIndex}`,
      data: JSON.stringify({userResponse }),
      success: function(data) {
        console.log( 'problem updated: ', data );
      },
      dataType: 'json',
      contentType: 'application/json'
    });
  }


//AJAX call to update the session performance accuracy
function recordSessionAccuracy(sessionId, ratioCorrect, pointsAwarded){
    $.ajax({
      method: 'PATCH',
      headers: {
        Authorization: localStorage.getItem('token')
      },
      url: `/api/session-performance/${sessionId}`,
      data: JSON.stringify({ratioCorrect, pointsAwarded}),
      success: returnDashboard(),
      dataType: 'json',
      contentType: 'application/json'
    });
  }

function parseJwt (token) {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace('-', '+').replace('_', '/');
    return JSON.parse(window.atob(base64));
};

//extracts the current session's problems as an array from the session data object
function manageSessionData( session ){
    sessionProblemsArray = session[ 0 ].problems;
    const payloadData = parseJwt(token);
    const userName = payloadData.userName;
    $('#userName').html(userName);
    const currentRank =  assessUserRank(currentLevel).currentRank;  
    console.log(currentRank);
    $('#currentLevel').html(currentRank);
    displayProblem( sessionProblemsArray );
    $('#loader-wrapper').fadeOut();
    return sessionProblemsArray;
}

//manages the display of the currentQuestion based on questionNumber
function displayProblem( sessionProblemsArray ){
    practiceLength = sessionProblemsArray.length;
    if ( questionNumber < practiceLength ){
        $( '#js-displayQuestion' ).html( `${ sessionProblemsArray[ questionNumber ].problem }` );
    }
    if ( questionNumber === practiceLength ){
        const ratioCorrect = numberCorrect / practiceLength;
        const pointsAwarded = ratioCorrect * practiceLength;
        console.log(pointsAwarded);
        recordSessionAccuracy(sessionId, ratioCorrect, pointsAwarded);       
    };
}

function returnDashboard(){
    location.href = `dashboard.html`;
}


// Render question if can
// check if was not last question
    // if not call server with users respond
    // render another question
// //////////////////////////////////////////
// // if yes call server with user respond
// // // after call is done call server to calculate users acuracy


//evaluates user answer based on questionNumber in session array, controls advance of the 
// global questionNumber variable
function evaluateResponse( userResponse ){
    let responseString = `<div>${ sessionProblemsArray[ questionNumber ].problem } = ${ userResponse }</div>`;
    let correct = +userResponse === sessionProblemsArray[ questionNumber ].correctResponse;
    if ( correct ){
        $( responseString ).attr( 'class', 'correct' );
        $( '#correctResponses' ).append( responseString );
        numberCorrect += 1;
    } else {
        $( responseString ).attr( 'class', 'incorrect' ); 
        $( '#incorrectResponses' ).append( responseString );
    }
    sessionProblemsArray[ questionNumber ].userResponse = userResponse; 
    updateProblem( sessionId, questionNumber, userResponse );
    questionNumber += 1;
    displayProblem( sessionProblemsArray );
}

$( '#js-userResponse' ).keydown( function( e ){
    let responseAnswer = $( '#js-userResponse' ).val();
    if ( e.keyCode === 13 ){
        evaluateResponse( responseAnswer );
        clearInput();
    }
} )

function checkOperation( string ){
    switch( string ){
        case 'addition':
          return '+';
        case 'subtraction':
          return '-';
        case 'multiplication':
          return '*';
        case 'division':
          return '/';
        default:
          return string;
    }
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

function beginSession( ){
    sessionId = getQueryVariable('sessionId');
    currentLevel = getQueryVariable('currentLevel');
    sendSession(sessionId);
};

function clearInput(){
    $( '.js-inputBox' ).val( '' );
}
//handler to clear values in input boxes
$( '.js-inputBox' ).focus( clearInput );

$( beginSession );