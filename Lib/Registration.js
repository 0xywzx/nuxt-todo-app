'use strict';

const firebase = require('./firebase.js');
require('firebase/firestore');
const _ = require('lodash');
//////////////////////////////////////////////////
/*
 * firebaseのデータに変更が加えられたときに、
 * ElasticSearchの方にデータを送る
*/

class Registration {

    constructor(esc, collection, index, type) {
        this.esc = esc;
        this.collection = collection;
        this.index = index;
        this.type = type;
    }

    init() {
        this.ref = firebase.collection(this.collection).where('ES_STATE', '==', 'STAY');
        this.unsubscribe = null;
        this.unsubscribe = this.ref.onSnapshot(this._showResults.bind(this));
    }

    _showResults(snap) {
        snap.forEach((doc) => {
            const sendData = {
                index: this.index,
                type: this.type,
                id: doc.id,
                body: {
                    name: doc.data().name,
                    text: doc.data().text,
                    updatedAt: doc.data().updatedAt,
                    createdAt: doc.data().createdAt,
                },  // bodyに何を送るかは別途考える。index, type, collectionはclassの外で定義出来るようにしたので、これも切り出したい
            }
            this._sendDataToElasticsearch(sendData)
            // 返り値を用意して、firestoreのフラグ変更の関数の発火を制御した方が良いかもしれない
            this._updateFlagInFirestore(doc)
        })
    }

    _sendDataToElasticsearch(sendData) {
        /*
         * firestoreで変更されたデータをElasticsearchに送信する関数
        */
        this.esc.index(sendData, function (error, response) {
            if(_.isUndefined(error)){
                console.log('_sendDataToElasticsearch: success')
            }else{
                console.log('_sendDataToElasticsearch: failed', error)
            }
        }.bind(this));
    }

    _updateFlagInFirestore(doc) {
        /*
         * firestoreの各ドキュメントにステータス管理用のfieldを用意している。
         * Elasticsearchにデータを更新し終わったら、firestoreのステータス管理fieldに
         * ステータス変更を書き込みに行く関数
        */
        return firebase.collection(this.collection).doc(doc.id).update({
            'ES_STATE': 'DONE',
        })
        .then(function() {
            console.log('_updateFlagInFirestore: success');
        })
        .catch(function(error) {
            // The document probably doesn't exist.
            console.error('_updateFlagInFirestore: failed', error);
        });
    }

}

exports.init = function(esc, collection, index, type) {
    new Registration(esc, collection, index, type).init();
}