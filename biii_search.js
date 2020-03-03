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

//These are used to query Biii
var json_url_registration=make_full_text_url("registration");
var json_url_segmentation=make_full_text_url("segmentation");
var json_url_visualization=make_full_text_url("visualization");

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
    xhr.onreadystatechange=function() {
      if (xhr.readyState==4 && callback) {
        callback(xhr)
      }
    }
    xhr.send(null);
    return xhr;
};

function getBiseData(tableid, search) {

  // Set the json_url according to the search we need
  if (search == 'registration') {
    json_url = json_url_registration

  } else if (search == 'segmentation') {
    json_url = json_url_segmentation

  } else if (search == 'visualization'){
    json_url = json_url_visualization
  }

  ajaxGet(
        json_url,
        function (response) {
          // console.log(response.status);
          if (response.status !== 200) {
            document.getElementById('search_response_text').innerHTML = "Failed retrieving data from biii! "+response.status+" - "+response.statusText;
            return;
          }
          try {
            response = JSON.parse(response.responseText);
          } catch (objError) {
            console.error(objError.message);
            document.getElementById('search_response_text').innerHTML = "Failed parsing JSON data! "+objError.message;
            return;
          }
          if (!response) {
              document.getElementById('search_response_text').innerHTML = "Failed getting JSON data!";
              return;
          }
        
          // We got data! :-)
          document.getElementById('search_response_text').innerHTML = response.length + " results"; //Report #hits

          document.getElementById(tableid).innerHTML="";
          for (const e of response) {
              // console.log(e.title);
              var link="<a href=\""+basename_node+e.nid+"\">";
              var img="";
              var short_body = e.body.substring(0, 200) + '...'; //Trim down text to 200 characters

              if (e.field_image)
                img=link+"<img class='biii-thumb'  src=\""+basename_img+e.field_image+"\">";

              //addRowToTable(tableid,[img,e.title,e.body],link);
              addRowToTable(tableid,[img,e.title,short_body],link);
          }
    });

    // Style adjsutments
    var table=document.getElementById(tableid);
    table.setAttribute("class", "table_biii");
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
  
</script>
