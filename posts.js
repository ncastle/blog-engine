function getPost(postId) {
  // fetch post with postId & return promise
  fetch(`https://jsonplaceholder.typicode.com/posts/${postId}`)
    // console log the promise
    .then((postResponse) => {
      console.log({postResponse});
      return postResponse.json(); // convert response to json
    }).then((postJSON) => {
      console.log({postJSON});
    });
}
// get postId from query parameter
// example url: http://127.0.0.1:5500/blog-engine/posts.html?postId={some number}
console.log({href: window.location.href})
var thePostId = window.location.href.split("postId=").slice(-1)[0];
console.log({thePostId});
getPost(thePostId);


commentLink.textContent = 'Show Comments';
  commentLink.href = '#';
  commentLink.addEventListener('click', () => {
    getComments(thePost.id).then((commentList) => {
      console.log({commentList});
      addComments(commentList);
    })
  });

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

function addComments(comments) {
  console.log({addComments:comments})
  const container = document.getElementById('container');
  const commentHeader = document.createElement('h1');

  commentHeader.textContent = "Comments:";
  container.appendChild(commentHeader);
}

