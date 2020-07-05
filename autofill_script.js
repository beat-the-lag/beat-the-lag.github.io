var start_location = 0;
var end_location = 0;
var lat1 = 0;
var lng1 = 0;
var lat2 = 0;
var lng2 = 0;

function update_start(c) {
  start_location = document.getElementById("autocomplete").value;
  geocode();

  function geocode() {
    axios
      .get("https://maps.googleapis.com/maps/api/geocode/json", {
        params: {
          address: c,
          key: "AIzaSyC1PSvX7NUotfAZWY68hT6kgHrtVxrrg8g"
        }
      })
      .then(function(response) {
        lat1 = response.data.results[0].geometry.location.lat;
        lng1 = response.data.results[0].geometry.location.lng;
        localStorage.setItem("depart_city_lat", lat1);
        localStorage.setItem("depart_city_lng", lng1);
        change_map();
      })
      .catch(function(error) {
        console.log(error);
      });
  }
}

function update_end(c) {
  end_location = document.getElementById("autocomplete2").value;
  geocode2();
  function geocode2() {
    axios
      .get("https://maps.googleapis.com/maps/api/geocode/json", {
        params: {
          address: c,
          key: "AIzaSyC1PSvX7NUotfAZWY68hT6kgHrtVxrrg8g"
        }
      })
      .then(function(response) {
        lat2 = response.data.results[0].geometry.location.lat;
        lng2 = response.data.results[0].geometry.location.lng;
        localStorage.setItem("arrive_city_lat", lat2);
        localStorage.setItem("arrive_city_lng", lng2);
        change_map();
      })
      .catch(function(error) {
        console.log(error);
      });
  }
}
function change_map() {
  console.log(lat1, lng1, lat2, lng2);
  if ((lat1 == 0 && lng1 == 0) || (lat2 == 0 && lng2 == 0)) {
  } else {
    initMap();
  }
}

var options = {
  shouldSort: true,
  threshold: 0.4,
  maxPatternLength: 32,
  keys: [
    {
      name: "iata",
      weight: 0.5
    },
    {
      name: "name",
      weight: 0.3
    },
    {
      name: "city",
      weight: 0.2
    }
  ]
};

var fuse = new Fuse(airports, options);

var ac = $("#autocomplete")
  .on("click", function(e) {
    e.stopPropagation();
  })
  .on("focus keyup", search)
  .on("keydown", onKeyDown);

var wrap = $("<div>")
  .addClass("autocomplete-wrapper")
  .insertBefore(ac)
  .append(ac);

var list = $("<div>")
  .addClass("autocomplete-results")
  .on("click", ".autocomplete-result", function(e) {
    e.preventDefault();
    e.stopPropagation();
    selectIndex($(this).data("index"));
  })
  .appendTo(wrap);

$(document)
  .on("mouseover", ".autocomplete-result", function(e) {
    var index = parseInt($(this).data("index"), 10);
    if (!isNaN(index)) {
      list.attr("data-highlight", index);
    }
  })
  .on("click", clearResults);

function clearResults() {
  results = [];
  numResults = 0;
  list.empty();
}

function selectIndex(index) {
  if (results.length >= index + 1) {
    ac.val(results[index].iata);
    update_start(results[index].city);
    clearResults();
  }
}

var results = [];
var numResults = 0;
var selectedIndex = -1;

function search(e) {
  if (e.which === 38 || e.which === 13 || e.which === 40) {
    return;
  }

  if (ac.val().length > 0) {
    results = _.take(fuse.search(ac.val()), 3);
    numResults = results.length;

    var divs = results.map(function(r, i) {
      return (
        '<div class="autocomplete-result" data-index="' +
        i +
        '">' +
        "<div><b>" +
        r.iata +
        "</b> - " +
        r.name +
        "</div>" +
        '<div class="autocomplete-location">' +
        r.city +
        ", " +
        r.country +
        "</div>" +
        "</div>"
      );
    });

    selectedIndex = -1;
    list.html(divs.join("")).attr("data-highlight", selectedIndex);
  } else {
    numResults = 0;
    list.empty();
  }
}

