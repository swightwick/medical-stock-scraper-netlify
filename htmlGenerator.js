// htmlGenerator.js
function updateHtml(availableFlowers, lastScrapeTimestamp) {
  const productAmount = availableFlowers.length;
  const dataHtml = availableFlowers
    .map(
      (item) => `<li>
        <span class="flower">${item.item.flower}</span>
        <span class="price">${item.item.cost}</span>
      </li>`
    )
    .join('');

  return `
    <head>
      <meta charset="utf-8">
      <title>Stock</title>
      <link rel="stylesheet" type="text/css" href="/styles/main.css">
      <style>
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@200;300;500&display=swap');
      </style>
    </head>
    <body>
      <header>
        <h1>${productAmount} products available</h1>
        <span>Updated ${lastScrapeTimestamp}</span>
      </header>
      <ul>
        ${dataHtml}
      </ul>
    </body>
  </html>`;
}

module.exports = updateHtml;
