<script>
var json_url_registration="https://test.biii.eu/searchjsonexport?search_api_fulltext=(?=registration)&_format=json&source=COMULIS";
var json_url_segmentation="https://test.biii.eu/searchjsonexport?search_api_fulltext=(?=segmentation)&_format=json&source=COMULIS";
var json_url_visualization="https://test.biii.eu/searchjsonexport?search_api_fulltext=(?=visualization)&_format=json&source=COMULIS";
var basename_img="https://test.biii.eu";
var basename_node="https://test.biii.eu/node/";

  // DATA FETCH //

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

  // Set the json_url accirding to the search we need
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
            document.body.innerHTML = "Failed retrieving data from biii! "+response.status+" - "+response.statusText;
            return;
          }
          try {
            response = JSON.parse(response.responseText);
          } catch (objError) {
            console.error(objError.message);
            document.body.innerHTML = "Failed parsing JSON data! "+objError.message;
            return;
          }
            if (!response) {
                document.body.innerHTML = "Failed getting JSON data!";
                return;
            }
           document.getElementById(tableid).innerHTML="";
            for (const e of response) {
                // console.log(e.title);
                var link="<a href=\""+basename_node+e.nid+"\">";

                var img="";
                if (e.field_image)
		  img=link+"<img class='biii-thumb'  src=\""+basename_img+e.field_image+"\">";

                addRowToTable(tableid,[img,e.title,e.body],link);
            }
    });

    // Style adjsutments
    var table=document.getElementById(tableid);
    //table.style.backgroundColor = "red";
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
