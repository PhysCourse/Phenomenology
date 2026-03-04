window.MathJax = {
  loader: {load: ['[tex]/cancel','[tex]/physics','[tex]/color','[tex]/action']},
  tex: {
    inlineMath: [["\\(", "\\)"]],
    displayMath: [["\\[", "\\]"]],
    packages: {'[+]': ['cancel','physics','color','action']},
    
    tags: 'ams',
    tagSide: 'right',
    useLabelIds: true,
    processEscapes: true,
    processEnvironments: true,
    macros: {
      slashed: ["{#1 \\!\\!\\!/}",1],
      cslashed: ["{#1 \\!\\!\\!\\!/}",1],
      lslashed: ["{#1 \\!\\!/}",1],
    }

  },
  options: {
    ignoreHtmlClass: ".*|",
    processHtmlClass: "arithmatex|md-ellipsis|innermath" // md-ellipsis - to enable mathjax in toc
  }
};

let isRendering = false;

document$.subscribe(() => { 
  console.log('Checking for new formulas to render...');
  if (isRendering || !window.MathJax?.typesetPromise) return;
  
  MathJax.startup.output.clearCache();
  const hasNewFormulas = document.querySelector('.arithmatex:not(.MathJax-processed)');
  
  if (hasNewFormulas) {
    isRendering = true;
    MathJax.typesetPromise()
      .then(() => {
        isRendering = false;
      })
      .catch(err => {
        console.log('MathJax error:', err);
        isRendering = false;
      });
  }
})

/* kludge (костыль) to work mathjax with data-preview */

let rendering_mathjax = false;
new MutationObserver((mutations) => {
  if (rendering_mathjax || !window.MathJax?.typesetPromise) return;
  
  for (let mutation of mutations) {
    for (let node of mutation.addedNodes) {

      // query selector for .arithmatex  + md-search-result__article
      if (node.nodeType === 1 && node.querySelector?.('.arithmatex')) {
        console.log(node)
        rendering_mathjax = true;
        MathJax.typesetPromise().finally(() => rendering_mathjax = false);
        return;
      }
    }
  }
}).observe(document.body, {childList: true, subtree: true});
