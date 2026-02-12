import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'
import 'bootstrap-icons/font/bootstrap-icons.css'
import './style.css'

document.querySelector<HTMLButtonElement>('#parse-button')!.addEventListener('click', () => {
  const input = document.querySelector<HTMLTextAreaElement>('#wkt-input')!.value;
  const resultView = document.querySelector<HTMLDivElement>('#result-view')!;

  // Clear previous results and show the result view
  resultView.classList.remove('d-none');
  
  if (!input.trim()) {
    resultView.innerHTML = `
      <div class="alert alert-warning" role="alert">
        <i class="bi bi-exclamation-triangle-fill"></i>
        Please enter some WKT text to parse.
      </div>
    `;
    return;
  }

  try {
    const prettyPrinted = prettyPrintWKT(input);
    resultView.innerHTML = `
      <div class="alert alert-success" role="alert">
        <i class="bi bi-check-circle-fill"></i>
        WKT parsed successfully!
      </div>
      <div class="bg-white p-3 border rounded">
        ${prettyPrinted}
      </div>
    `;
    addCollapseExpandFeature();
  } catch (error) {
    resultView.innerHTML = `
      <div class="alert alert-danger" role="alert">
        <i class="bi bi-x-circle-fill"></i>
        <strong>Invalid WKT format:</strong> Please check your input and try again.
      </div>
    `;
  }
});

function addCollapseExpandFeature() {
  const resultView = document.querySelector<HTMLDivElement>('#result-view')!;

  // Remove any existing listeners by cloning the element (removes all event listeners)
  const newResultView = resultView.cloneNode(true) as HTMLDivElement;
  resultView.parentNode?.replaceChild(newResultView, resultView);

  // Add event delegation for collapse/expand functionality
  newResultView.addEventListener('click', (event) => {
    const target = event.target as HTMLElement;
    const button = target.closest('.collapsible') as HTMLButtonElement | null;

    if (button) {
      const content = button.nextElementSibling as HTMLElement;
      if (content && content.classList.contains('collapsible-content')) {
        if (content.style.display === 'none' || content.style.display === '') {
          content.style.display = 'block';
          button.innerHTML = '<i class="bi bi-chevron-down"></i>';
          button.classList.remove('btn-outline-secondary');
          button.classList.add('btn-outline-primary');
        } else {
          content.style.display = 'none';
          button.innerHTML = '<i class="bi bi-chevron-right"></i>';
          button.classList.remove('btn-outline-primary');
          button.classList.add('btn-outline-secondary');
        }
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
      result += `<button class='collapsible btn btn-sm btn-outline-primary me-1 mb-1' type='button'><i class="bi bi-chevron-down"></i></button>[<div class='collapsible-content ms-3 mt-1' style='display: block;'>`;
    } else if (char === ']') {
      level--;
      result += `</div>]`;
    } else {
      result += char;
    }
  }

  return `<pre class="mb-0 font-monospace">${result}</pre>`;
}
