//global variables needed for session training
var sessionId, currentLevel;
var questionNumber = 0;
var numberCorrect = 0;
var sessionProblemsArray = [];
var practiceLength;

//ensures that a user is logged in to see the training page
const token = sessionStorage.getItem( 'token' );
if ( !token ){
    location.href = 'login.html';
}

//handler to remove token and redirect to login page on log out
function logOutSession(){
    sessionStorage.removeItem('token');
    location.href = 'login.html';
}

//retrieves the session from the db by the sessionId passed in the URL, that session data is managed in training 
function sendSession( sessionId ){
    $.ajax({
      method: 'GET',
      headers: {
        Authorization: sessionStorage.getItem('token')
      },
      url: `/api/session/${sessionId}`,
      success: function(data) {
        manageSessionData( data );
      },
      dataType: 'json',
      contentType: 'application/json'
    });
  }
 
//mechanics of the AJAX call sending the PATCH request to the problem object, this updates the individual problem objects
//in the problems array for the given session 
function updateProblem( sessionId, problemIndex, userResponse ){
    $.ajax({
      method: 'PATCH',
      headers: {
        Authorization: sessionStorage.getItem( 'token' )
      },
      url: `/api/session/${sessionId}`,
      data: JSON.stringify({userResponse, action: 'problem', index: problemIndex }),
      success: function(data) {
      },
      dataType: 'json',
      contentType: 'application/json'
    });
  }


//AJAX call to update the session performance accuracy at the conclusion of training
function recordSessionAccuracy(sessionId, ratioCorrect, pointsAwarded){
    $.ajax({
      method: 'PATCH',
      headers: {
        Authorization: sessionStorage.getItem('token')
      },
      url: `/api/session/${sessionId}`, 
      data: JSON.stringify({action: 'accuracy', ratioCorrect, pointsAwarded}),
      success: returnDashboard(), 
      dataType: 'json',
      contentType: 'application/json'
    });
  }

//if the user abandons the training session the session is deleted from the db
function abandonSession(){
     $.ajax({
      method: 'DELETE',
      headers: {
        Authorization: sessionStorage.getItem('token')
      },
      url: `/api/session/${sessionId}`,
      success: returnDashboard(),
      dataType: 'json',
      contentType: 'application/json'
    });
}
 
//helper function that reads the token
function parseJwt (token) {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace('-', '+').replace('_', '/');
    return JSON.parse(window.atob(base64));
};

//control function to prepare the training data for display
//extracts the current session's problems as an array from the session data object
//also completes call to userLevel module with data from the token
function manageSessionData( session ){
    sessionProblemsArray = session[ 0 ].problems;
    const sessionType = sessionProblemsArray.length;
    produceImage(sessionType);

    const payloadData = parseJwt(token);
    const userName = payloadData.userName;
    $('#userName').html(userName);

    const rankObject = assessUserRank(currentLevel);  
    if ( rankObject.rankName === 'Black Belt'){
        $('#beltDiv').css('color', 'white');
    }
    if (rankObject.rankName === 'FULL NINJA!'){
        $('#beltDiv').css('color', 'red');
    }
    $('#beltDiv').css( 'background-color', rankObject.colorDiv);
    $('#currentLevel').html(rankObject.currentRank);
    displayProblem( sessionProblemsArray );
    $('#loader-wrapper').fadeOut();
    return sessionProblemsArray;
}

//helper function for images 
function produceImage(number){
    let image;
    switch(number){
        case(5):
          image = "./images/mouse.jpg";
          break;
        case(10):
          image = "./images/dolphin2.jpg";
          break;
        case(15):
          image = "./images/dog.jpg";
          break;
        case(25):
          image = "./images/tiger.jpg";
          break;
        case(50):
          image = "./images/eagle.jpg";
          break;
        case(100):
          image = "./images/bear.jpg"
          break;
        default:
          console.log( "Problem getting image");
    }
    $('#trainingImage').attr('src', image);
    $('#trainingImage').attr('alt', 'animal image');
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
// user responses are captured by helper functions and displayed on DOM based on size of display
function evaluateResponse( userResponse ){
    let responseString = `<div>${ sessionProblemsArray[ questionNumber ].problem } = ${ userResponse }</div>`;
    let correct = +userResponse === sessionProblemsArray[ questionNumber ].correctResponse;
    if ( correct ){
        configureDeskTop( responseString, 'correct' );
        configureMobile( responseString, 'correct' );
        numberCorrect += 1;
    } else {
        configureDeskTop( responseString, 'incorrect' );
        configureMobile( responseString, 'incorrect' );
    }
    sessionProblemsArray[ questionNumber ].userResponse = userResponse; 
    updateProblem( sessionId, questionNumber, userResponse );
    questionNumber += 1;
    displayProblem( sessionProblemsArray );
}

// helper function to add response elements to the Mobile record
function configureMobile( responseString, className ){
    let showString = $( responseString ).attr( 'class', className );
    $( '#mobileRecord' ).prepend( showString );
}

// helper function to add the response elements to the Desk Top display record
function configureDeskTop( responseString, className ){
    let showString = $( responseString ).attr( 'class', className );
    if ( className === 'correct' ){
        $( '#correctResponses' ).append( showString );
    }
    if ( className === 'incorrect' ){
        $( '#incorrectResponses' ).append( showString );
    }
}









//helper function to return to dashboard (index) 
function returnDashboard(){
    location.href = `index.html`;
}

//event handler for return of values 
$( '#js-userResponse' ).keydown( function( e ){
    let responseAnswer = $( '#js-userResponse' ).val();
    if ( e.keyCode === 13 ){
        evaluateResponse( responseAnswer );
        clearInput();
    }
} )

//event handler for keying submit 
$('#submitAnswerBtn').on('click', (e) => {
    let responseAnswer = $('#js-userResponse').val();
    e.preventDefault();
    evaluateResponse(responseAnswer);
    clearInput();
})

//helper function to parse the URL 
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

//helper function to initiate session retrieval from db after parsing values from URL 
function beginSession( ){
    sessionId = getQueryVariable('sessionId');
    currentLevel = getQueryVariable('currentLevel'); 
    sendSession(sessionId);
};

//helper function to clear, called on return and submit 
function clearInput(){
    $( '.js-inputBox' ).val( '' );
}
//handler to clear values in input boxes
$( '.js-inputBox' ).focus( clearInput );

$( beginSession );