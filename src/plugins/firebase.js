import firebase from 'firebase'
import 'firebase/firestore'

if (!firebase.apps.length) {
  firebase.initializeApp(
    {
      apiKey: "AIzaSyAIqQE5536C0FyUnOQS94xi0UrqM-miX-k",
      authDomain: "nuxt-firestore-80092.firebaseapp.com",
      databaseURL: "https://nuxt-firestore-80092.firebaseio.com",
      projectId: "nuxt-firestore-80092",
      storageBucket: "gs://nuxt-firestore-80092.appspot.com",
      messagingSenderId: "247244459401",
      appId: "1:247244459401:web:af0d3f277789fdfcfe2558"
    }
  )
}

export default firebase;

// import firebase from 'firebase'
// import 'firebase/firestore'

// // Get a Firestore instance
// const { db } = firebase
//   .initializeApp({
//     apiKey: "AIzaSyAIqQE5536C0FyUnOQS94xi0UrqM-miX-k",
//     authDomain: "nuxt-firestore-80092.firebaseapp.com",
//     databaseURL: "https://nuxt-firestore-80092.firebaseio.com",
//     projectId: "nuxt-firestore-80092",
//     storageBucket: "gs://nuxt-firestore-80092.appspot.com",
//     messagingSenderId: "247244459401",
//     appId: "1:247244459401:web:af0d3f277789fdfcfe2558"
//   })
//   .firestore()

// export default db

//   // Export types that exists in Firestore
// // This is not always necessary, but it's used in other examples
// const { TimeStamp, GeoPoint } = firebase.firestore
// export { TimeStamp, GeoPoint }

// // if using Firebase JS SDK < 5.8.0
// // db.settings({ timestampsInSnapshots: true })