const colRef = collection(db, 'recipes')
const realtimeCol = onSnapshot(colRef, (snapshot) => {
  snapshot.docChanges().forEach(change => {
    if (change.type === 'added') {
      // add the document data to the web page
    }
    if (change.type == 'removed') {
      // remove the document data from the web page
    }
  });
})