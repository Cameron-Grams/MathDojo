var questionNumber = 0;
var sessionProblemsArray = [];

function sendSession( sessionId ){
    $.ajax({
      method: 'GET',
      headers: {
        Authorization: localStorage.getItem( 'token' )
      },
      url: `/api/sendSession/${ sessionId}`,
//      data: { sessionId }, // JSON.stringify( { sessionId } ),
      success: function(data) {
        console.log( 'data returned is: ', data );
        manageSessionData( data );
      },
      dataType: 'json',
      contentType: 'application/json'
    });
  }

//extracts the current session's problems as an array from the session data object
function manageSessionData( session ){
    sessionProblemsArray = session[ 0 ].problems;
    console.log( 'problems at: ', session[ 0 ].problems );
    displayProblem( sessionProblemsArray );
    return sessionProblemsArray;
}

//manages the display of the currentQuestion based on questionNumber
function displayProblem( sessionProblemsArray ){
    let practiceLength = sessionProblemsArray.length;
    if ( questionNumber <= practiceLength ){
        $( '#js-displayQuestion' ).html( `${ sessionProblemsArray[ questionNumber ].problem }` );
    }
}

//evaluates user answer based on questionNumber in session array, controls advance of the 
// global questionNumber variable
function evaluateResponse( userResponse ){
    let responseString = `<div>${ sessionProblemsArray[ questionNumber ].problem } = ${ userResponse }</div>`;
    if ( +userResponse === sessionProblemsArray[ questionNumber ].correctResponse ){
        $( responseString ).attr( 'class', 'correct' );
        $( '#correctResponses' ).append( responseString );
    } else {
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
// sessionId 

function beginSession( ){
    let sessionId = getQueryVariable( 'sessionId' );
    sendSession( sessionId );
};

//handler to clear values in input boxes
$( '.js-inputBox' ).focus( function(){
    $( this ).val( '' );
} );

$( beginSession );