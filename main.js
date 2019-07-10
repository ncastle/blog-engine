/**
 * Blog Engine exercise demonstrating use of promises
 */



/*** functions for index.html page ***/

// this function starts fetches all posts
// and puts all of the promises returned into
// an ordered array, addAllPosts is called on 
// the array of promises
function getAllPosts() {
  const thePromises = [];
  // we know there are 100 posts, for all posts
  for (let index = 1; index <= 100; index++) {
    thePromises.push(
      // fetch a promise for that post
      fetch(`https://jsonplaceholder.typicode.com/posts/${index}`)
    );
  }
  addAllPosts(thePromises);
}

// this func takes an array of promises
function addAllPosts(allPromises) {
  // Promise.all is called which waits for all promises
  // to return a Response object
  Promise.all(allPromises).then(postValues => {
    // take all the postResponses, map them to a new array of
    // the response turned to json
    const allPosts = postValues.map(postResponse => postResponse.json());
    console.log({allPosts});  // these are now resolved promises

    // now with the resolved promises, return a sorted collection of json
    Promise.all(allPosts)
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
          addPost(post);
        });
      });
  });
}

// add post handles displaying a post to the page
function addPost(thePost) {
  const container = document.getElementById("container"); // select container div
  const title = document.createElement("h2");   // create title elem
  const titleLink = document.createElement('a');
  const author = document.createElement("h3");
  const authorLink = document.createElement('a');

  // we need the author so call get author function
  // which returns a promise containing the authors info
  //based on the userId on the current post
  getAuthor(thePost.userId).then(authorData => {
    title.textContent = `Title: `;
    titleLink.textContent = `${thePost.title}`;
    titleLink.href = `post.html?postId=${thePost.id}`;
    author.textContent = `Author: `;
    authorLink.textContent = `${authorData.name}`;
    authorLink.href = `author.html?userId=${thePost.userId}`;

    // append elements
    title.appendChild(titleLink);
    author.appendChild(authorLink);
    container.appendChild(title);
    container.appendChild(author);
    container.appendChild(document.createElement('hr'));

  });
}

// this function fetches an author and returns a promise
// holding the author's info based on an id argument
function getAuthor(authorId) {
  return fetch(`https://jsonplaceholder.typicode.com/users/${authorId}`).then(response => { return response.json(); });   // returns a promise
}



/*** functions for post.html page ***/

function getPost(postId) {
  // fetch post with postId & return promise
  fetch(`https://jsonplaceholder.typicode.com/posts/${postId}`)
    // console log the promise
    .then((postResponse) => {
      console.log({postResponse});
      return postResponse.json(); // convert response to json
    }).then((postJSON) => {
      console.log({postJSON});
      addSpecificPost(postJSON);  // add the post to page
    });
}

// handles appending a post to the post.html page
function addSpecificPost(thePost) {
  console.log('were adding a post');
  console.log(thePost)

  // get container element, and create elements for
  // required parts of post.html page
  const element = document.getElementById('container');
  const postTitle = document.createElement('h1');
  const postBody = document.createElement('p');
  const authorName = document.createElement('h2');
  const authorEmail = document.createElement('h3');
  const commentLink = document.createElement('a');
  commentLink.id = "commentLink";
  
  //set content and link
  postTitle.textContent = `${thePost.title}`;
  postBody.textContent = `${thePost.body}`;
  commentLink.textContent = 'Show Comments';
  commentLink.href = '#';   // set href to create link
  // add event listener to link
  commentLink.addEventListener('click', () => {
    // gets a promise of the collection of comments
    getComments(thePost.id).then((commentList) => {
      console.log({commentList});
      // add comments to the page
      addComments(commentList);
    })
  });

  // need the author info, call getAuthor from above
  getAuthor(thePost.userId).then((data) => {
    console.log(data);
    // set content for elements
    authorName.innerText = `By: ${data.name}`;
    authorEmail.innerText = data.email;
    
    // append elements to container element
    element.append(postTitle, authorName, postBody, authorEmail, commentLink);
  })
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

// this function takes a collection of comments as json
// and adds each comment to 
function addComments(comments) {
  console.log({addComments:comments})
   // get container div
  const container = document.getElementById('container');
  // create h1 element, set the textContent, and append to page
  const commentHeader = document.createElement('h1');
  commentHeader.textContent = "Comments:";
  container.appendChild(commentHeader);

  // for each comment, create elements for components of comment,
  // then assign the textContent for each element, and append all
  comments.forEach((comment) => {
    const commentName = document.createElement('h2');
    const commentBody = document.createElement('p');
    const commentEmail = document.createElement('h4');
    commentName.textContent = `name: ${comment.name}`;
    commentBody.textContent = `body: ${comment.body}`;
    commentEmail.textContent = `email: ${comment.email}`;
    container.append(commentName, commentBody, commentEmail);
    container.appendChild(document.createElement('hr'));
  })

  // remove show comments link
  container.removeChild(document.getElementById('commentLink'));
}


/*** functions for author.html page ***/

function showAuthorInfo(userId) {
  console.log(`showing author info for user ${userId}`);
  const container = document.getElementById('container');
  const authorName = document.createElement('h1');
  const authorEmail = document.createElement('h3');
  const authorAddress = document.createElement('h3');
  const blogPostsLink = document.createElement('a');
  blogPostsLink.textContent = `See blog posts by this author`;
  blogPostsLink.href = `author-posts.html?userId=${userId}`;

  getAuthor(userId).then((authorInfo) => {
    console.log({authorInfo});
    authorName.textContent = `Author: ${authorInfo.name}`;
    authorEmail.textContent = `Email: ${authorInfo.email}`;
    authorAddress.textContent = `Address: ${JSON.stringify(authorInfo.address)}`;

    container.append(authorName, authorEmail, authorAddress, blogPostsLink);
  })
}


// driver code

// get URL of page
var fileName = window.location.href;
console.log(window.location.href);
// console.log({fileName});

if (fileName.includes("index.html")) {
  console.log('We are at index, getAllPosts()');
  getAllPosts();
}
if(fileName.includes("post.html")) {
  // get the postId
  console.log('We are in post.html, getting postId');
  let thePostId = window.location.href.split("postId=").slice(-1)[0];
  getPost(thePostId); 
}
if(fileName.includes("author.html")) {
  console.log('We are in author.html!! need the author');
  let theUserId = window.location.href.split("userId=").slice(-1)[0];
  showAuthorInfo(theUserId);
}





/*** EXTRA FUNCTIONS ***/

// Promise.all([promiseOne, promiseTwo, promiseThree]).then((values) => doSomething(values););
// function getAllPosts() {
//   fetch("https://jsonplaceholder.typicode.com/posts/")
//     .then(function(response) {
//       return response.json();
//     })
//     .then(function(json) {
//       let allUsers = json.map(getUser); // => ['a', 'b', 'c'].map(letter => letter.toUpperCase()) => ['A', 'B', 'C']
//       Promise.all(allUsers);
//     });
// }
//
// function getUser(thePost) {
//   fetch("https://jsonplaceholder.typicode.com/users/" + thePost.userId)
//     .then(function (result) {
//       return result.json();
//     })
//     .then(function (userData) {
//       console.log({
//         userId: userData.id
//       });
//       document
//         .getElementById("container")
//         .appendChild(document.createElement("h3")).textContent = `Id: ${userData.id}`;
//     });
// }
//
// function unorderedAddAllPosts(allPromises) {
//   // Unordered returned Promises
//   allPromises.forEach(postValue => {
//     postValue.then(value => {
//       value.json().then(json => {
//         addPost(json);
//       });
//     });
//   });
// }