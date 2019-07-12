// export
export {addAllPosts, addPost, addSpecificPost, addComments, showAuthorInfo, showAuthorPosts}

import {getAuthor} from '/client.js'
// index.html

// this func takes an array of promises
function addAllPosts(allPromises) {
  
}

// add post handles displaying a post to the page
function addPost(thePost) {
  const container = document.getElementById("container"); // select container div
  //create elements
  const title = document.createElement("h2");
  const titleLink = document.createElement('a');
  const author = document.createElement("h3");
  const authorLink = document.createElement('a');

  const authorData = thePost.author;
  // set content
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

    

}


// posts.html

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


// author.html


// handles fetching and displaying an author's blog posts
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


// about-posts.html

function showAuthorPosts(userId) {
  console.log(`showing posts for user ${userId}`);

  // fetch the promise containing all of an author's posts
  fetch(`https://jsonplaceholder.typicode.com/posts?userId=${userId}`)
  .then((postResponse) => {
    return postResponse.json();
  }).then((posts) => {
    console.log({posts});
    addAuthorPosts(posts);  // add posts to document
  });
  
  // add each of the author's posts to the document
  function addAuthorPosts(thePosts) {
    console.log('adding author posts');
    const container = document.getElementById('container');
    const header = document.getElementById('header');
    const postsTitle = document.createElement('h2');
    postsTitle.textContent = `Posts:`;
    container.appendChild(postsTitle);

    // get author name for header
    getAuthor(userId).then((data) => {
      header.textContent = `Blog Posts for ${data.name}`;
    });
    
    // for each post set textContent and append to document
    thePosts.forEach((post) => {
      const title = document.createElement('h3');
      const body = document.createElement('p');
      title.textContent = post.title;
      body.textContent = post.body;

      container.append(title, body);
      container.appendChild(document.createElement('hr'));
    });
  }
}
  