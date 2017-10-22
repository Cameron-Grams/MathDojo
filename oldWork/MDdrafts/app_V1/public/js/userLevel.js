function returnUserBelt(number){
    if (number < 50){ return 'White Belt';}
    if (number >= 50 && number < 200){ return 'Yellow Belt';}
    if (number >= 200 && number < 400){ return 'Orange Belt';}
    if (number >= 400 && number < 600){ return 'Green Belt';}
    if (number >= 600 && number < 800){ return 'Blue Belt';}
    if (number >= 800 && number < 900){ return 'Brown Belt';}
    if (number >= 900 && number < 1000){ return 'Black Belt';}
    if (number >= 1000){ return 'FULL NINJA!';}
}

function assessUserRank(number){
    const presentBelt = returnUserBelt(number);
    return {
        currentRank: `You are currently a ${presentBelt}.`
    }
}