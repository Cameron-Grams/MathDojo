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
//loader for time to authenticate and load

function returnDay(dayNumber){
    switch(dayNumber){
        case 0:
          return "Sunday";
        case 1:
          return "Monday";
        case 2:
          return "Tuesday";
        case 3:
          return "Wednesday";
        case 4:
          return "Thursday";
        case 5:
          return "Friday";
        case 6:
          return "Saturday";
        default:
          return "Day Error";  
    }
}

function returnMonth(numberMonth){
    switch(numberMonth){
        case 0:
          return "January";
        case 1:
          return "February";
        case 2:
          return "March";
        case 3:
          return "April";
        case 4:
          return "May";
        case 5:
          return "June";
        case 6:
          return "July";
        case 7:
          return "August";
        case 8:
          return "September";
        case 9:
          return "October";
        case 10:
          return "November";
        case 11:
          return "December";
        default:
          return "Month Error";
    }
}

function renderAccuracy( performanceNumber){
    if (performanceNumber < 0.5){
      return "lowPerformance";
    }
    const performance = performanceNumber < 0.8 ? "middlePerformance": "highPerformance";
    return performance; 
}

function displayUserRecord( data ){
    console.log( 'in display user record', data );
    const lengthOfTraining = data.length;
    for (let i = 0; i < lengthOfTraining; i++){
        const trainingDate = new Date(data[i].updatedAt);
        const displayYear = trainingDate.getFullYear();
        const displayMonth = returnMonth(trainingDate.getMonth());
        const displayDay = returnDay(trainingDate.getDay());
        const displayDate = trainingDate.getDate();
        const accuracyClass = renderAccuracy(data[i].ratioCorrect);
        $('#js-pastPractices').prepend(`<div class="js-pastRecord ${accuracyClass}" >${displayDay}, ${displayDate} ${displayMonth} ${displayYear}</div>`);
    }
};
 
function requestSession( operation, number, min, max ){
    $.ajax({
      method: 'POST',
      headers: {
          Authorization: localStorage.getItem( 'token' )
      },
      url: '/api/generate-session',
      data: JSON.stringify( { operation, number, min, max } ),
      success: function(data) {
        location.href= `training.html?sessionId=${ data._id }` },
      dataType: 'json',
      contentType: 'application/json'
    });
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

$( function(){
    checkUser();
} );
