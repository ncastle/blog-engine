/**
 * Blog Engine exercise demonstrating use of promises
 */

 // import functions
 import * as client from '/client.js'

client.testFunc();

// driver code

// get URL of page
var fileName = window.location.href;
console.log(window.location.href);
// console.log({fileName});

if (fileName.includes("index.html") ||
    !fileName.includes(".html")) {
  console.log('We are at index, getAllPosts()');
  client.getAllPosts();
}
if(fileName.includes("post.html")) {
  // get the postId
  console.log('We are in post.html, getting postId');
  let thePostId = window.location.href.split("postId=").slice(-1)[0];
  client.getPost(thePostId); 
}
if(fileName.includes("author.html")) {
  console.log('We are in author.html!! need the author');
  let theUserId = window.location.href.split("userId=").slice(-1)[0];
  client.showAuthorInfo(theUserId);
}
if(fileName.includes("author-posts.html")) {
  let theUserId = window.location.href.split("userId=").slice(-1)[0];
  console.log('We are in author-posts.html, need to fetch posts');
  client.showAuthorPosts(theUserId);
}