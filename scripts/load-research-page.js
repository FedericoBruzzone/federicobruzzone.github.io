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
  renderListContainer("research-activities-container", D.researchActivities, "research-activity-theme");
  renderListContainer("dissemination-container", D.disseminationActivities, "dissemination-theme");
  renderTeaching(D.teaching);
  renderListContainer("education-container", D.education, "education-theme");

  function renderListContainer(id, items, themeClass) {
    var el = document.getElementById(id);
    if (!el) return;
    el.innerHTML = renderListCard(items, themeClass, renderListItem);
  }

  function renderListCard(items, themeClass, itemFn) {
    var html = "";
    for (var i = 0; i < (items || []).length; i++) {
      if (items[i].hidden) continue;
      html += itemFn(items[i]);
    }
    if (!html) return "";
    return (
      '<article class="post-block ' + themeClass + '" style="margin-bottom: 1rem;">\n' +
      '  <div class="post-inner">\n' +
      '    <ul class="oss-list">\n' +
      html +
      "    </ul>\n" +
      "  </div>\n" +
      "</article>\n"
    );
  }

  function renderListItem(item) {
    var title = item.titleHtml || codeTitles(item.title || item.what || "");
    if (item.url) title = '<a href="' + item.url + '" style="text-decoration:none;">' + title + "</a>";
    var rest = [];
    var desc = item.desc || (item.details && item.details.join(" \u00b7 "));
    if (desc) rest.push("<em>" + desc + "</em>");
    rest.push('<span class="oss-date">' + (item.date || item.when || "") + "</span>");
    return "      <li><strong>" + title + "</strong> &middot; " + rest.join(" &middot; ") + "</li>\n";
  }

  function renderThesisItem(s) {
    return (
      "      <li><strong>" + s.name + "</strong> &middot; <em>" + codeTitles(s.title) + "</em> &middot; " +
      s.where + ", " + s.score + ' &middot; <span class="oss-date">' + s.when + "</span></li>\n"
    );
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

  function renderTeaching(data) {
    var el = document.getElementById("teaching-container");
    if (!el || !data) return;
    var html = "";

    if (data.thesisSupervision && data.thesisSupervision.length) {
      html += '<h2 style="margin-top:0;">Thesis Supervision</h2>';
      html += renderListCard(data.thesisSupervision, "teaching-theme", renderThesisItem);
    }

    if (data.graduateCourses && data.graduateCourses.length) {
      html += '<h2>Graduate Courses</h2>';
      html += renderListCard(data.graduateCourses, "teaching-theme", renderListItem);
    }

    if (data.additionalActivities && data.additionalActivities.length) {
      html += '<h2>Additional Activities</h2>';
      html += renderListCard(data.additionalActivities, "teaching-theme", renderListItem);
    }

    el.innerHTML = html;
  }

})();
