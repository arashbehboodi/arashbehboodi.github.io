# arashbehboodi.github.io

Personal site and blog built with Jekyll.

## Structure

- `index.html`: homepage
- `bio.html`: biography page
- `publication.html`: publications page
- `blog/index.md`: blog archive
- `_layouts/`: shared page and post layouts
- `_posts/`: blog posts
- `src/`: local images and PDFs

## Local development

Build the site:

```bash
jekyll build
```

Serve the site locally:

```bash
jekyll serve
```

If Jekyll is installed outside your shell `PATH`, run the executable directly and set `GEM_HOME` and `GEM_PATH` accordingly.

## Math in posts

Kramdown uses `$$x$$` for inline math. For a displayed equation, put `$$` on separate lines around the equation, with blank lines before and after the block. Use `\mid` for conditional bars in inline math so Kramdown does not mistake them for a table. MathJax renders the equations in the browser.

Post contents are generated from level-two and level-three headings. To show references beside their first citation on desktop, end the post with a `## References` heading followed by a numbered list, and give each entry an anchor such as `<a id="ref-1"></a>`. Link to that anchor from the text. The full list remains at the end of the post on all screen sizes.
