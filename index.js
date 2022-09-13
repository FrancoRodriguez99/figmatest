//Creating a function to generate all the data needed for the post.

async function generateData() {
  //Getting the data from the API, then extracting the download URL from the recovered object image, or in case of error the error.

  var imagesAPI = await fetch("https://picsum.photos/v2/list?page=2&limit=4")
    .then((response) => response.json())
    .then((data) => {
      return data.map((objpic) => objpic.download_url);
    })
    .catch((error) => error);

  // Manually generating the rest of the data, and returning it whit the photos, as an object.
  return {
    author: {
      pic: "./assets/avatar.png",
      name: "Erik Dunlop",
      ubication: "San Francisco, California",
    },
    images: [...imagesAPI],

    comments: [
      {
        name: "Lucas Credice",
        text: "dolor sit amet, consectetur adipiscing elit. Mi enim ut eu cras ultrices eget et tristique proin. Mi enim ut eu cras ultrices eget et tristique proin.",
      },
    ],
  };
}

//Generating the comment section

function commentsSection(comments) {
  //Gets an array of objects, and puts the author of the comment and the comment text in a div, then appends it to the comments box
  comments.forEach((x) => {
    var comment_box = document.createElement("div");
    var comment_creator = document.createElement("p");
    comment_creator.innerHTML = x.name + " ";
    comment_creator.className = "comment_creator";
    var comment_text = document.createElement("p");
    comment_text.className = "comment_text";
    comment_text.innerHTML = x.text;
    comment_box.className = "comment";
    comment_box.append(comment_creator, comment_text);
    document.getElementById("comments").append(comment_box);
  });
}

//This is a Listener to check if you added a comment, and that it isn't empty
document
  .getElementById("sumbit_comment")
  .addEventListener("click", function () {
    var comment = document.getElementById("write_comment");
    if (comment.value !== "") {
      commentsSection([{ name: "Comment", text: comment.value }]);
      comment.value = "";
    }
  });

//Inserting the data into our html

async function insertData() {
  const data = await generateData();

  document.getElementById("profile_pic").src = data.author.pic;
  document.getElementById("author_name").innerHTML = data.author.name;
  document.getElementById("author_ubication").innerHTML = data.author.ubication;
  //I created my own carrousell, you can check line 80 for more info.
  rotatoryImage(data.images);
  commentsSection(data.comments);
}
//This is to check if you liked the post.
document.getElementById("like_btn").addEventListener("click", function () {
  btn_class = document.getElementById("like_btn");

  btn_class.className = btn_class.className === "liked" ? "unliked" : "liked";
});

//This generates and inserts all the data necesary for the web.
insertData();

/*
 I took a bold move, I figured you get hundreds of these identical Test, 
 so in order to make mine unique from all the rest 
 I make my own carousel in js, css and html pure, If you don't care for it, you can ignore 
 all the following lines, they are just for the image carrousel :(
*/

function rotatoryImage(images) {
  if (images.length > 1) {
    //Creating the cycling options.
    var back = document.createElement("button");
    back.className = "back_max";
    back.id = "back_btn";
    var next = document.createElement("button");
    next.className = "next";
    next.id = "next_btn";
    var options = document.createElement("div");
    options.id = "array_btns";

    //Assigns a button to go directly to each photo
    images.forEach((x, index) => {
      var image = document.createElement("img");
      image.src = x;
      image.id = "image_id_" + index;
      image.className = index === 0 ? "image_on_screen" : "image_off_screen";

      document.getElementById("images_rotatory").append(image);

      var option_button = document.createElement("button");
      option_button.id = "images_option_" + index;
      option_button.className =
        index === 0 ? "images_option" : "images_option_disabled";

      option_button.addEventListener("click", function () {
        images.forEach((x, index2) => {
          document.getElementById("image_id_" + index2).className =
            "image_off_screen";
        });
        document.getElementById("image_id_" + index).className =
          "image_on_screen";

        //Adding the event listener to change photos if pressed,
        //and change the current photo (needed to tell what photo we are in, that way we can change between next and previous photo)
        document
          .getElementById("images_rotatory")
          .setAttribute("current", index);

        images.forEach((x, index) => {
          document.getElementById("images_option_" + index).className =
            "images_option_disabled";
        });
        document.getElementById("images_option_" + index).className =
          "images_option";

        if (index === 0) {
          document.getElementById("next_btn").className = "next";
          document.getElementById("back_btn").className = "back_max";
        } else if (index === images.length - 1) {
          document.getElementById("next_btn").className = "next_max";
          document.getElementById("back_btn").className = "back";
        } else {
          document.getElementById("next_btn").className = "next";
          document.getElementById("back_btn").className = "back";
        }
      });
      //Adds the button of one image, to the div of all the buttons.

      options.append(option_button);
    });

    //This two function generates the next and previous image button. And change the current tag dependly on where it goes, also makes sure
    // it doesn't run out of the array length

    next.addEventListener("click", () => {
      var current = parseInt(
        document.getElementById("images_rotatory").getAttribute("current")
      );
      if (current !== images.length - 1) {
        document.getElementById("image_id_" + current).className =
          "image_off_screen";
        let i = current + 1;
        document.getElementById("image_id_" + i).className = "image_on_screen";
        document
          .getElementById("images_rotatory")
          .setAttribute("current", current + 1);
        document.getElementById("back_btn").className = "back";

        images.forEach((x, index) => {
          document.getElementById("images_option_" + index).className =
            index === current + 1 ? "images_option" : "images_option_disabled";
        });
      }

      if (current + 1 === images.length - 1) {
        document.getElementById("next_btn").className = "next_max";
      }
    });

    back.addEventListener("click", () => {
      var current = parseInt(
        document.getElementById("images_rotatory").getAttribute("current")
      );

      if (current !== 0) {
        document.getElementById("image_id_" + current).className =
          "image_off_screen";
        let i = current - 1;
        document.getElementById("image_id_" + i).className = "image_on_screen";
        document
          .getElementById("images_rotatory")
          .setAttribute("current", current - 1);
        document.getElementById("next_btn").className = "next";

        images.forEach((x, index) => {
          document.getElementById("images_option_" + index).className =
            index === current - 1 ? "images_option" : "images_option_disabled";
        });
      }
      if (current - 1 === 0) {
        document.getElementById("back_btn").className = "back_max";
      }
    });

    //Now we add all the previously created buttons

    document.getElementById("images").append(back, next, options);
  } else {
    //In case there is only one image, we only add that one, we don't need the buttons.
    //Already thinking ahead for scalability!
    document.getElementById("images_rotatory").src = images[0];
  }
}
