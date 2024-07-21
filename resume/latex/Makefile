.PHONY: all clean clean_pdf run_interactive

# default: all

NAME = resume

help:
	@echo "Please use \`make <target>' where <target> is one of"
	@echo "  all              to make all pdf files"
	@echo "  clean            to delete all generated files"
	@echo "  clean_pdf        to delete the pdf file"
	@echo "  clean_all        to delete all generated files and the pdf file"
	@echo "  run_interactive  to run latexmk in interactive mode"

all:
	pdflatex -shell-escape -interaction=nonstopmode -file-line-error ./$(NAME).tex
	# bibtex $(NAME)
	pdflatex -shell-escape -interaction=nonstopmode -file-line-error ./$(NAME).tex
	pdflatex -shell-escape -interaction=nonstopmode -file-line-error ./$(NAME).tex

clean_all: clean clean_pdf

clean:
	rm -rf *.aux *.bbl *.blg *.log *.out *.spl *.synctex.gz *.toc *.bcf *.run.xml *.nav *.snm *.vrb *.fdb_latexmk *.fls .$(NAME)-cache

clean_pdf:
	rm -f $(NAME).pdf

run_interactive:
	latexmk -pvc -pdf -shell-escape -interaction=nonstopmode -file-line-error ./$(NAME).tex


