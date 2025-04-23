import './style.css'

document.querySelector<HTMLButtonElement>('#parse-button')!.addEventListener('click', () => {
  const input = document.querySelector<HTMLTextAreaElement>('#wkt-input')!.value;
  const resultView = document.querySelector<HTMLDivElement>('#result-view')!;

  try {
    const prettyPrinted = prettyPrintWKT(input);
    resultView.innerHTML = prettyPrinted;
  } catch (error) {
    resultView.innerHTML = `<p style='color: red;'>Invalid WKT format</p>`;
  }
});

function addCollapseExpandFeature() {
  const resultView = document.querySelector<HTMLDivElement>('#result-view')!;

  resultView.addEventListener('click', (event) => {
    const target = event.target as HTMLElement;

    if (target.classList.contains('collapsible')) {
      const content = target.nextElementSibling as HTMLElement;
      if (content.style.display === 'none') {
        content.style.display = 'block';
        target.textContent = '▼';
      } else {
        content.style.display = 'none';
        target.textContent = '▶';
      }
    }
  });
}

function prettyPrintWKT(wkt: string): string {
  let result = '';
  let level = 0;

  for (let i = 0; i < wkt.length; i++) {
    const char = wkt[i];
    if (char === '[') {
      level++;
      result += `<span class='collapsible'>▼</span>[<div style='margin-left: ${level * 4}px;'>`;
    } else if (char === ']') {
      level--;
      result += `</div>]`;
    } else {
      result += char;
    }
  }

  return `<pre>${result}</pre>`;
}

addCollapseExpandFeature();
