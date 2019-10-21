/*
 * 残タスク *
  * x reactから渡されたデータに応じて、queryを作成する
  * x configを書き直す
  * x 引数を整理する
  * x 関数ごとにファイル分割する
  * x subscribeするcollectionを管理する(合わせて、張るインデクスとtypeも管理)
  * 消した例外処理の中から必要な分を復活させる
  * x フラグ管理でelasticへの更新をかけに行くなら、firestoreのフラグ更新も必要になる
  * reactに返すデータの整形
  * firestoreでデータ削除が必要になったときの処理を決める
*/

const firebase = require('firebase');
require('firebase/firestore');
const elasticsearch = require('elasticsearch');

const conf = require('./config');
//require('./lib/initFirebase');
require('./firebase.js')
let Search = require('./Search.js');
let Registration = require('./Registration.js');

//////////////////////////////////////////////////
/*
 * ElasticSearchの初期化
*/
const escOptions = {
    hosts: [{
        host: conf.ES_HOST,
        port: conf.ES_PORT,
    }]
};

//////////////////////////////////////////////////
/*
 * ElasticSearchへの接続
*/
let esc = new elasticsearch.Client(escOptions);
console.log('Connecting to ElasticSearch host %s:%s', conf.ES_HOST, conf.ES_PORT);

let timeoutObj = setInterval(function() {
    esc.ping().then(function() {
        console.log('Connected to ElasticSearch host %s:%s', conf.ES_HOST, conf.ES_PORT);
        clearInterval(timeoutObj);
        Search.init(esc, refReq='search_request', refRes='search_response', index='firebase_user', type='user');
        Registration.init(esc, collection='users', index='firebase_user', type='user');
    });
}, 5000);