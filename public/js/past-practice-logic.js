//the global variable to set the background color based on the sessions performance 
var backgroundColor;

//ensures that no token will lead back to the login page
const token = localStorage.getItem( 'token' );
  if ( !token ){
      location.href = 'login.html';
  }

//the AJAX call that populates the page with the given session's data  
function getSession(sessionId){
    $.ajax({
      method: 'GET',
      headers: {
          Authorization: localStorage.getItem( 'token' )
      },
      url: `/api/session/${sessionId}`,
      success: (data) => {displaySessionProblems(data)},
      dataType: 'json',
      contentType: 'application/json'
    });
 }

//the helper function that reads the values passed in the URL 
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

//the function that reads the problems from the data and fomats them with the proper conventions for accuracy 
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

//renders the display of the problems after receiving formatting 
function displaySessionProblems(data){
    $('#pastBody').css('background-color', backgroundColor );
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

    $('#loader-wrapper').fadeOut();
}

//helper function that adjusts the display of the given color names, effort to optimize presentation 
function moderateColors(colorName){
    switch(colorName){
        case 'red':
            return 'rgba(204, 56, 48, 0.5)';
        case 'green':
            return 'rgba(20, 160, 17, 0.5)';
        case 'yellow':
            return 'rgba(242, 176, 43, 0.7)';
        default:
            return 'error';
    }
}

//initiator function that reads the values from the URL and makes the AJAX call to get the page's data 
function beginDisplay(){
    const getSessionName = getQueryVariable('sessionId');
    const rawColor = getQueryVariable('classColor');
    backgroundColor = moderateColors(rawColor);
    getSession(getSessionName);
}

$(beginDisplay);