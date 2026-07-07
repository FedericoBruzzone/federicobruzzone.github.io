(function () {
  renderLatestPosts();
  renderEterSeries();

  function renderLatestPosts() {
    var latest = POSTS_DATA.filter(function (p) {
      return p.series !== "eter" && p.showOnIndex !== false;
    }).sort(function (a, b) { return b.date.localeCompare(a.date); });

    var container = document.getElementById("latest-posts-container");
    if (!container) return;

    var html = "";
    for (var i = 0; i < latest.length; i++) {
      if (i === 0) {
        html += renderIndexPost(latest[i], "latest");
      } else if (i === 1) {
        html += "\n<br>\n\n";
        html += renderIndexPost(latest[i], "latest");
      } else if (i === 2) {
        html +=
          '\n<details class="collapsible">\n' +
          '    <summary>Show older posts</summary>\n' +
          "    <br>\n";
        html += renderIndexPost(latest[i], "latest");
      } else {
        html += "\n<br>\n";
        html += renderIndexPost(latest[i], "latest");
      }
    }
    if (latest.length > 2) {
      html += "\n</details>\n";
    }
    container.innerHTML = html;
  }

  function renderEterSeries() {
    var eter = POSTS_DATA.filter(function (p) {
      return p.series === "eter" && p.showOnIndex !== false;
    }).sort(function (a, b) { return b.date.localeCompare(a.date); });

    var container = document.getElementById("eter-posts-container");
    if (!container) return;

    var html = "";
    for (var i = 0; i < eter.length; i++) {
      if (i === 0) {
        html += renderIndexPost(eter[i], "eter");
      } else if (i === 1) {
        html +=
          '\n<details class="collapsible">\n' +
          '    <summary>Show older Eter Series posts</summary>\n' +
          "    <br>\n";
        html += renderIndexPost(eter[i], "eter");
      } else {
        html += "\n<br>\n";
        html += renderIndexPost(eter[i], "eter");
      }
    }
    if (eter.length > 1) {
      html += "\n</details>\n";
    }
    container.innerHTML = html;
  }

  function renderIndexPost(post, section) {
    var themeClass =
      section === "latest" ? "latest-post-theme" : "pinned-post-theme";
    var pinHtml =
      section === "latest"
        ? '<img src="icons/pin.svg" width="12px" height="12px"/> '
        : "";

    var titlePrefix = post.titlePrefix || "";
    if (titlePrefix && !titlePrefix.endsWith(" ")) {
      titlePrefix = titlePrefix + " ";
    }

    var readTimeHtml = "";
    if (post.readTime) {
      readTimeHtml = " |  Time to read: " + post.readTime;
    }

    return (
      '<div onclick="location.href=\'' +
      post.url +
      '\';" style="cursor: pointer;">\n' +
      '  <article class="post-block ' +
      themeClass +
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
      "</div>\n"
    );
  }
})();
