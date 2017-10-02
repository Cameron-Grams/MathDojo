

var questionNumber = 0;

// is the best way to advance through the number of practice questions a global counting variable?

//client will need to have the AJAX calls to the endpoints in the session router...

function requestSession( operation, number, min, max ){
    $.ajax({
      method: 'POST',
      url: 'localhost:8080/',
      data: JSON.stringify(operation, number, min, max ),
      success: function(data) {
        practice( data );
      },
      dataType: 'json',
      contentType: 'application/json'
    });
  }

function practice( session ){
    console.log( session );

/*

    if ( questionNumber <= session.length ){
        $( '#js-displayQuestion' ).html( `${ session.questions[ questionNumber ].problem }` );
    }
    $( '#js-userResponse' ).keydown( function( e ){
        let responseAnswer = $( '#js-userResponse' ).val();
        if ( e.keyCode === 13 ){
            console.log( 'in handler', responseAnswer );
            evaluateResponse( responseAnswer );
        }
    } )

    */
}

function evaluateResponse( userResp ){
    console.log( ' in eval ', questionNumber );
    let responseString = `<div>${ session.questions[ questionNumber ].problem } = ${ userResp }</div>`;
    if ( +userResp === session.questions[ questionNumber ].solution ){
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

$( '#js-startExercise' ).on( 'click', function(){  
    let operation = $( '#js-operationType' ).val();   
    let number = $( '#js-practiceType' ).val();
    let min = $( '#js-minRange' ).val();
    let max = $( '#js-maxRange' ).val();

    requestSession( operation, number, min, max );
} );

$( '.js-inputBox' ).focus( function(){
    $( this ).val( '' );
} );

$( '#js-numberQuestions' ).focus( function(){
    $( '#js-numberQuestions' ).val( '' );
})