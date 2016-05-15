//mongodb remote connection "mongodb://root:root@ds061375.mongolab.com:61375/userstory"
//mongodb local cobbection  "mongodb://localhost/userstory"
module.exports = {

	"database": "mongodb://root:root@ds061375.mongolab.com:61375/userstory",
	"port": process.env.PORT || 3000,
	"secretKey": "secretKey" 
}
	