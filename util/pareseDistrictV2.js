var fs = require('fs'), path = require('path');

const batchInsertNumber = 20;
const timestamp = new Date().getTime();
function writeSql(data,fileName) {
    console.log("**", data)
    fs.writeFile(fileName,data, { 'flag': 'a' },function (err) {
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

        for (var groupIndex = 0; groupIndex < data.length/batchInsertNumber; groupIndex++) {
            var sqlSnippet = sqlSnippetInit;
            for (var index = 0, indexInData = groupIndex * batchInsertNumber + index; index < batchInsertNumber &&indexInData<data.length ; index++) {
                var childrenItem = data[indexInData];
                var splitCharacter = (index === batchInsertNumber-1) ? ";\n" : ","
                console.log("----splitCharacter",indexInData,splitCharacter,childrenItem);
                sqlSnippet += `("${childrenItem.code}","${childrenItem.name}","${childrenItem.level}","${childrenItem.upperLevelDistrictCode}") ${splitCharacter}`
            }
            writeSql(sqlSnippet, './data/district-'+timestamp+'.sql');
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
            writeSql(sqlSnippet,'./data/school-'+timestamp+'.sql');
        }
    });
}

parseDistrictJsonFile('../data/districts.json');
parseSchoolJsonFile('../data/schools.json')

