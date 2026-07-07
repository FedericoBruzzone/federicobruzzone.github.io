(function () {
  var D = RESEARCH_DATA;
  renderContainer("oss-contributions-container", renderSimpleItem, D.openSourceContributions, "oss-contribution-theme");
  renderContainer("personal-projects-container", renderPersonalProject, D.personalProjects, "personal-project-theme");

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
      "</div>\n";

    if (desc) {
      html +=
        '    <div class="post-desc">' + desc + "</div>\n";
    }

    var foot = date;
    if (project) {
      foot = date + ' \u00b7 <code>' + project + "</code>";
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
