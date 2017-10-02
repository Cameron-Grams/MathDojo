var questionNumber = 0;

// is the best way to advance through the number of practice questions a global counting variable?

//client will need to have the AJAX calls to the endpoints in the session router...

function requestSession( operation, number, min, max ){
    $.ajax({
      method: 'POST',
      url: '/api/generate-session',
      data: JSON.stringify( { operation, number, min, max } ),
      success: function(data) {
        practice( data );
      },
      dataType: 'json',
      contentType: 'application/json'
    });
  }

function practice( session ){
    console.log( session );
    console.log( 'number of problems: ', session.length )
    let practiceLength = session.length;
    if ( questionNumber <= practiceLength ){
        $( '#js-displayQuestion' ).html( `${ session[ questionNumber ].problem }` );
    }
}

function evaluateResponse( userResp ){
    console.log( ' in eval ', questionNumber );
    let responseString = `<div>${ session[ questionNumber ].problem } = ${ userResp }</div>`;
    if ( +userResp === session[ questionNumber ].solution ){
        console.log( 'correct response' );
        $( responseString ).attr( 'class', 'correct' );
        $( '#correctResponses' ).append( responseString );
    } else {
        console.log( 'incorrect response' );
        $( responseString ).attr( 'class', 'incorrect' ); 
        $( '#incorrectResponses' ).append( responseString );
    }
    questionNumber += 1;
    return practice( questionNumber );
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
