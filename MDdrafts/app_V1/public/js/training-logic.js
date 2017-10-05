var questionNumber = 0;
var sessionProblemsArray = [];

function requestSession( operation, number, min, max ){
    $.ajax({
      method: 'POST',
      url: '/api/generate-session',
      data: JSON.stringify( { operation, number, min, max } ),
      success: function(data) {
        manageSessionData( data );
      },
      dataType: 'json',
      contentType: 'application/json'
    });
  }
 
//extracts the current session's problems as an array from the session data object
function manageSessionData( session ){
    sessionProblemsArray = session.problems;
    console.log( sessionProblemsArray );
    displayProblem( sessionProblemsArray );
    return sessionProblemsArray;
}

//manages the display of the currentQuestion based on questionNumber
function displayProblem( sessionProblemsArray ){
    console.log( 'number of problems: ', sessionProblemsArray.length )
    let practiceLength = sessionProblemsArray.length;
    if ( questionNumber <= practiceLength ){
        $( '#js-displayQuestion' ).html( `${ sessionProblemsArray[ questionNumber ].problem }` );
    }
}

//evaluates user answer based on questionNumber in session array, controls advance of the 
// global questionNumber variable
function evaluateResponse( userResponse ){
    console.log( ' in eval ', questionNumber );
    let responseString = `<div>${ sessionProblemsArray[ questionNumber ].problem } = ${ userResponse }</div>`;
    if ( +userResponse === sessionProblemsArray[ questionNumber ].correctResponse ){
        console.log( 'correct response' );
        $( responseString ).attr( 'class', 'correct' );
        $( '#correctResponses' ).append( responseString );
    } else {
        console.log( 'incorrect response' );
        $( responseString ).attr( 'class', 'incorrect' ); 
        $( '#incorrectResponses' ).append( responseString );
    }
    questionNumber += 1;
    displayProblem( sessionProblemsArray )
}

//  *************
// The Event Handlers
//handler for user response to questions
$( '#js-userResponse' ).keydown( function( e ){
    let responseAnswer = $( '#js-userResponse' ).val();
    if ( e.keyCode === 13 ){
        evaluateResponse( responseAnswer );
    }
} )

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
