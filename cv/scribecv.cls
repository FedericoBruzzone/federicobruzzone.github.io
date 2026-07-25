%%----------------------------------------------------------------------
%% scribecv.cls
%% A CV/resume document class matching the `scribe` identity.
%% author: Federico Bruzzone (19-07-2026) last update: (19-07-2026)
%%----------------------------------------------------------------------

\def\filename{scribecv}
\def\fileversion{v0.1.0 (author: Federico Bruzzone)}
\def\filedate{2026/07/19}

\NeedsTeXFormat{LaTeX2e}
\ProvidesPackage{\filename}[\filedate{} \fileversion]
\typeout{Class file \filename', \fileversion, <\filedate>}

% =====================================
% ========== Class options ============
% =====================================
\newif\if@scribesectionfill
\@scribesectionfillfalse
\newif\if@scribeheader
\@scribeheaderfalse

\DeclareOption{sectionfill}{\@scribesectionfilltrue}
\DeclareOption{header}{\@scribeheadertrue}
\DeclareOption*{\PassOptionsToClass{\CurrentOption}{article}}
\ProcessOptions\relax

% =====================================
% ========== Load base class ==========
% =====================================
\LoadClass[
	10pt,
]{article}

% ==================================================
% ========== Custom packages and settings ==========
% ==================================================
\RequirePackage[top=0.75in,bottom=0.75in,left=0.75in,right=0.75in]{geometry}
\RequirePackage[greek,english]{babel}
\setlength{\parskip}{0pt}
\setlength{\parindent}{0pt}
\linespread{1.0}

% ===========================
% ========== Fonts ==========
% ===========================
\RequirePackage[T1]{fontenc}
\RequirePackage[utf8]{inputenc}
\RequirePackage{libertine}
\RequirePackage{inconsolata}

% ============================
% ========== Colors ==========
% ============================
\RequirePackage[dvipsnames]{xcolor}

% ============================
% ========== Graphics ==========
% ============================
\RequirePackage{graphicx}

% ============================
% ========== Tables ==========
% ============================
\RequirePackage{tabularx}
\RequirePackage{array}

% ==============================
% ========== Lists =============
% ==============================
\RequirePackage[inline]{enumitem}
\setlist[itemize]{noitemsep, topsep=0pt}

% =================================
% ========== Callout boxes ========
% =================================
\RequirePackage[most]{tcolorbox}
\tcbuselibrary{breakable}
\tcbset{
	scribeboxbase/.style={
		arc=2mm,
		boxrule=0mm,
		leftrule=1mm,
		colback=white,
		colbacktitle=black!10!white,
		coltitle=black,
		fonttitle=\bfseries,
		left=0.5mm, lefttitle=0.5mm,
		right=0.5mm, righttitle=0.5mm,
		top=0.2mm, bottom=0.2mm,
		toptitle=0.3mm, bottomtitle=0.3mm,
	},
	scribebox/.style={scribeboxbase, title={#1}},
	scribeboxinline/.style={
		on line,
		arc=1.5mm,
		boxrule=0pt,
		leftrule=1mm,
		fontupper=\bfseries,
		boxsep=0pt,
		left=1.5mm, right=1.5mm,
		top=0.5mm, bottom=0.5mm,
	},
}
\newcommand{\scribedefinebox}[2]{%
	\newtcolorbox{#1box}[1]{breakable, colframe=#2, scribebox={##1}}%
	\expandafter\newtcbox\csname #1boxinline\endcsname{colframe=#2, scribeboxinline}%
}
\scribedefinebox{info}{MidnightBlue}
\scribedefinebox{warn}{BrickRed}
\scribedefinebox{tip}{ForestGreen}
\scribedefinebox{note}{BurntOrange}

% =====================================
% ========== Links / hyperref =========
% =====================================
% Pass hyperref options before any package loads it (orcidlink loads hyperref).
\PassOptionsToPackage{
	colorlinks=true,
	linkcolor=MidnightBlue,
	citecolor=MidnightBlue,
	urlcolor=MidnightBlue
}{hyperref}

% ===========================
% ========== ORCID ==========
% ===========================
\RequirePackage{orcidlink} % loads hyperref internally

% =====================================
% ========== Headers/footers ==========
% =====================================
\RequirePackage{fancyhdr}
\pagestyle{fancy}
\fancyhf{}
\fancyhead[L]{\leftmark}
\if@scribeheader
	\fancyhead[R]{\scriberightmark}
\fi
\fancyfoot[C]{\thepage}
\renewcommand{\headrulewidth}{0pt}

% ==============================
% ========== Icons =============
% ==============================
\RequirePackage{fontawesome5}

% ==============================
% ========== Bibliography ======
% ==============================
\RequirePackage[numbers,sort&compress]{natbib}
\RequirePackage{bibentry}
\setlength{\bibsep}{2pt}

% ===========================
% ========== Patches =========
% ===========================
\RequirePackage{etoolbox}

% ===========================
% ========== Commands ========
% ===========================

% --- Comments (toggleable, same as scribe.cls) ---
\newif\ifscribeshowcomments
\scribeshowcommentstrue

\newcommand{\scribedefinecomment}[2]{%
	\expandafter\newcommand\csname #1comment\endcsname[1]{%
		\ifscribeshowcomments%
			\textcolor{#2}{[\textbf{#1}] \textit{##1}}%
		\fi%
	}%
}

% --- Header mark ---
\newcommand{\scriberightmark}{}
\newcommand{\scribesetrightmark}[1]{%
	\renewcommand{\scriberightmark}{#1}%
}

% --- Divider ornament: ---------- ✦ ----------
\newcommand{\scribedivider}{%
	\par\medskip
	\noindent
	\makebox[\linewidth]{%
		\hspace{2em}%
		\makebox[0pt][l]{\rule[0.75ex]{\dimexpr0.5\linewidth - 3em}{0.5pt}}%
		\hfill\ding{71}\hfill
		\makebox[0pt][r]{\rule[0.75ex]{\dimexpr0.5\linewidth - 3em}{0.5pt}}%
		\hspace{2em}%
	}%
	\par\medskip
}

% --- Tool names (small caps) ---
\newcommand{\tool}[1]{\textsc{#1}}

% --- Colored dingbats ---
\RequirePackage{pifont}
\newcommand{\dingred}[1]{{\color{Red}\ding{#1}}}
\newcommand{\dinggreen}[1]{{\color{Green}\ding{#1}}}
\newcommand{\dingblue}[1]{{\color{Blue}\ding{#1}}}

% =======================================
% ========== CV-specific commands ========
% =======================================

% Name and subtitle (used by \maketitle)
\newcommand{\scribename}[1]{\def\@scribename{#1}}
\newcommand{\scribesubtitle}[1]{\def\@scribesubtitle{#1}}
\def\@scribename{}
\def\@scribesubtitle{Curriculum Vitae}

% Two-column info block
\newcommand{\scribeinfo}[2]{%
	\def\@scribeinfleft{#1}%
	\def\@scribeinfright{#2}%
}
\def\@scribeinfleft{}
\def\@scribeinfright{}

% Footer city
\newcommand{\scribefooter}[1]{\def\@scribefooter{#1}}
\def\@scribefooter{}

% --- Custom title ---
\renewcommand{\maketitle}{%
	\begin{center}
		{\LARGE\scshape\@scribename\quad\ding{71}\quad\@scribesubtitle\par}
	\end{center}
	\vskip4pt
	% Info block
	\ifx\@scribeinfleft\empty\else
		\noindent
		\begin{minipage}[t]{0.48\textwidth}
			\@scribeinfleft
		\end{minipage}%
		\hfill
		\begin{minipage}[t]{0.48\textwidth}
			\raggedleft
			\@scribeinfright
		\end{minipage}
		\vskip10pt
	\fi
	% \scribedivider
	\vskip2pt
}

% --- Section heading ---
\newsavebox{\scribesectionbox}
\newcommand{\scribesection}[1]{%
	\vspace{8pt}
	\if@scribesectionfill
		% Fill style: NOME ---- ✧ ---- (fills to end)
		\noindent
		{\large\scshape #1}\enspace
		\leaders\hbox{\hss\rule[0.75ex]{0.8em}{0.5pt}\hss}\hfill
		\enspace\ding{71}\enspace
		\leaders\hbox{\hss\rule[0.75ex]{0.8em}{0.5pt}\hss}\hfill
		\hspace{0pt}%
	\else
		% Default: --- ✧ --- NOME --- ✧ ---
		\noindent
		\leaders\hbox{\hss\rule[0.75ex]{0.6em}{0.5pt}\hss}\hfill
		\enspace\ding{71}\enspace
		\leaders\hbox{\hss\rule[0.75ex]{0.6em}{0.5pt}\hss}\hfill
		\enspace
		{\large\scshape\bfseries #1}%
		\enspace
		\leaders\hbox{\hss\rule[0.75ex]{0.6em}{0.5pt}\hss}\hfill
		\enspace\ding{71}\enspace
		\leaders\hbox{\hss\rule[0.75ex]{0.6em}{0.5pt}\hss}\hfill
		\hspace{0pt}%
	\fi
	\par\vspace{4pt}
}

% --- Entry: date on left, content on right ---
% \scribeentry{when}{what}{details}
\newcommand{\scribeentry}[3]{%
	\noindent
	\begin{tabularx}{\textwidth}{@{} >{\raggedleft\arraybackslash}p{2.8cm} @{\hspace{8pt}} X @{}}
		\textbf{#1} & #2%
		\ifblank{#3}{}{\\[1pt] & {\small\itshape #3}}%
	\end{tabularx}\par\vspace{2pt}
}

% --- Load bibliography data for inline citations ---
% Usage: \scribenobibliography{cv.bib} in preamble
\newcommand{\scribenobibliography}[1]{%
	\AtBeginDocument{\nobibliography{#1}}%
}

% =====================================
% ========== AtBeginDocument ==========
% =====================================
\AtBeginDocument{%
	\providecommand\BibTeX{{Bib\TeX}}%
}
