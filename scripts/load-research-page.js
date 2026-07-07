(function () {
  var D = RESEARCH_DATA;
  renderContainer("publications-container", renderPubOrPreprint, D.publications, "publication");
  renderContainer("preprints-container", renderPubOrPreprint, D.preprints, "preprint");
  renderContainer("research-activities-container", renderSimpleItem, D.researchActivities);
  renderContainer("dissemination-container", renderSimpleItem, D.disseminationActivities);
  renderContainer("personal-projects-container", renderPersonalProject, D.personalProjects);
  renderContainer("oss-contributions-container", renderSimpleItem, D.openSourceContributions);

  function renderContainer(id, renderFn, items, extra) {
    var el = document.getElementById(id);
    if (!el || !items || !items.length) return;
    var html = "";
    for (var i = 0; i < items.length; i++) {
      html += renderFn(items[i], extra);
    }
    el.innerHTML = html;
  }

  function renderPubOrPreprint(item, type) {
    var themeClass = type === "publication" ? "pub-post-theme" : "preprint-post-theme";

    var linksHtml = "";
    if (item.links && item.links.length) {
      var parts = [];
      for (var i = 0; i < item.links.length; i++) {
        parts.push(
          '<a href="' + item.links[i].url + '">' + item.links[i].label + "</a>"
        );
      }
      linksHtml = parts.join(" &middot; ");
    }

    var html =
      '<article class="post-block ' +
      themeClass +
      '" style="margin-bottom: 1rem;">\n' +
      '  <div class="post-inner">\n' +
      '    <div class="post-title">\n' +
      '      <a href="' +
      item.url +
      '" style="text-decoration:none;">' +
      item.title +
      "</a>\n" +
      "    </div>\n" +
      '    <div class="post-desc" style="margin: 0.3rem 0 0.1rem;">' +
      item.authors +
      "</div>\n";

    if (item.venue) {
      html +=
        '    <div class="post-desc" style="margin: 0 0 0.1rem;">' +
        item.venue +
        "</div>\n";
    }

    html +=
      '    <div class="post-desc" style="margin: 0 0 0.4rem; font-size:0.9rem;">' +
      item.note +
      "</div>\n" +
      '    <div class="post-foot" style="margin-bottom:0.2rem;">\n' +
      "      " +
      linksHtml +
      "\n" +
      "    </div>\n" +
      '    <div class="post-foot"><img src="icons/clock.svg" width="12px" height="12px"/> Date: ' +
      item.date +
      "</div>\n" +
      "  </div>\n" +
      "</article>\n";
    return html;
  }

  function renderSimpleItem(item) {
    var titleHtml = item.titleHtml || item.title;
    if (item.url) {
      titleHtml =
        '<a href="' +
        item.url +
        '" style="text-decoration:none;">' +
        titleHtml +
        "</a>";
    }

    var html =
      '<article class="post-block" style="margin-bottom: 1rem;">\n' +
      '  <div class="post-inner">\n' +
      '    <div class="post-title">' +
      titleHtml +
      "</div>\n";

    if (item.desc) {
      html +=
        '    <div class="post-desc">' + item.desc + "</div>\n";
    }

    html +=
      '    <div class="post-foot"><img src="icons/clock.svg" width="12px" height="12px"/> ' +
      item.date +
      "</div>\n" +
      "  </div>\n" +
      "</article>\n";
    return html;
  }

  function renderPersonalProject(item) {
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

    var desc = item.desc ? "Maintainer. " + item.desc : "";

    return (
      '<article class="post-block" style="margin-bottom: 1rem;">\n' +
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
