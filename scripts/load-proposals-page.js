(function () {
  var D = RESEARCH_DATA;
  var proposals = D.researchProposals;
  if (!proposals || !proposals.length) return;

  var el = document.getElementById("proposals-container");
  if (!el) return;

  var parts = {};
  var partOrder = [];
  for (var i = 0; i < proposals.length; i++) {
    var p = proposals[i];
    var part = p.part || "Other";
    if (!parts[part]) {
      parts[part] = [];
      partOrder.push(part);
    }
    parts[part].push(p);
  }

  var html = "";
  for (var pi = 0; pi < partOrder.length; pi++) {
    var partName = partOrder[pi];
    html += '<h1>' + partName + '</h1>';
    var items = parts[partName];
    for (var j = 0; j < items.length; j++) {
      html += renderProposal(items[j]);
    }
  }
  el.innerHTML = html;

  function renderProposal(item) {
    var tagsHtml = "";
    if (item.tags && item.tags.length) {
      var parts = [];
      for (var i = 0; i < item.tags.length; i++) {
        parts.push('<code>' + item.tags[i] + '</code>');
      }
      tagsHtml = '<div class="post-desc" style="margin: 0.3rem 0;">' + parts.join(" ") + '</div>';
    }

    var metaHtml = "";
    var metaParts = [];
    if (item.difficulty) metaParts.push("Difficulty: " + stars(item.difficulty));
    if (item.conferences) metaParts.push(item.conferences);
    if (metaParts.length) {
      metaHtml = '<div class="post-desc" style="margin: 0.2rem 0; font-size:0.85rem;">' + metaParts.join(" &middot; ") + '</div>';
    }

    var relevanceHtml = "";
    if (item.relevance) {
      relevanceHtml = '<div class="post-desc" style="margin: 0.2rem 0; font-size:0.85rem;"><i>' + item.relevance + '</i></div>';
    }

    return       '<article class="post-block" style="margin-bottom: 1rem;">\n' +
      '  <div class="post-inner">\n' +
      '    <div class="post-title">' + item.title + '</div>\n' +
      tagsHtml +
      '    <div class="post-desc">' + item.desc + '</div>\n' +
      metaHtml +
      relevanceHtml +
      '  </div>\n' +
      '</article>\n';
  }

  function stars(n) {
    var s = "";
    for (var i = 0; i < 5; i++) {
      s += i < n ? "★" : "☆";
    }
    return s;
  }
})();
