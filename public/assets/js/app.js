// Grab the products as a json
$.getJSON("/products", function(data) {
    // For each one
    console.log(data);
    for (var i = 0; i < data.length; i++) {
      // Display the apropos information on the page
      $("#products").append("<tr>" +
        "<td>"+
          "<button type='button' class='btn btn-primary' data-id='" + data[i]._id +"' data-toggle='modal' data-target='#exampleModalLong'>Notes</button>" + 
        "</td>" + 
        "<td>" + 
          "<p>" + 
            "<a href='" + data[i].link + "'>" + 
              data[i].title +
            "</a>" + 
          "</p>" + 
        "</tr>");
    }
  });
  
  
  // Whenever someone clicks a p tag
  $(document).on("click", "button", function() {
    console.log("hi");
    // Empty the notes from the note section
    $("#notes").empty();
    // Save the id from the p tag
    var thisId = $(this).attr("data-id");
    // Now make an ajax call for the Article
    $.ajax({
      method: "GET",
      url: "/products/" + thisId
    })
      // With that done, add the note information to the page
      .then(function(data) {
        // console.log(data);
        // The title of the article
        $("#notes").append("<div class='modal-body'>");
          {/* console.log(data.notes.length); */}
          for (var i=0; i < data.notes.length; i++) {
            $("#notes").append("<h5>" + data.notes[i].title + "</h5>");
            $("#notes").append("<p>" + data.notes[i].body + "</p>");
          }
        $("#notes").append("</div>");
        $("#notes").append("<div class='modal-footer'>");
          $("#notes").append("<form action='/submit' method='post'>");
            $("#notes").append("<input type='text' name='product' placeholder='product' id='titleinput'>");
            $("#notes").append("<input type='text' name='note' placeholder='note' id='bodyinput'>");
            $("#notes").append("<input type='submit' data-dismiss='modal' id='savenote' data-id='" + thisId +"'>");
          $("#notes").append("</form>");
        $("#notes").append("</div>");
      });
  });
  
  // When you click the savenote button
  $(document).on("click", "#savenote", function() {
    // Grab the id associated with the article from the submit button
    var thisId = $(this).attr("data-id");
  
    // Run a POST request to change the note, using what's entered in the inputs
    $.ajax({
      method: "POST",
      url: "/products/" + thisId,
      data: {
        // Value taken from title input
        title: $("#titleinput").val(),
        // Value taken from note textarea
        body: $("#bodyinput").val()
      }
    })
      // With that done
      .then(function(data) {
        // Log the response
        console.log(data);
        // Empty the notes section
        $("#notes").empty();
      });
  
    // Also, remove the values entered in the input and textarea for note entry
    $("#titleinput").val("");
    $("#bodyinput").val("");
  });
  