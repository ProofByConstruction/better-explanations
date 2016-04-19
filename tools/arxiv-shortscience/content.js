(function() {
  var location = window.location.href;
  var paper_id = location.substr(location.lastIndexOf('/') + 1);
  $.ajax({
    url: "http://www.shortscience.org/search?term=" + paper_id,
    success: function(data) {
      // This selector is brittle.
      paper_page = $(data).find(".col-md-10 > div > a")[0].href.substr(location.lastIndexOf('/') + 1);
      $.ajax({
        url: "http://www.shortscience.org/" + paper_page,
        success: function(data) {
          // As is this one.
          paper_summary = $(data).find(".source.panel-body.entry")[0]
          // If there's a summary, open the page.
          if (paper_summary.innerText !== "") {
            window.open("http://www.shortscience.org/" + paper_page,'_blank');
          }
        }
      })
    }
  });
})();
