<script>
// This is injected html code into the page header, thus script tag at beginning/end.

// BIII ACCESS URLs
//In due time change this to the main site
var base_url="https://test.biii.eu";

var full_text_search="/searchjsonexport?search_api_fulltext="
var json_postfix="&_format=json&source=COMULIS";
var make_full_text_url = function(keyword) { //No checking performed, do NOT feed user supplied data
  return base_url+full_text_search+"(?="+keyword+")"+json_postfix;
}

//Search for 'type=software' and 'has_topic=multimodal'
var advanced_search="/all-content-rest?type=software&field_has_topic_target_id_1%5B%5D=4774"

//These are used to query Biii
var json_url_registration=make_full_text_url("registration");
var json_url_segmentation=make_full_text_url("segmentation");
var json_url_visualization=make_full_text_url("visualization");
var json_url_multimodal=base_url+advanced_search+json_postfix;

//These are used to extract content for the resulting table
var basename_img=base_url;
var basename_node=base_url+"/node/";


// DATA FETCH

// simple cross-browser ajax helper
var ajaxGet = function (url, callback) {
    var callback = (typeof callback == 'function' ? callback : false), xhr = null;
    try {
      xhr = new XMLHttpRequest();
    } catch (e) {
      try {
        xhr = new ActiveXObject("Msxml2.XMLHTTP");
      } catch (e) {
        xhr = new ActiveXObject("Microsoft.XMLHTTP");
      }
    }
    if (!xhr)
        return null;
    xhr.open("GET", url,true);
    response = null;
    xhr.onreadystatechange=function() {
      if (xhr.readyState==4 && callback) {
        response=callback(xhr)
      }
    }
    xhr.send(null);
    return response;
};

//Takes xhr response and asks for JSON data
//Errors are placed into getElementById(textid)
function parse_JSON_response(textid, response) {
  // console.log(response.status);
  if (response.status !== 200) {
    document.getElementById(textid).innerHTML = "Failed retrieving data from biii! "+response.status+" - "+response.statusText;
    return null;
  }
  try {
    response = JSON.parse(response.responseText);
  } catch (objError) {
    console.error(objError.message);
    document.getElementById(textid).innerHTML = "Failed parsing JSON data! "+objError.message;
    return null;
  }
  if (!response) {
    document.getElementById(textid).innerHTML = "Failed getting JSON data!";
    return null;
  }
  // We got data! :-)
  return response;
}

//Parse result and place the data in the biiitable
function publish_JSON_data(tableid, tableid2, textid, textid2, response1, response2) {
  document.getElementById(textid).innerHTML = "Searching....."; //add a 5th dot
  response2=parse_JSON_response(textid, response2);

  let in_response1 = new Set();
  for (const e of response1) {
    in_response1.add(e.nid[0].value); //Store the NodeID
  }

  count1=0;
  count2=0;

  if (response2) {
    //Loop it twice, first 1&2, then 2 only
    for (const e of response2) {
      if (!in_response1.has(parseInt(e.nid))) 
        continue; //Not in response1

      var link="<a href=\""+basename_node+e.nid+"\">";
      var img="";
      var short_body = e.body.substring(0, 200) + '...'; //Trim down text to 200 characters

      if (e.field_image)
        img=link+"<img class='biii-thumb'  src=\""+basename_img+e.field_image+"\">";

      count1++;
      addRowToTable(tableid,[img,e.title,short_body],link); //Add to Table1
    }

    //Fill Table 2
    for (const e of response2) {
      if (in_response1.has(parseInt(e.nid)))
        continue; //In response1
    
      if (!count2)
        setVisible(textid2);
    
      var link="<a href=\""+basename_node+e.nid+"\">";
      var img="";
      var short_body = e.body.substring(0, 200) + '...'; //Trim down text to 200 characters

      if (e.field_image)
        img=link+"<img class='biii-thumb'  src=\""+basename_img+e.field_image+"\">";

      count2++;
      addRowToTable(tableid2,[img,e.title,short_body],link); //Add to Table2
    }
    document.getElementById(textid).innerHTML = count1 + " (" + count2 + ")" + " results"; //Report #hits
  
  }
}

//Second search
function getFreeTextData(tableid, tableid2, textid, textid2, search, response1) {
  response1=parse_JSON_response(textid, response1);
  if (!response1) return;

  document.getElementById(textid).innerHTML = "Searching...."; //add a 4th dot

  // Set the json_url according to the search we need
  if (search == 'registration') {
    json_url = json_url_registration

  } else if (search == 'segmentation') {
    json_url = json_url_segmentation

  } else if (search == 'visualization'){
    json_url = json_url_visualization
  }

  //Callback is called upon response of the http request which typically is long after this function ends
  ajaxGet(json_url,function (response2) {publish_JSON_data(tableid,tableid2,textid,textid2,response1,response2)});
}

// Externally called function
function getBiseData(tableid, tableid2, search) {
  textid='search_response_text';
  textid2='search_response_text2';

  document.getElementById(textid).innerHTML = "Searching...";
  setInvisible(textid2); //Make sure text2 is hidden
  
  document.getElementById(tableid).innerHTML=""; //Clear table
  document.getElementById(tableid2).innerHTML=""; //Clear table2

  // Set the json_url according to the search we need
  json_url=json_url_multimodal;

  //Callback is called upon response of the http request which typically is long after this function ends
  ajaxGet(json_url,function (response1) {getFreeTextData(tableid, tableid2, textid, textid2, search, response1)}); //callback is second search
}

// TABLE GENERATOR
function addRowToTable(tableid,strs,link) {
  var table=document.getElementById(tableid);
  var row=table.insertRow(-1);

  for (const s of strs) {
    // console.log(s);
    var cell=row.insertCell(-1);
    cell.innerHTML=link+s+"</a>";  //Ugly code to make it clickable, just as example
  };
}
  
// Make element visible
function setVisible(elemID) {
  document.getElementById(elemID).style.display = "block";
}
function setInvisible(elemID) {
  document.getElementById(elemID).style.display = "none";
}

</script>
