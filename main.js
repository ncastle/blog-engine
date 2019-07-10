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
  const element = document.getElementById("container"); // select container div
  const title = document.createElement("h2");   // create title elem
  const titleLink = document.createElement('a');
  // const body = document.createElement("p");
  const author = document.createElement("h3");
  // const email = document.createElement('a');
  // const phone = document.createElement('a');

  // we need the author so call get author function
  // which returns a promise containing the authors info
  //based on the userId on the current post
  getAuthor(thePost.userId).then(authorData => {
    titleLink.textContent = `Title: ${thePost.title}`;
    titleLink.href = `posts.html?postId=${thePost.id}`;
    // body.textContent = `Body: ${thePost.body}`;
    author.textContent = `Author: ${authorData.name}`;
    // email.textContent = `Email: ${authorData.email}`
    // email.href = 'mailto:' + authorData.email;

    // phone.textContent = `Phone: ${authorData.phone}`
    // phone.href = 'tel:' + authorData.phone;

    title.appendChild(titleLink);
    element.appendChild(title);
    // element.appendChild(body);
    element.appendChild(author);
    // element.appendChild(email);
    element.appendChild(document.createElement('hr'));
    // element.appendChild(phone);

    // set event listener for title click

  });
}

// this function fetches an author and returns a promise
// holding the author's info based on an id argument
function getAuthor(authorId) {
  return fetch(`https://jsonplaceholder.typicode.com/users/${authorId}`).then(response => { return response.json(); });   // returns a promise
}


/*** functions for posts.html page ***/

function getPost(postId) {
  // fetch post with postId & return promise
  fetch(`https://jsonplaceholder.typicode.com/posts/${postId}`)
    // console log the promise
    .then((postResponse) => {
      console.log({postResponse});
      return postResponse.json(); // convert response to json
    }).then((postJSON) => {
      console.log({postJSON});
      addSpecificPost(postJSON);
    });
}

function addSpecificPost(thePost) {
  console.log('were adding a post');
  console.log(thePost)

  const element = document.getElementById('container');
  const postTitle = document.createElement('h1');
  const postBody = document.createElement('p');
  const authorName = document.createElement('h2');
  const authorEmail = document.createElement('h3');
  const commentLink = document.createElement('a');
  
  postTitle.textContent = `${thePost.title}`;
  postBody.textContent = `${thePost.body}`;
  

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



// driver code

// get URL of page
var fileName = window.location.href;
console.log(window.location.href);
// console.log({fileName});

if (fileName.includes("index.html")) {
  console.log('We are at index, getAllPosts()');
  getAllPosts();
}
if(fileName.includes("posts.html")) {
  // get the postId
  console.log('We are in posts.html, getting postId');
  let thePostId = window.location.href.split("postId=").slice(-1)[0];
  getPost(thePostId); 
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