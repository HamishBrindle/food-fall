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
