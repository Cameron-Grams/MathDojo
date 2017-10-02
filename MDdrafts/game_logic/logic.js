var questionNumber = 0;
const session = {
	questions: [{
    	problem: '2 + 2',
        solution: 4,
        usersInput: 7,
        wasCorrect: false,
    }, {
    	problem: '4 + 2',
        solution: 6,
        usersInput: 6,
        wasCorrect: true,
    }, {
    	problem: '1 + 2',
        solution: 3,
        usersInput: null,
    }, {
    	problem: '8 + 2',
        solution: 10,
        usersInput: null,
    },
    {
    	problem: '11 + 2',
        solution: 13,
        usersInput: null,
    }, {
    	problem: '8 + 4',
        solution: 12,
        usersInput: null,
    } ]
}
// is the best way to advance through the number of practice questions a global counting variable?
$( '#js-userResponse' ).keydown( function( e ){
        let responseAnswer = $( '#js-userResponse' ).val();
        if ( e.keyCode === 13 ){
            console.log( 'in handler', responseAnswer );
            evaluateResponse( responseAnswer );
    }
} )


function practice( num ){
    if ( questionNumber <= num ){
        $( '#js-displayQuestion' ).html( `${ session.questions[ questionNumber ].problem }` );
    }
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
    practice( questionNumber );
}

$( '#js-startExercise' ).on( 'click', function(){     
    let goal = $( '#js-practiceType' ).val();
    practice( goal );
} );

$( '#js-userResponse' ).focus( function(){
    $( '#js-userResponse' ).val( '' );
} );

$( '#js-numberQuestions' ).focus( function(){
    $( '#js-numberQuestions' ).val( '' );
})
