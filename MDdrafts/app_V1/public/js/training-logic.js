var sessionId;
var questionNumber = 0;
var sessionProblemsArray = [];

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
        success: ( data ) => { 
            displayUserRecord( data );
        },
        error: () => { location.href = 'login.html' }
    })
}

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
    if ( questionNumber < practiceLength ){
        $( '#js-displayQuestion' ).html( `${ sessionProblemsArray[ questionNumber ].problem }` );
    }

    if ( questionNumber === practiceLength ){
 //       console.log( sessionProblemsArray );

//while working the update don't leave the page
        location.href = `dashboard.html`;
    }
}

//evaluates user answer based on questionNumber in session array, controls advance of the 
// global questionNumber variable
function evaluateResponse( userResponse ){
    let responseString = `<div>${ sessionProblemsArray[ questionNumber ].problem } = ${ userResponse }</div>`;
    let correct = +userResponse === sessionProblemsArray[ questionNumber ].correctResponse;
    if ( correct ){
        $( responseString ).attr( 'class', 'correct' );
        $( '#correctResponses' ).append( responseString );
    } else {
        $( responseString ).attr( 'class', 'incorrect' ); 
        $( '#incorrectResponses' ).append( responseString );
    }
    sessionProblemsArray[ questionNumber ].userResponse = userResponse; 
    sessionProblemsArray[ questionNumber ].goodResponse = correct ? true: false; 
//  need to send the user response information to update the individual problem by index in the session
    updateProblem( sessionId, questionNumber, userResponse );
    questionNumber += 1;
    displayProblem( sessionProblemsArray )
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
    sessionId = getQueryVariable( 'sessionId' );
    sendSession( sessionId );
};

function clearInput(){
    $( '.js-inputBox' ).val( '' );
}
//handler to clear values in input boxes
$( '.js-inputBox' ).focus( clearInput );

$( beginSession );