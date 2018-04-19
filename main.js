var multer  = require('multer')
var express = require('express')
var fs      = require('fs')
var app = express();

app.get('/catfact/:num', function(req, res) {
	{
        var num = req.params.num;

        get_line('catfacts.txt', num, function(err, fact)
        {
            res.writeHead(200, {'content-type':'text/html'});
            res.write(`<h3>Cat Fact</h3>`);
            res.write(`${fact}`);
            res.end();            
        });


	}
})

app.get('/', function(req, res) {
    res.writeHead(200, {'content-type':'text/html'});
    res.write(`<h3>Cat Facts</h3>`);
    res.write(`Visit /catfact/[num] to see a catfact`);
    res.end();            
});

function get_line(filename, line_no, callback) {
    var data = fs.readFileSync(filename, 'utf8');
    var lines = data.split("\n");

    if(+line_no > lines.length){
      throw new Error('File end reached without finding line');
    }

    callback(null, lines[+line_no]);
}

// HTTP SERVER
var server = app.listen(3000, function () {
    var host = server.address().address
    var port = server.address().port

    console.log('Example app listening at http://%s:%s', host, port)
})