function onKeyDown(e) {
  switch (e.which) {
    case 38: // up
      selectedIndex--;
      if (selectedIndex <= -1) {
        selectedIndex = -1;
      }
      list.attr("data-highlight", selectedIndex);
      break;
    case 13: // enter
      selectIndex(selectedIndex);
      break;
    case 9: // enter
      selectIndex(selectedIndex);
      e.stopPropagation();
      return;
    case 40: // down
      selectedIndex++;
      if (selectedIndex >= numResults) {
        selectedIndex = numResults - 1;
      }
      list.attr("data-highlight", selectedIndex);
      break;

    default:
      return; // exit this handler for other keys
  }
  e.stopPropagation();
  e.preventDefault(); // prevent the default action (scroll / move caret)
}
var options2 = {
  shouldSort: true,
  threshold: 0.4,
  maxPatternLength: 32,
  keys: [
    {
      name: "iata",
      weight: 0.5
    },
    {
      name: "name",
      weight: 0.3
    },
    {
      name: "city",
      weight: 0.2
    }
  ]
};

var fuse = new Fuse(airports, options2);

var ac2 = $("#autocomplete2")
  .on("click", function(e) {
    e.stopPropagation();
  })
  .on("focus keyup", search2)
  .on("keydown", onKeyDown2);

var wrap2 = $("<div>")
  .addClass("autocomplete2-wrapper")
  .insertBefore(ac2)
  .append(ac2);

var list2 = $("<div>")
  .addClass("autocomplete2-results")
  .on("click", ".autocomplete2-result", function(e) {
    e.preventDefault();
    e.stopPropagation();
    selectIndex2($(this).data("index"));
  })
  .appendTo(wrap2);

$(document)
  .on("mouseover", ".autocomplete2-result", function(e) {
    var index = parseInt($(this).data("index"), 10);
    if (!isNaN(index)) {
      list2.attr("data-highlight", index);
    }
  })
  .on("click", clearResults2);

function clearResults2() {
  results2 = [];
  numResults2 = 0;
  list2.empty();
}

function selectIndex2(index) {
  if (results2.length >= index + 1) {
    ac2.val(results2[index].iata);
    update_end(results2[index].city);
    clearResults2();
  }
}

var results2 = [];
var numResults2 = 0;
var selectedIndex2 = -1;

function search2(e) {
  if (e.which === 38 || e.which === 13 || e.which === 40) {
    return;
  }

  if (ac2.val().length > 0) {
    results2 = _.take(fuse.search(ac2.val()), 3);
    numResults2 = results2.length;

    var divs2 = results2.map(function(r, i) {
      return (
        '<div class="autocomplete2-result" data-index="' +
        i +
        '">' +
        "<div><b>" +
        r.iata +
        "</b> - " +
        r.name +
        "</div>" +
        '<div class="autocomplete2-location">' +
        r.city +
        ", " +
        r.country +
        "</div>" +
        "</div>"
      );
    });

    selectedIndex2 = -1;
    list2.html(divs2.join("")).attr("data-highlight", selectedIndex2);
  } else {
    numResults2 = 0;
    list2.empty();
  }
}

function onKeyDown2(e) {
  switch (e.which) {
    case 38: // up
      selectedIndex2--;
      if (selectedIndex2 <= -1) {
        selectedIndex2 = -1;
      }
      list2.attr("data-highlight", selectedIndex2);
      break;
    case 13: // enter
      selectIndex2(selectedIndex2);
      break;
    case 9: // enter
      selectIndex2(selectedIndex2);
      e.stopPropagation();
      return;
    case 40: // down
      selectedIndex2++;
      if (selectedIndex2 >= numResults2) {
        selectedIndex2 = numResults2 - 1;
      }
      list2.attr("data-highlight", selectedIndex2);
      break;

    default:
      return; // exit this handler for other keys
  }
  e.stopPropagation();
  e.preventDefault(); // prevent the default action (scroll / move caret)
}
