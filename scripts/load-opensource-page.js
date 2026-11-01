(function () {
  var D = RESEARCH_DATA;

  var PROJECT_BADGES = {
    "llvm-project": "project-blue",
    "lighthouse": "project-blue",
    "iree": "project-teal",
    "rustc": "project-orange",
    "rustworkx": "project-purple",
    "source-matching": "project-red"
  };

  var TYPE_BADGES = {
    "RFC": "project-teal",
    "Poster": "project-purple",
    "Paper": "project-orange"
  };

  renderSummary("oss-summary-container", D.openSourceSummary);
  renderIndex();
  renderProjects(D.openSourceSummary);
  renderContainer("personal-projects-container", renderPersonalProject, D.personalProjects);

  function renderIndex() {
    var el = document.getElementById("index-oss-container");
    if (!el) return;
    var rows = (D.openSourceSummary || []).filter(function (r) { return r.project === "llvm-project"; });
    el.innerHTML = renderGroupCard('<img src="posts/images/MLIR.png" alt="MLIR logo" width="17px"/> <img src="posts/images/LLVM.png" alt="LLVM logo" width="17px"/> MLIR/LLVM: Papers, RFCs, and Talks', projectItems(D.openSourcePapersRFCsTalks, "llvm-project"), summaryLine(rows[0]));
  }

  function projectItems(items, project) {
    return (items || []).filter(function (it) {
      return it.project === project && !it.hidden;
    });
  }

  function renderGroupCard(title, items, intro) {
    if (!items.length) return "";
    var html =
      '<article class="post-block" style="margin-bottom: 1rem;">\n' +
      '  <div class="post-inner">\n' +
      '    <div class="post-title">' + title + "</div>\n" +
      (intro || "") +
      '    <ul class="oss-list">\n';
    for (var i = 0; i < items.length; i++) {
      html += renderListItem(items[i]);
    }
    return html + "    </ul>\n  </div>\n</article>\n";
  }

  function renderSummary(id, rows) {
    var el = document.getElementById(id);
    if (!el || !rows || !rows.length) return;
    el.innerHTML = summaryTable(rows);
  }

  function countLink(n, label, href) {
    if (!n) return "&ndash;";
    return '<a href="' + href + '"><strong>' + n + "</strong> " + label + "</a>";
  }

  function statLinks(r) {
    var base = "https://github.com/" + r.repo;
    return [
      countLink(r.prs, "PRs", base + "/pulls?q=is:pr+author:FedericoBruzzone"),
      countLink(r.reviews, "reviews", base + "/pulls?q=is:pr+reviewed-by:FedericoBruzzone+-author:FedericoBruzzone"),
      countLink(r.issues, "issues", base + "/issues?q=is:issue+author:FedericoBruzzone")
    ];
  }

  function summaryLine(r) {
    return '    <div class="oss-stats">' + statLinks(r).join(" &middot; ") + "</div>\n";
  }

  function summaryTable(rows) {
    var html =
      '<table class="post-table">\n' +
      "  <thead><tr><th>Project</th><th>Pull requests</th><th>Reviews</th><th>Issues</th></tr></thead>\n" +
      "  <tbody>\n";
    for (var i = 0; i < rows.length; i++) {
      var r = rows[i];
      var cls = "project-badge " + (PROJECT_BADGES[r.project] || "project-gray");
      var stats = statLinks(r);
      if (r.prs && r.merged !== r.prs) stats[0] += " (<strong>" + r.merged + "</strong> merged)";
      html +=
        "    <tr>" +
        '<td><a href="https://github.com/' + r.repo + '" style="text-decoration:none;"><span class="' + cls + '">' + r.name + "</span></a></td>" +
        "<td>" + stats[0] + "</td><td>" + stats[1] + "</td><td>" + stats[2] + "</td>" +
        "</tr>\n";
    }
    return html + "  </tbody>\n</table>\n";
  }

  function renderProjects(rows) {
    var el = document.getElementById("oss-contributions-container");
    if (!el || !rows || !rows.length) return;

    var groups = [
      { title: "Papers, RFCs, and Talks", items: D.openSourcePapersRFCsTalks },
      { title: "Pull Requests", items: D.openSourceContributions }
    ];

    var html = "";
    for (var i = 0; i < rows.length; i++) {
      var section = "";
      for (var g = 0; g < groups.length; g++) {
        section += renderGroupCard(groups[g].title, projectItems(groups[g].items, rows[i].project));
      }
      if (section) html += "<h1>" + rows[i].name + "</h1>\n" + section;
    }
    el.innerHTML = html;
  }

  function renderListItem(item) {
    var title = item.titleHtml || codeTitles(item.title);
    var typeBadge = item.type
      ? '<span class="project-badge ' + TYPE_BADGES[item.type] + '" style="margin: 0 0.5rem 0 0;">' + item.type + "</span>"
      : "";
    if (item.url) title = '<a href="' + item.url + '" style="text-decoration:none;">' + title + "</a>";
    title = '<strong>' + title + "</strong>";
    var revertedBadge = item.revertedBy
      ? ' <a class="reverted-badge" href="' + item.revertedBy + '" title="This contribution has been reverted">reverted</a>'
      : "";
    var rest = [];
    if (item.desc) rest.push("<em>" + item.desc + "</em>");
    rest.push('<span class="oss-date">' + item.date + "</span>");
    return "  <li>" + typeBadge + title + revertedBadge + " &middot; " + rest.join(" &middot; ") + "</li>\n";
  }

  function renderContainer(id, renderFn, items, extra) {
    var el = document.getElementById(id);
    if (!el || !items || !items.length) return;
    var html = "";
    for (var i = 0; i < items.length; i++) {
      if (items[i].hidden) continue;
      html += renderFn(items[i], extra);
    }
    el.innerHTML = html;
  }

  function codeTitles(s) {
    return s.replace(/`([^`]+)`/g, '<code>$1</code>');
  }

  function renderSimpleItem(item, themeClass) {
    var title = item.title || item.what || "";
    var titleHtml = item.titleHtml || codeTitles(title);
    if (item.url) {
      titleHtml =
        '<a href="' +
        item.url +
        '" style="text-decoration:none;">' +
        titleHtml +
        "</a>";
    }

    var revertedBadge = "";
    if (item.revertedBy) {
      revertedBadge =
        ' <a class="reverted-badge" href="' +
        item.revertedBy +
        '" title="This contribution has been reverted">reverted</a>';
    }

    var desc = item.desc;
    if (!desc && item.details) {
      desc = item.details.join(" \u00b7 ");
    }

    var date = item.date || item.when || "";
    var project = item.project || "";

    var html =
      '<article class="post-block ' + (themeClass || "") + '" style="margin-bottom: 1rem;">\n' +
      '  <div class="post-inner">\n' +
      '    <div class="post-title">' +
      titleHtml +
      revertedBadge +
      "</div>\n";

    if (desc) {
      html +=
        '    <div class="post-desc">' + desc + "</div>\n";
    }

    var foot = date;
    if (project) {
      var cls = "project-badge " + (PROJECT_BADGES[project] || "project-gray");
      foot = date + ' <span class="' + cls + '">' + project + "</span>";
    }
    html +=
      '    <div class="post-foot"><img src="icons/clock.svg" width="12px" height="12px"/> ' +
      foot +
      "</div>\n" +
      "  </div>\n" +
      "</article>\n";
    return html;
  }

  function renderPersonalProject(item, themeClass) {
    var titleHtml = item.titleHtml || item.title;
    var url = item.url;
    if (url) {
      titleHtml =
        '<a href="' +
        url +
        '" style="text-decoration:none;">' +
        titleHtml +
        "</a>";
    }

    var desc = item.desc || "";

    return (
      '<article class="post-block ' + (themeClass || "") + '" style="margin-bottom: 1rem;">\n' +
      '  <div class="post-inner">\n' +
      '    <div class="post-title">' +
      titleHtml +
      "</div>\n" +
      '    <div class="post-desc">' +
      desc +
      "</div>\n" +
      '    <div class="post-foot"><img src="icons/clock.svg" width="12px" height="12px"/> ' +
      item.date +
      "</div>\n" +
      "  </div>\n" +
      "</article>\n"
    );
  }
})();
