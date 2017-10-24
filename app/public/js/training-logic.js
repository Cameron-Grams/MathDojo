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
        Authorization: localStorage.getItem('token')
      },
      url: `/api/session/${sessionId}`,
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
      url: `/api/session/${sessionId}`,
      data: JSON.stringify({userResponse, action: 'problem', index: problemIndex }),
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
      url: `/api/session/${sessionId}`,  //this call is not happening 
      data: JSON.stringify({action: 'accuracy', ratioCorrect, pointsAwarded}),
      success: () => { console.log('in record session callback')},     //returnDashboard(),
      dataType: 'json',
      contentType: 'application/json'
    });
  }


function abandonSession(){
     $.ajax({
      method: 'DELETE',
      headers: {
        Authorization: localStorage.getItem('token')
      },
      url: `/api/session/remove-session/${sessionId}`,
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
    const rankObject =  assessUserRank(currentLevel); //this requires the currentLevel as a number 
    const currentRank = rankObject.currentRank;
    const rankColorStyle = rankObject.colorDiv;
    console.log(currentRank);
    $('#currentLevel').html(currentRank);
    $('#beltDiv').css('background-color', rankColorStyle);
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


function returnDashboard(){
    location.href = `index.html`;
}

$( '#js-userResponse' ).keydown( function( e ){
    let responseAnswer = $( '#js-userResponse' ).val();
    if ( e.keyCode === 13 ){
        evaluateResponse( responseAnswer );
        clearInput();
    }
} )

$('#submitAnswerBtn').on('click', (e) => {
    let responseAnswer = $('#js-userResponse').val();
    e.preventDefault();
    evaluateResponse(responseAnswer);
    clearInput();
})

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
    currentLevel = getQueryVariable('currentLevel');  //passing this as a string did not matter
    sendSession(sessionId);
};

function clearInput(){
    $( '.js-inputBox' ).val( '' );
}
//handler to clear values in input boxes
$( '.js-inputBox' ).focus( clearInput );

$( beginSession );