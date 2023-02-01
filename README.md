# Integration between Biii and Comulis

Here we can find the custom javascript for the comulis website, to query biii.eu for the search of multimodal correlated software

Currently being used on https://www.comulis.eu/correlation-software

Combines fulltext search for registration, segmentation, visualization  \
&nbsp; http://biii.eu/searchjsonexport?search_api_fulltext=(?=visualization)&_format=json  \
with advance search for has-topic "multimodal imaging"  \
&nbsp; http://biii.eu/all-content-rest?type=software&field_has_topic_target_id_1%5B%5D=4774&_format=json

## Files description

### biii_search.js
code to be added to the header, has the biii.eu query function


### segmentation.html
Button to search for segmentation


### registration.html
Button to search for registration


### visualization.html
Button to search for visualization


### table.html
Code for where the search result table needs to be generated


### custom.css
Added the style for the search result page and table
