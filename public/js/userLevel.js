//module to format the user belt based on the added points of the past sessions 

function returnUserBelt(number){
    if (number < 50){ 
        return { beltName: 'White Belt', beltColor: 'white'};
    }
    if (number >= 50 && number < 200){ 
        return { beltName: 'Yellow Belt', beltColor: 'yellow' };
    }
    if (number >= 200 && number < 700){
        return { beltName: 'Orange Belt', beltColor: 'orange'};
    }
    if (number >= 700 && number < 1200){ 
        return { beltName: 'Green Belt', beltColor: 'green'};
    }
    if (number >= 1200 && number < 2800){ 
        return { beltName: 'Blue Belt', beltColor: 'blue'};
    }
    if (number >= 2800 && number < 3900){
        return { beltName: 'Brown Belt', beltColor: 'brown'};
    }
    if (number >= 3900 && number < 10000){ 
        return { beltName: 'Black Belt', beltColor: 'black'};
    }
    if (number >= 10000){ 
        return { beltName: 'FULL NINJA', beltColor: 'black'};
    }
};
  
//returns an object with the values formated 
function assessUserRank(number){
    const presentBelt = returnUserBelt(number);
    console.log( presentBelt );
    return {
        rankName: presentBelt.beltName,
        currentRank: `You are currently a ${presentBelt.beltName}.`,
        colorDiv: presentBelt.beltColor
    }
};

