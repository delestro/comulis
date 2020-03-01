<script>
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
}

function getBiseDataVisualization(tableid) {

  ajaxGet(
        json_url_visualization,
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


<body>


<div class="sqs-block button-block sqs-block-button" data-block-type="53" id="block-yui_3_17_2_1_1571128763572_96401">
<div class="sqs-block-content" id="yui_3_17_2_1_1571241011909_169"><div class="sqs-block-button-container--center" data-animation-tier="2" data-alignment="center" data-button-size="medium" id="yui_3_17_2_1_1571241011909_168">
<a class="sqs-block-button-element--medium sqs-block-button-element" target="_blank" data-initialized="true" onclick="getBiseDataVisualization('biiitab')">List visualization software<br>from biii.eu</a>
</div></div></div>

<script src="scripts/main.js"></script>
</body>
