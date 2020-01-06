var fs = require('fs'), path = require('path');

function writeSql(data,fileName) {
    console.log("**", data)
    fs.appendFile(fileName, data, 'utf8', function (err) {
        if (err) {
            console.log('写文件出错了，错误是：' + err);
        }
    })
}

function parseDistrictJsonFile(fileName) {
    fs.readFile(path.join(__dirname, fileName), 'utf8', function (err, result) {
        if (err) throw err;
        const data = JSON.parse(result)
        var sqlSnippetInit = "INSERT INTO district (code, name, level ,upper_level_district_code)  VALUES \n";
        for (var i = 0; i < data.length; i++) {
            var sqlSnippet = sqlSnippetInit;
            var item = data[i];
            if (item.level === "province") {
                var itemSplitCharacter=","
                if (item.districtList.length === 0) {
                    itemSplitCharacter = ";\n"
                }
                sqlSnippet += `("${item.code}","${item.name}","${item.level}",null)${itemSplitCharacter}`
            }
            var childrenItems = item.districtList;

            for (var j = 0; j < childrenItems.length; j++) {
                var childrenItem = childrenItems[j];
                var splitCharacter = (j === childrenItems.length - 1) ? ";\n" : ","
                sqlSnippet += `("${childrenItem.code}","${childrenItem.name}","${childrenItem.level}","${childrenItem.upperLevelDistrictCode}") ${splitCharacter}`
            }
            if(item.level === "province" || childrenItems.length >0){
                writeSql(sqlSnippet,'./data/district.sql');
            }
        }
    });
}

function parseSchoolJsonFile(fileName) {
    fs.readFile(path.join(__dirname, fileName), 'utf8', function (err, result) {
        if (err) throw err;
        const data = JSON.parse(result);
        var sqlSnippetInit = "INSERT INTO school_on_district (id,name,address,district_code)  VALUES \n";
        for (var i = 0; i < data.length; i++) {
            var sqlSnippet = sqlSnippetInit;
            var item = data[i];
            var childrenItems = item.schools;
            for (var j = 0; j < childrenItems.length; j++) {
                var childrenItem = childrenItems[j];
                var splitCharacter = (j === childrenItems.length - 1) ? ";\n" : ","
                sqlSnippet += `("${childrenItem.id}","${childrenItem.name}","${childrenItem.address}","${item.adcode}") ${splitCharacter}`
            }
            writeSql(sqlSnippet,'./data/school.sql');
        }
    });
}

parseDistrictJsonFile('../data/cities.json');
parseDistrictJsonFile('../data/districts.json');
parseSchoolJsonFile('../data/schools.json')

