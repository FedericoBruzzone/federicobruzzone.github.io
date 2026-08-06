(function () {
  var sorted = POSTS_DATA.filter(function (p) {
    return p.showOnIndex !== false;
  }).sort(function (a, b) { return b.date.localeCompare(a.date); });
  var container = document.getElementById("posts-list-container");
  if (!container) return;

  var html = "";
  for (var i = 0; i < sorted.length; i++) {
    html += renderPostBlock(sorted[i], "list");
  }
  container.innerHTML = html;

  function renderPostBlock(post, context) {
    var themeClass = "";
    var pinHtml = "";

    if (context === "list") {
      if (post.pinned) {
        pinHtml = '<img src="icons/pin.svg" width="16px" height="16px"/> ';
      }
    }

    var titlePrefix = post.titlePrefix || "";
    if (titlePrefix && !titlePrefix.endsWith(" ")) {
      titlePrefix = titlePrefix + " ";
    }

    var readTimeHtml = "";
    if (post.readTime) {
      readTimeHtml = " |  Time to read: " + post.readTime;
    }

    var themeAttr = themeClass ? " " + themeClass : "";

    return (
      '<div onclick="location.href=\'' +
      post.url +
      '\';" data-date="' +
      post.date +
      '" style="cursor: pointer;">\n' +
      '  <article class="post-block' +
      themeAttr +
      '">\n' +
      '    <div class="post-inner">\n' +
      '      <div class="post-title">\n' +
      "        " +
      pinHtml +
      titlePrefix +
      post.title +
      "\n" +
      "      </div>\n" +
      '      <div class="post-desc">\n' +
      "        " +
      post.desc +
      "\n" +
      "      </div>\n" +
      '      <div class="post-foot">\n' +
      '        <img src="icons/clock.svg" width="12px" height="12px"/> Date: ' +
      post.dateDisplay +
      readTimeHtml +
      "\n" +
      "      </div>\n" +
      "    </div>\n" +
      "  </article>\n" +
      "</div>\n" +
      "<br>\n"
    );
  }
})();
