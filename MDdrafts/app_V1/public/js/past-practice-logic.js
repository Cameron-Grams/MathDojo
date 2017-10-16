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
        success: beginDisplay(),
        error: () => { location.href = 'login.html' }
    })
}

function getSession(sessionId){
    $.ajax({
      method: 'GET',
      headers: {
          Authorization: localStorage.getItem( 'token' )
      },
      url: `/api/sendSession/${sessionId}`,
      success: (data) => {displaySessionProblems(data)},
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

function formatProblem(data){
    let responseClass, displayAnswer;
    if (data.correctResponse === +data.userResponse){
        responseClass = "correctResponse";
        displayAnswer = data.correctResponse;
    } else {
        responseClass = "standardResponse";
        displayAnswer = `<span class="incorrectResponse">${data.userResponse}</span> should have been <span class="informCorrect">${data.correctResponse}</span>`;
    }
    let problemString = `<h3 class="${responseClass}">${data.problem} = ${displayAnswer}</h3>`;
    return problemString;  
}

function displaySessionProblems(data){
    const sessionTitle = dateFormat(data[0]).displayTitle;
    $('#js-sessionTitleInformation').html(sessionTitle);

    const sessionPerformance = (data[0].ratioCorrect * 100).toFixed(2);
    const performanceString = `<h3>Performance this session was ${sessionPerformance}&#37; accuracy</h3>`;


    $('#js-sessionPerformance').html(performanceString);

    const problemSeriesLength = data[0].problems.length;
    for ( let i = 0; i < problemSeriesLength; i++){
        let displayNextProblem = formatProblem(data[0].problems[i]);
        $('#js-displayProblems').prepend(displayNextProblem);
    }

}

function beginDisplay(){
    const getSessionName = getQueryVariable('sessionId');
    getSession(getSessionName);
}

$(checkUser);