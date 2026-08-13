(function () {
  var D = RESEARCH_DATA;

  var LINK_BADGES = {
    bib: "badge-gray",
    pdf: "badge-red",
    arXiv: "badge-orange",
    IEEE: "badge-navy",
    SpringerLink: "badge-green"
  };

  renderContainer("publications-container", renderPubOrPreprint, D.publications, "publication");
  renderContainer("preprints-container", renderPubOrPreprint, D.preprints, "preprint");
  renderContainer("research-activities-container", renderSimpleItem, D.researchActivities, "research-activity-theme");
  renderContainer("dissemination-container", renderSimpleItem, D.disseminationActivities, "dissemination-theme");
  renderTeaching(D.teaching);
  renderContainer("education-container", renderSimpleItem, D.education, "education-theme");

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

  function renderPubOrPreprint(item, type) {
    var themeClass = type === "publication" ? "pub-post-theme" : "preprint-post-theme";

    var linksHtml = "";
    if (item.links && item.links.length) {
      var parts = [];
      for (var i = 0; i < item.links.length; i++) {
        var label = item.links[i].label;
        var cls = "link-badge " + (LINK_BADGES[label] || "badge-gray");
        parts.push(
          '<a class="' + cls + '" href="' + item.links[i].url + '">' + label + "</a>"
        );
      }
      linksHtml = parts.join(" ");
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
      codeTitles(item.title) +
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
      '    <div class="post-foot"><img src="icons/clock.svg" width="12px" height="12px"/> ' +
      item.date +
      (linksHtml ? ' &middot; ' + linksHtml : '') +
      "</div>\n" +
      "  </div>\n" +
      "</article>\n";
    return html;
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

    html +=
      '    <div class="post-foot"><img src="icons/clock.svg" width="12px" height="12px"/> ' +
      date +
      "</div>\n" +
      "  </div>\n" +
      "</article>\n";
    return html;
  }

  function renderTeaching(data) {
    var el = document.getElementById("teaching-container");
    if (!el || !data) return;
    var html = "";

    // Thesis Supervision
    if (data.thesisSupervision && data.thesisSupervision.length) {
      html += '<h2 style="margin-top:0;">Thesis Supervision</h2>';
      for (var i = 0; i < data.thesisSupervision.length; i++) {
        var s = data.thesisSupervision[i];
        var titleHtml = s.name + ', <em>' + codeTitles(s.title) + '</em>';
        html +=
          '<article class="post-block teaching-theme" style="margin-bottom: 1rem;">\n' +
          '  <div class="post-inner">\n' +
          '    <div class="post-title">' + titleHtml + '</div>\n' +
          '    <div class="post-foot">' + s.where + ' &middot; Score: ' + s.score + ' &middot; ' + s.when + '</div>\n' +
          '  </div>\n' +
          '</article>\n';
      }
    }

    // Graduate Courses
    if (data.graduateCourses && data.graduateCourses.length) {
      html += '<h2>Graduate Courses</h2>';
      for (var i = 0; i < data.graduateCourses.length; i++) {
        html += renderSimpleItem(data.graduateCourses[i], "teaching-theme");
      }
    }

    // Additional Activities
    if (data.additionalActivities && data.additionalActivities.length) {
      html += '<h2>Additional Activities</h2>';
      for (var i = 0; i < data.additionalActivities.length; i++) {
        html += renderSimpleItem(data.additionalActivities[i], "teaching-theme");
      }
    }

    el.innerHTML = html;
  }

})();
