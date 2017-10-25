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
      return { performanceClass: "lowPerformance", classColor: 'red'};
    }
    const performance = performanceNumber < 0.8 ? { performanceClass: "middlePerformance", classColor: 'yellow'}
        : { performanceClass: "highPerformance", classColor: 'green'};
    return performance; 
}

function dateFormat(data){
    const trainingDate = new Date(data.updatedAt);
    const displayYear = trainingDate.getFullYear();
    const displayMonth = returnMonth(trainingDate.getMonth());
    const displayDay = returnDay(trainingDate.getDay());
    const displayDate = trainingDate.getDate();
    const accuracyClass = renderAccuracy(data.ratioCorrect);
    const classColor = accuracyClass.classColor;
    return {
        pastPractice: `<div class="js-pastRecord ${accuracyClass.performanceClass}" >
          <span id="sessionNumber"></span>
          <a class="linksToPastSessions" href="past-practices.html?sessionId=${data._id}&classColor=${classColor}">  
            ${displayDay}, ${displayDate} ${displayMonth} ${displayYear}
          </a>  
          </div>`,
        displayTitle: `<div class="#" >
          <h1>  
            ${displayDay}, ${displayDate} ${displayMonth} ${displayYear}
          </h1>  
          </div>`,
        sessionPoints: data.pointsAwarded,
        classColor: classColor
    };
}
