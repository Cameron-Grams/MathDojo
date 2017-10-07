var questionNumber = 0;
var sessionProblemsArray = [];

function requestSession( userId, operation, number, min, max ){
    $.ajax({
      method: 'POST',
      url: '/api/generate-session',
      data: JSON.stringify( { userId, operation, number, min, max } ),
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

function checkOperation( string ){
    switch( string ){
        case 'addition':
          console.log( string );
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
               if( pair[ 0 ] == variable ){ return checkOperation(pair[ 1 ] ); }
       }
       return( false );
}

function createSession( ){
    let userId = getQueryVariable( 'userId' )
    let operation = getQueryVariable( 'opertion' );
    console.log( operation );
    let number = getQueryVariable( 'number' );
    let min = getQueryVariable( 'min' );
    let max = getQueryVariable( 'max' );
    requestSession( userId, operation, number, min, max );
};

//handler to clear values in input boxes
$( '.js-inputBox' ).focus( function(){
    $( this ).val( '' );
} );

$( createSession );