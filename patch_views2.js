const fs = require('fs');

let code = fs.readFileSync('app/src/components/views.js', 'utf8');

// 1. Fix ICF details.open
code = code.replace(
  /details\.open = false; \/\/ Collapsed by default for visual reduction/,
  'details.open = true;'
);

// 2. Fix innerHTML in renderHypothesen
const oldHypTitle = `    // Titel = Aussage
    const title = document.createElement('h3');
    title.className = 'hypothesis-title';
    const titlePrefix = block.id ? \`\${block.id} – \${block.heading}\` : block.heading;
    const aussageText = block.aussage.length > 0 ? block.aussage.join(' ') : 'Aussage noch unklar';
    title.innerHTML = \`<span class="meta">\${titlePrefix}</span><br>\${aussageText}\`;
    card.appendChild(title);`;

const newHypTitle = `    // Titel = Aussage
    const title = document.createElement('h3');
    title.className = 'hypothesis-title';

    const metaSpan = document.createElement('span');
    metaSpan.className = 'meta';
    metaSpan.textContent = block.id ? \`\${block.id} – \${block.heading}\` : block.heading;
    title.appendChild(metaSpan);

    title.appendChild(document.createElement('br'));

    const aussageSpan = document.createElement('span');
    if (block.aussage.length > 0) {
      renderInlineText(aussageSpan, block.aussage.join(' '));
    } else {
      aussageSpan.textContent = 'Aussage noch unklar';
    }
    title.appendChild(aussageSpan);

    card.appendChild(title);`;

code = code.replace(oldHypTitle, newHypTitle);

const oldHypBadge = `      const valText = bd.values.length > 0 ? bd.values.join(', ') : 'unklar';
      const badge = document.createElement('span');
      badge.className = 'badge';
      badge.innerHTML = \`<span class="badge-label">\${bd.label}:</span> \${valText}\`;
      badgesRow.appendChild(badge);`;

const newHypBadge = `      const valText = bd.values.length > 0 ? bd.values.join(', ') : 'unklar';
      const badge = document.createElement('span');
      badge.className = 'badge';

      const labelSpan = document.createElement('span');
      labelSpan.className = 'badge-label';
      labelSpan.textContent = bd.label + ':';
      badge.appendChild(labelSpan);

      badge.appendChild(document.createTextNode(' ' + valText));
      badgesRow.appendChild(badge);`;

code = code.replace(oldHypBadge, newHypBadge);

fs.writeFileSync('app/src/components/views.js', code, 'utf8');
