how to run 

## prepare: get amap api token 
need register one a map developer account, 

## step1: start html page and download 

``
npx http-server ./html
``
open browser and download cities.json & distracts.json & school.json

## step2: transform .json to .sql file
copy download .json file to local workspace /data and run command as below

``
 node util/pareseDistrict.js
 
 or
  node util/pareseDistrictV2.js
 ``

