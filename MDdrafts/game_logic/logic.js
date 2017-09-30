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

function practice( num ){
    if ( questionNumber < num ){
        $( '#js-displayQuestion' ).html( `${ session.questions[ questionNumber ].problem }` );
    }
    $( '#js-userResponse' ).keydown( function( e ){
        if ( e.keyCode === 13 ){
            let responseAnswer = $( '#js-userResponse' ).val();
            evaluateResponse( responseAnswer );
        }
    } )
}

function evaluateResponse( userResp ){
    console.log( ' in eval ', questionNumber );
    let responseString = `<div>${ session.questions[ questionNumber ].problem } = ${ userResp }</div>`;
    if ( +userResp === session.questions[ questionNumber ].solution ){
        console.log( 'correct response' );
        $( '#correctResponses' ).append( responseString ).css( 'class', 'correct' );
    } else {
        console.log( 'incorrect response' );
        $( '#incorrectResponses' ).append( responseString ).css( 'class', 'incorrect' );
    }
    questionNumber += 1;
    practice( questionNumber );
    return; 
}


function generatreNumbers(){
    //
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