//export
import * as builder from '/builder.js';

export {getAllPosts, getAuthor, getPost, getComments, testFunc}

function testFunc() {
  console.log('testing function');
}
// index.html

// this function starts fetches all posts and puts all of
// the promises returned into an ordered array,
// uses addAllPosts logic to do fetching and returns a json with all info
function getAllPosts() {
  const thePromises = [];
  // we know there are 100 posts, for all posts
  for (let index = 1; index <= 100; index++) {
    thePromises.push(
      // fetch a promise for that post
      fetch(`https://jsonplaceholder.typicode.com/posts/${index}`)
    );
  }
  // this was the addAllPosts function
  // Promise.all is called which waits for all promises
  // to return a Response object
  Promise.all(thePromises).then(postValues => {
    // take all the postResponses, map them to a new array of
    // the response turned to json
    const allPosts = postValues.map(postResponse => postResponse.json());
    console.log({allPosts});  // these are now resolved promises

    // now with the resolved promises, return a sorted collection of json
    Promise.all(allPosts)
      .then(postObjects => {
        // return a collection of the authors for each posts
        const authorResponses = postObjects.map(post => getAuthor(post.userId));
        // resolves promises, gives sigle collection of all authors
        return Promise.all(authorResponses).then(authorObjects => {
          // map each authorObject to the postObject, thus adding an author to each post
          // at the index of that post
          return postObjects.map((post, index) => {
            post.author = authorObjects[index];
            return post;  // return the post
          })
        })
      })
      // sort the posts
      .then(allOrderedPosts => {
        return allOrderedPosts.sort((left, right) => {
          return left.id > right.id ? -1 : 1;
        });
      })
      .then(reversePostData => {
        console.log("All the posts...");
        console.log({allPostData: reversePostData});  // these are json
        // add each post in collection
        reversePostData.forEach(post => {
          builder.addPost(post);
        });
      });
  });
}

// this function fetches an author and returns a promise
// holding the author's info based on an id argument
function getAuthor(authorId) {
  return fetch(`https://jsonplaceholder.typicode.com/users/${authorId}`).then(response => { return response.json(); });   // returns a promise
}


// posts.html

function getPost(postId) {
  // fetch post with postId & return promise
  fetch(`https://jsonplaceholder.typicode.com/posts/${postId}`)
    // console log the promise
    .then((postResponse) => {
      console.log({postResponse});
      return postResponse.json(); // convert response to json
    }).then((postJSON) => {
      console.log({postJSON});
      builder.addSpecificPost(postJSON);  // add the post to page
    });
}


// function takes a postId and fetches the comments
// and returns a Promise containing a collection of
// comments in json
function getComments(postId) {
  console.log(`We are getting comments for post ${postId}`);

  // fetch the comments for the specific post
  return fetch(`https://jsonplaceholder.typicode.com/comments?postId=${postId}`)
  .then((commentResponse) => {
    return commentResponse.json();
  })
}