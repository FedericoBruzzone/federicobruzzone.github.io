(function () {
  var D = RESEARCH_DATA;

  var LINK_BADGES = {
    bib: "badge-gray",
    pdf: "badge-red",
    arXiv: "badge-orange",
    IEEE: "badge-navy",
    SpringerLink: "badge-green"
  };

  renderContainer("index-publications-container", renderPubOrPreprint, D.publications, "publication");
  renderContainer("index-preprints-container", renderPubOrPreprint, D.preprints, "preprint");

  function renderContainer(id, renderFn, items, extra) {
    var el = document.getElementById(id);
    if (!el || !items || !items.length) return;
    var html = "";
    for (var i = 0; i < items.length; i++) {
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
})();
