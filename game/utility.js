
var timerToBeDeleted = [];
/*
    General utility functions
*/
function weightedRand(weightedList) {
  var i;
  var sum = 0;
  var r = Math.random();
  for (i in weightedList) {
    sum += weightedList[i].weight;
    if (r <= sum)
        return i;
  }
}

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
}

/*
    Have the start time, then duration
*/
function fadeOut(object, duration) {

    var alphaFactor = (1 / duration);
    var timer = setInterval(
        function(){
            if (object.alpha < 0) {
                timerToBeDeleted.push(timer);
                if(!object.isCaught && object.isFood)  {
                    --foodCount;
                    object.isCaught = true;
                }
                childrenToDelete.push(object);
                object.destroy();
            } else {
                object.alpha -= alphaFactor;
            }
        }, duration / 10);
}

function clearTimer() {
    for (var i = 0; i < timerToBeDeleted.length; i++) {
        clearInterval(timerToBeDeleted[i]);
    }
}
//
// function fadeOut(object, duration) {
//     // if(typeof object.velocity != 'undefined') {
//     //     alphaFactor =
//     // }
//     var alphaFactor = (1 / duration);
//
//     timer = setInterval(
//         function(){
//             if(object == null) return;
//             if (object.alpha < 0.1 && object.alpha > 0) {
//                 clearTimeout(timer);
//                 stage.removeChild(object);
//                 object.destroy();
//
//                 --foodCount;
//                 console.log("int setInterval foodCount after dec", foodCount);
//                 console.log();
//                 return;
//              }
//             object.alpha -= alphaFactor;
//         }, duration / 20);
// }
