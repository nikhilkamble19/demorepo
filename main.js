var mysql = require('mysql');
var fs = require("fs");
var lineReader = require('line-reader');
var os = require("os");

var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "root1234",
  database: "tatamoters"
});

var normalCheck = [];
// var tempFile = "C:\\Users\\karan\\Desktop\\BRiOT Software\\COMPORT Project\\tempFile.txt";

con.connect(function(err) {
	if (err) throw err
	
});

setInterval(function() {
  var d = new Date();
  var curr_date = d.getDate();
  //if(curr_date == 1 || curr_date == 2 || curr_date == 3 || curr_date == 4 || curr_date == 5 || curr_date == 6 || curr_date == 7 || curr_date == 8 || curr_date == 9 ){
  if(curr_date < 10){
    curr_date = "0" + curr_date.toString();
  }
  var curr_month = parseInt(d.getMonth()) + 1;
  // if(curr_month == 1 || curr_month == 2 || curr_month == 3 || curr_month == 4 || curr_month == 5 || curr_month == 6 || curr_month == 7 || curr_month == 8 || curr_month == 9 ){
  if(curr_month < 10){  
    curr_month = "0" + curr_month.toString();
  }
  var curr_year = d.getFullYear();
  var newDate = curr_year.toString() + curr_month.toString() + curr_date.toString();
  newDate = newDate.toString() + "_TMML_PPC.txt";
  var fileName = "C:\\Users\\karan\\Desktop\\BRiOT Software\\COMPORT Project\\" + newDate.toString();
  // console.log(fileName);

  fs.stat(fileName, function(err, stat) {
    if(err == null) {
        // console.log('File exists');
    } else if(err.code == 'ENOENT') {
        // file does not exist
        var writeStream = fs.createWriteStream(fileName);
        fs.appendFile(fileName, " ", function (err) {
				  if (err) throw err;
				  // console.log('Saved!');
				});
        // console.log("New File");
    } else {
        // console.log('Some other error: ', err.code);
    }
  });
  var checkDate = curr_year.toString() + "-" + curr_month.toString() + "-" + curr_date.toString();
  writetoTXT(fileName,checkDate);

}, 10000);

function writetoTXT(fileName,checkDate,req,res){
  var query = "SELECT mainData FROM master where date = '" + checkDate + "'";
	con.query(query, function (err, result, fields){
		// console.log(result[0].mainData);
		for(var i=0;i<result.length;i++){
			// console.log(result[i].mainData);
			normalCheck.push(result[i].mainData);
		}
		// fs.truncate(tempFile, 0, function(){console.log('done')})
		// console.log(normalCheck);
		for(var i=0;i<normalCheck.length;i++ ){
			var checkExist = toWrite(fileName,normalCheck[i]);
			// console.log(checkExist);
			if(checkExist == 1){
				// console.log(normalCheck[i]);
			}
		}
	});
}


function toWrite(fileName, newText){
	var flag=1;
	// console.log(newText);
	lineReader.eachLine(fileName, function(line, last){
		// console.log(lineReader);
		if(line.indexOf(newText) != -1){
			// console.log(newText);
			flag = 0;
			return 0;
		}
		if(last){
			if(flag != 0){
				var data = fs.readFileSync(fileName); //read existing contents into data
				var fd = fs.openSync(fileName, 'w+');
				var buffer = new Buffer(newText + os.EOL);

				fs.writeSync(fd, buffer, 0, buffer.length, 0); //write new data
				fs.writeSync(fd, data, 0, data.length, buffer.length); //append old data
				// or fs.appendFile(fd, data);
				fs.close(fd);	
				
			}
		}
	});
}