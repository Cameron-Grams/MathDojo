//module to format the user belt based on the added points of the past sessions 

function returnUserBelt(number){
    if (number < 5){ 
        return { beltName: 'White Belt', beltColor: 'white'};
    }
    if (number >= 5 && number < 20){ 
        return { beltName: 'Yellow Belt', beltColor: 'yellow' };
    }
    if (number >= 20 && number < 200){
        return { beltName: 'Orange Belt', beltColor: 'orange'};
    }
    if (number >= 200 && number < 500){ 
        return { beltName: 'Green Belt', beltColor: 'green'};
    }
    if (number >= 500 && number < 1800){ 
        return { beltName: 'Blue Belt', beltColor: 'blue'};
    }
    if (number >= 1800 && number < 3900){
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
    return {
        rankName: presentBelt.beltName,
        currentRank: `You are currently a ${presentBelt.beltName}.`,
        colorDiv: presentBelt.beltColor
    }
};

