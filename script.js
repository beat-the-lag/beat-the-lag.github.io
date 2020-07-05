function save_preferences() {
  var shift_day = document.getElementById("shift").value;
  var travel_sleep = document.getElementById("plane_sleep").checked;
  var alcohol = document.getElementById("alcohol").checked;
  var coffee = document.getElementById("caffeine").checked;
  localStorage.setItem("shift_p", shift_day);
  if (travel_sleep == true) {
    localStorage.setItem("sleep_p", "Yes");
  } else {
    localStorage.setItem("sleep_p", "No");
  }
  if (alcohol == true) {
    localStorage.setItem("alcohol_p", "Yes");
  } else {
    localStorage.setItem("alcohol_p", "No");
  }
  if (coffee == true) {
    localStorage.setItem("caffeine_p", "Yes");
  } else {
    localStorage.setItem("caffeine_p", "No");
  };
  /*get everything else (lat and long updated with map in autofill_script.js)*/
  localStorage.setItem("depart_city", document.getElementById("autocomplete").value);
  localStorage.setItem("arrive_city", document.getElementById("autocomplete2").value);
  localStorage.setItem("departure_string", document.getElementById("d_time").value);
  localStorage.setItem("arrival_string", document.getElementById("a_time").value);
  localStorage.setItem("sleep_start", document.getElementById("sleep").value);
  localStorage.setItem("sleep_end", document.getElementById("wake").value);
  localStorage.setItem("caffeine_excess", document.getElementById("caffeine_excess").checked);
  
};
function schedules_initialize() {
  document.getElementById("p_shift").innerHTML = localStorage.getItem(
    "shift_p"
  );
  document.getElementById("p_sleep").innerHTML = localStorage.getItem(
    "sleep_p"
  );
  document.getElementById("p_alcohol").innerHTML = localStorage.getItem(
    "alcohol_p"
  );
  document.getElementById("p_caffeine").innerHTML = localStorage.getItem(
    "caffeine_p"
  );
  generate_schedules();
};
function generate_schedules(){
  function revert(v){
    /*converts any hours outside [0-24] to between regular hours*/
    if (v<0){
      v += 24;
    } else if (v>=24){
      v -= 24;
    };
    return v
  };
  
  /* STEP 1: DEPARTURE/ARRIVAL DATE AND TIME */
  var dep_date = new Date(localStorage.getItem("departure_string"));
  var dep_time = dep_date.getTime() / 1000;
  var arr_date = new Date(localStorage.getItem("arrival_string"));
  var arr_time = arr_date.getTime() / 1000;
  
  /* STEP 2: TIMEZONE OF DEPARTURE AND ARRIVAL LOCATIONS */
  var depart_tz = Math.floor(parseFloat(localStorage.getItem("depart_city_lng"))/15);
  var arrive_tz = Math.floor(parseFloat(localStorage.getItem("arrive_city_lng"))/15);
  var delta = Math.abs(arrive_tz - depart_tz);
  //alert(delta);
  
  /* STEP 3: SLEEP SCHEDULE */
  var sleep_start0 = localStorage.getItem("sleep_start");
  var sleep_end0 = localStorage.getItem("sleep_end");
  var sleep_start = parseInt(sleep_start0.slice(0,2));
  var sleep_end = parseInt(sleep_end0.slice(0,2));
  var lbt;
  if (sleep_end<sleep_start){
    if (sleep_end - sleep_start + 24 < 7) {
      lbt = sleep_end-2;
    } else {
      lbt = sleep_end-3;
    };
  } else if (sleep_end-sleep_start<7) {
    lbt = sleep_end-2;
  } else {
    lbt = sleep_end-3;
  };
  lbt = revert(lbt);
  
  /* STEP 4 : SHIFT DAY */
  var shift_day = new Date(localStorage.getItem("shift_p"));
  var shift_time = shift_day.getTime() / 1000;
  if (shift_time>dep_time){
    shift_time = dep_time;
  };
  
  var days_before = parseInt(Math.floor((dep_time-shift_time)/86400));
  localStorage.setItem("days_before",days_before);
  
  
  var change = Math.floor(delta/days_before);
  
  /* SCHEDULE */
  var schedules = [];
  function schedule(index, change, sleep_start, sleep_end, lbt){
    var temp = [];
    for (const day of Array(index).keys()){
      lbt = revert(lbt+change);
      sleep_start = revert(sleep_start+change);
      sleep_end = revert(sleep_end+change);
      temp.push([sleep_start,sleep_end,revert(sleep_start+delta),revert(sleep_end+delta)]);
    }
    //add score to temp
    // coffee alcohol travel_sleep
    if (localStorage.getItem("caffeine_excess") == true){
      var coffee = -1;
    } else if (localStorage.getItem("caffeine_p") == "Yes"){
      var coffee = 1;
    } else {
      var coffee = 0;
    };
    if (localStorage.getItem("alcohol_p") == "Yes"){
      var alcohol = 1;
    } else {
      var alcohol = 0;
    };
    var travel_sleep = 0; //for now
    
    temp.push(score(days_before, change, coffee, alcohol, travel_sleep));
    schedules.push(temp); //array with arrays of schedules with days represented by arrays
    
    
  };
  function score(days_before, delta, coffee, alcohol, travel_sleep){
    return (Math.max(days_before, Math.abs(delta)) + coffee*0.2 + alcohol*0.2 + travel_sleep*0.2);
  };
  schedule(days_before,change,sleep_start,sleep_end,lbt);
  //2nd
  schedule(days_before,change,sleep_start,sleep_end,lbt); // this should add another schedule
  //3rd
  schedule(days_before,change,sleep_start,sleep_end,lbt); // this should add another schedule

  
  localStorage.setItem("schedules", JSON.stringify(schedules));
  show_schedules();
};

function show_schedules(){
  var schedules = JSON.parse(localStorage.getItem("schedules"));
}
