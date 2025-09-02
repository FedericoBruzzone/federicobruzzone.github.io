# My Personal Website

## Working locally

Start http server:
```bash
python3 -m http.server
```

Convert markdown to htlm:
```bash
pandoc -s -f markdown -t html5 -o test.html test.md --mathjax
# or
pandoc -s -f markdown -t html5 -o test.html test.md --mathml
```

Convert markdown to html (with syntax highlighting):
```bash
pandoc -s -f markdown -t html5 --highlight-style=pygments -o test.html test.md
```

