var fibos = require('fibos');
var fs = require("fs");
var config = require('./config');
console.notice("start FIBOS seed node");


fibos.config_dir = "./blockData/seed";
fibos.data_dir = "./blockData/seed";

console.notice("config_dir:", fibos.config_dir);
console.notice("data_dir:", fibos.data_dir);

var stop_block_num = 11720143;

fibos.load("http", {
	"http-server-address": "0.0.0.0:8888",
	"access-control-allow-origin": "*",
	"http-validate-host": false,
	"verbose-http-errors": true //打开报错
});


fibos.load("net", {
	"p2p-peer-address": config.p2p_peer_address,
	"max-clients": 100,
	"p2p-listen-endpoint": "0.0.0.0:9999",
	"p2p-max-nodes-per-host": 20
});

var chain_config = {
	"contracts-console": true,
	'chain-state-db-size-mb': 8 * 1024,
	// "delete-all-blocks": true
};

if (!fs.exists(fibos.data_dir) && !fs.exists(fibos.config_dir)) {
	chain_config['genesis-json'] = "genesis.json";
}

fibos.load("emitter");
fibos.on('action', function(at) {
	var now_num = at.block_num.toString();
	if (now_num > stop_block_num - 5000) console.log(now_num);
	if (now_num >= stop_block_num) {
		fibos.stop();
	}
});

fibos.load("producer", {});

fibos.load("chain", chain_config);
fibos.load("chain_api");


fibos.start();