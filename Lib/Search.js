'use strict';

const firebase = require('firebase');
require('firebase/firestore');
const _ = require('lodash');
//////////////////////////////////////////////////
/*
 * firebaseのデータにqueryが登録されたときに
 * ElasticSearchへ検索を投げて、結果をfirebaseの方に返す
 * 返却するときのデータ整形もあとで決める
*/

class Search {

    constructor(esc, refReq, refRes, index, type) {
        this.esc = esc;
        this.refReq = refReq;
        this.refRes = refRes;
        this.index = index;
        this.type = type;
    }

    init() {
        /*
         * subscribeをcollectionに張る
        */
        this.refReq = firebase.firestore().collection(this.refReq);
        this.refRes = firebase.firestore().collection(this.refRes);
        this.unsubscribe = null;
        console.log(1)
        this.unsubscribe = this.refReq.onSnapshot(this._showResults.bind(this));
    }

    _showResults(snap) {
        /*
         * firestoreに投げられた検索リクエストを取得して、Elasticsearchに渡すクエリに変換する
        */
        snap.forEach((doc) => {
            let { from, q, size } = doc.data(); // qがフロントからのデータ
            let query = {
                index: this.index,
                type: this.type,
                body: {
                  query: {
                      bool : {
                          should : [
                            {match: {itemName:"限定"}},
                            {match: {itemDetailText:"限定"}}
                          ]
                      }
                  },
                },
                from,
                size,
            }
            this._searchWithElasticsearch(doc, query)
        })
    }

    _searchWithElasticsearch(doc, query) {
        /*
         * elasticsearchで検索を行い、
         * 結果のデータを整形してfirestoreに受けわたす関数
        */
        this.esc.search(query, function(error, response) {
            if(_.isUndefined(error)){
                let returnData = {}
                response.hits.hits.forEach((data) => {
                    returnData[data._id] = {
                        id: data._id,
                        source: data._source,
                        score: data._score,
                    }  // まだfirestoreのどのデータをelasticsearchに送るのか決めてないので、返ってきたものを全てfirestoreに受け渡している
                })
                console.log('_searchWithElasticsearch: success', query, returnData)
                this.refRes.doc(doc.id).set(returnData);
                this.refReq.doc(doc.id).delete();
            }else{
                console.log('_searchWithElasticsearch: failed', error)
            }
        }.bind(this));
    }

}

exports.init = function(esc, refReq, refRes, index, type) {
    new Search(esc, refReq, refRes, index, type).init();
}