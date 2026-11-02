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
    "Paper": "project-orange",
    "Event": "project-blue"
  };

  renderSummary("oss-summary-container", D.openSourceSummary);
  renderIndex();
  renderProjects(D.openSourceSummary);
  renderPersonalProjects();

  function renderIndex() {
    var el = document.getElementById("index-oss-container");
    if (!el) return;
    var rows = (D.openSourceSummary || []).filter(function (r) { return r.project === "llvm-project"; });
    el.innerHTML = renderGroupCard('<img src="posts/images/MLIR.png" alt="MLIR logo" width="17px"/> <img src="posts/images/LLVM.png" alt="LLVM logo" width="17px"/> Being Part of the MLIR/LLVM Community', projectItems(D.openSourcePapersRFCsTalks, "llvm-project"), summaryLine(rows[0]));
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
      (title ? '    <div class="post-title">' + title + "</div>\n" : "") +
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
      { title: "Papers, RFCs, Talks, and Events", items: D.openSourcePapersRFCsTalks },
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
    var statusBadge = item.status ? ' <span class="status-badge">' + item.status + "</span>" : "";
    var rest = [];
    if (item.desc) rest.push("<em>" + item.desc + "</em>");
    rest.push('<span class="oss-date">' + item.date + "</span>");
    return "  <li>" + typeBadge + title + revertedBadge + statusBadge + " &middot; " + rest.join(" &middot; ") + "</li>\n";
  }

  function codeTitles(s) {
    return s.replace(/`([^`]+)`/g, '<code>$1</code>');
  }

  function renderPersonalProjects() {
    var el = document.getElementById("personal-projects-container");
    if (!el) return;
    var items = (D.personalProjects || []).filter(function (it) { return !it.hidden; });
    el.innerHTML = renderGroupCard("", items);
  }
})();
