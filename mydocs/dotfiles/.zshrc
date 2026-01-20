autoload -Uz compinit && compinit
autoload -Uz vcs_info

precmd_vcs_info() { vcs_info }
precmd_functions+=( precmd_vcs_info )
setopt prompt_subst
RPROMPT='${vcs_info_msg_0_}'
# # PROMPT='${vcs_info_msg_0_}%# '
# zstyle ':vcs_info:git:*' formats '%b'

zstyle ':vcs_info:git*:*' check-for-changes true
zstyle ':vcs_info:git*:*' unstagedstr '|U'
zstyle ':vcs_info:git*:*' stagedstr '|≠'

# enable hooks, requires Zsh >=4.3.11
if [[ $ZSH_VERSION == 4.3.<11->* || $ZSH_VERSION == 4.<4->* || $ZSH_VERSION == <5->* ]] ; then
  # hook for untracked files
  +vi-untracked() {
    if [[ $(git rev-parse --is-inside-work-tree 2>/dev/null) == 'true'  ]] && \
       [[ -n $(git ls-files --others --exclude-standard) ]] ; then
       hook_com[staged]+='|☂'
    fi
  }

  # unpushed commits
  +vi-outgoing() {
    local gitdir="$(git rev-parse --git-dir 2>/dev/null)"
    [ -n "$gitdir" ] || return 0

    if [ -r "${gitdir}/refs/remotes/git-svn" ] ; then
      local count=$(git rev-list remotes/git-svn.. 2>/dev/null | wc -l)
    else
      local branch="$(cat ${gitdir}/HEAD 2>/dev/null)"
      branch=${branch##*/heads/}
      local count=$(git rev-list remotes/origin/${branch}.. 2>/dev/null | wc -l | tr -d ' ')
    fi

    if [[ "$count" -gt 0 ]] ; then
      hook_com[staged]+="|↑$count"
    fi
  }

  # hook for stashed files
  +vi-stashed() {
    if git rev-parse --verify refs/stash &>/dev/null ; then
      hook_com[staged]+='|s'
    fi
  }

  zstyle ':vcs_info:git*+set-message:*' hooks stashed untracked outgoing
fi

# extend default vcs_info in prompt
zstyle ':vcs_info:*' actionformats "(%s)-[%b|%a%u%c] " "zsh: %r"
zstyle ':vcs_info:*' formats       "(%s)-[%b%u%c]%} " "zsh: %r"

# Prompt
PS1="%n@%m:%~$ "
PS2="%_> "#

# zsh completition
# Check if macOS x86_64
if [[ "$OSTYPE" == "darwin"* ]]; then
    if [[ "$(uname -m)" == "arm64" ]]; then
        source /opt/homebrew/share/zsh-autosuggestions/zsh-autosuggestions.zsh
    else
        source /usr/local/share/zsh-autosuggestions/zsh-autosuggestions.zsh
    fi
fi

# zsh history
HISTFILE=~/.zsh_history
HISTSIZE=999999999
SAVEHIST=$HISTSIZE
export EDITOR=nvim

# Homebrew configuration {
    export PATH="/usr/local/sbin:$PATH"
# }

# Svn configuration {
 export SVN_EDITOR=nvim
# }

# rust configuration {
 . "$HOME/.cargo/env"
# }

# python3.13 configuration {
 # export PATH="/usr/local/opt/python/libexec/bin:$PATH"
 # export PATH="/usr/local/Cellar/python@3.13/3.13.9/libexec/bin:$PATH"
 export PATH="/usr/local/Cellar/python@3.11/3.11.14_1/libexec/bin:$PATH"
# }


# openjdk21 configuration {
 # macOS Intel {
  # If you need to have openjdk@21 first in your PATH, run:
  # export PATH="/usr/local/opt/openjdk@21/bin:$PATH"
  # It could be an alternative to exporting JAVA_HOME
  #
  # For compilers to find openjdk@21 you may need to set:
  # export CPPFLAGS="-I/usr/local/opt/openjdk@21/include"

  # On macOS, you can set the JAVA_HOME environment variable to point to the JDK installation only after the following command:
  #
  # For the system Java wrappers to find this JDK, symlink it with
  # ```
  # sudo ln -sfn /usr/local/opt/openjdk@21/libexec/openjdk.jdk /Library/Java/JavaVirtualMachines/openjdk-21.jdk
  # ```
  # It allows `/usr/libexec/java_home -v 21` to find the JDK
 # }
 # macOS Silicon {
  # For the system Java wrappers to find this JDK, symlink it with
  #   sudo ln -sfn /opt/homebrew/opt/openjdk@21/libexec/openjdk.jdk /Library/Java/JavaVirtualMachines/openjdk-21.jdk
  #
  # openjdk@21 is keg-only, which means it was not symlinked into /opt/homebrew,
  # because this is an alternate version of another formula.
  #
  # If you need to have openjdk@21 first in your PATH, run:
  #   echo 'export PATH="/opt/homebrew/opt/openjdk@21/bin:$PATH"' >> ~/.zshrc
  #
  # For compilers to find openjdk@21 you may need to set:
  #   export CPPFLAGS="-I/opt/homebrew/opt/openjdk@21/include"
 # }
 export JAVA_HOME=$(/usr/libexec/java_home -v 21)
# }

# latex configuration {
 # export PATH=$PATH:/usr/local/texlive/2025/bin/universal-darwin
 export BIBINPUTS=$HOME/texmf/tex/latex/adapt-lab/trunk/bibs:.

 l4p() {  # it assumes to have $BIBINPUTS set and with the dir to look into as the first one
   BIB_DIR=${BIBINPUTS%%:*}
   grep -rin"$2" -ie "$1" "$BIB_DIR"/*.bib
 }
# }

# opam configuration {
# This is useful if you're using opam as it adds:
#   - the correct directories to the PATH
#   - auto-completion for the opam binary
# This section can be safely removed at any time if needed.
[[ ! -r '/Users/federicobruzzone/.opam/opam-init/init.zsh' ]] || source '/Users/federicobruzzone/.opam/opam-init/init.zsh' > /dev/null 2> /dev/null
# }

# perl configuration { 
if [[ "$OSTYPE" == "darwin"* ]]; then
 if [[ "$(uname -m)" == "arm64" ]]; then
  # By default non-brewed cpan modules are installed to the Cellar. If you wish
  # for your modules to persist across updates we recommend using `local::lib`.

  # You can set that up like this:
  # PERL_MM_OPT="INSTALL_BASE=$HOME/perl5" cpan local::lib

  # And add the following to your shell profile e.g. ~/.profile or ~/.zshrc
  eval "$(perl -I$HOME/perl5/lib/perl5 -Mlocal::lib=$HOME/perl5)"
 else
  # Do not use system perl (/usr/local/bin/perl), use the one installed via brew
  export PATH=/usr/local/opt/perl/bin:$PATH
  eval "$(perl -I$HOME/perl5/lib/perl5 -Mlocal::lib=$HOME/perl5)"
 fi
fi
# }

# # llvm@16 configuration {
#  # To use the bundled libc++ please add the following LDFLAGS:
#  export LDFLAGS="-L/usr/local/opt/llvm@16/lib/c++ -Wl,-rpath,/usr/local/opt/llvm@16/lib/c++"
#
#  # If you need to have llvm@16 first in your PATH, run:
#  export PATH="/usr/local/opt/llvm@16/bin $PATH"
#
#  # For compilers to find llvm@16 you may need to set:
#  export LDFLAGS="-L/usr/local/opt/llvm@16/lib:$LDFLAGS"
#  export CPPFLAGS="-I/usr/local/opt/llvm@16/include"
# # }

# # llvm@18 configuration {
#  # To use the bundled libc++ please add the following LDFLAGS:
#  export LDFLAGS="-L/usr/local/opt/llvm@18/lib/c++ -L/usr/local/opt/llvm@18/lib -lunwind"
# 
#  # If you need to have llvm@18 first in your PATH, run:
#  export PATH="/usr/local/opt/llvm@18/bin:$PATH"
# 
#  # For compilers to find llvm@18 you may need to set:
#  export LDFLAGS="-L/usr/local/opt/llvm@18/lib $LDFLAGS"
#  export CPPFLAGS="-I/usr/local/opt/llvm@18/include"
# # }

# llvm@20 configuration {
if [[ "$OSTYPE" == "darwin"* ]]; then
 if [[ "$(uname -m)" == "arm64" ]]; then
  # Using `clang`, `clang++`, etc., requires a CLT installation at `/Library/Developer/CommandLineTools`.
  # If you don't want to install the CLT, you can write appropriate configuration files pointing to your
  # SDK at ~/.config/clang.
  #
  # To use the bundled libunwind please use the following LDFLAGS:
  #   LDFLAGS="-L/opt/homebrew/opt/llvm@20/lib/unwind -lunwind"
  #
  # To use the bundled libc++ please use the following LDFLAGS:
  #   LDFLAGS="-L/opt/homebrew/opt/llvm@20/lib/c++ -L/opt/homebrew/opt/llvm@20/lib/unwind -lunwind"
  #
  # NOTE: You probably want to use the libunwind and libc++ provided by macOS unless you know what you're doing.
  #
  # llvm@20 is keg-only, which means it was not symlinked into /opt/homebrew,
  # because this is an alternate version of another formula.
  #
  # If you need to have llvm@20 first in your PATH, run:
  #   echo 'export PATH="/opt/homebrew/opt/llvm@20/bin:$PATH"' >> ~/.zshrc
  #
  # For compilers to find llvm@20 you may need to set:
  #   export LDFLAGS="-L/opt/homebrew/opt/llvm@20/lib"
  #   export CPPFLAGS="-I/opt/homebrew/opt/llvm@20/include"
  #
  # For cmake to find llvm@20 you may need to set:
  #   export CMAKE_PREFIX_PATH="/opt/homebrew/opt/llvm@20"
  export PATH="/opt/homebrew/opt/llvm@20/bin:$PATH"
  export LDFLAGS="-L/opt/homebrew/opt/llvm@20/lib/unwind -lunwind"
  export LDFLAGS="-L/opt/homebrew/opt/llvm@20/libc++ -L/opt/homebrew/opt/llvm@20/lib $LDFLAGS"
  export CPPFLAGS="-I/opt/homebrew/opt/llvm@20/include"
 else
  export PATH="/usr/local/opt/llvm@20/bin:$PATH"
  export LDFLAGS="-L/usr/local/opt/llvm@20/lib/unwind -lunwind"
  export LDFLAGS="-L/usr/local/opt/llvm@20/lib/c++ -L/usr/local/opt/llvm@20/lib $LDFLAGS"
  export CPPFLAGS="-I/usr/local/opt/llvm@20/include"
 fi
fi
# }

# koka configuration {
 export PATH=$PATH:$HOME/.local/bin
# }

# yazi configuration {
function y() {
	local tmp="$(mktemp -t "yazi-cwd.XXXXXX")" cwd
	yazi "$@" --cwd-file="$tmp"
	IFS= read -r -d '' cwd < "$tmp"
	[ -n "$cwd" ] && [ "$cwd" != "$PWD" ] && builtin cd -- "$cwd"
	rm -f -- "$tmp"
}
# }

# local tgt configuration
export LOCAL_TDLIB_PATH=$HOME/tdlib

# tdlib-rs configuration (for test purposes)
export API_ID="94575"
export API_HASH="a3406de8d171bb422bb6ddf3bbd800e2"

# Gemini
export GEMINI_API_KEY="AIzaSyA3Q1Cpp9l9aHC-ul2DobK5yhlSaM3Sb9Y"

autoload -Uz colors && colors
export CLICOLOR=1
export GREP_OPTIONS='--color=always'

alias ll='ls -alF'
alias la='ls -A'
alias ..='cd ..'

# Function to convert SVG to PDF using rsvg-convert
svg-convert () {
  # Check if a filename was provided
  if [ -z "$1" ]; then
    echo "Error: You must specify an SVG input file."
    echo "Usage: svg-convert input_file.svg"
    return 1
  fi
  
  # Extracts the base name of the file (e.g., "my_drawing" from "my_drawing.svg")
  BASE_NAME=$(basename "$1" .svg)
  
  # Execute the conversion
  # "$1" is the input file (e.g., my_drawing.svg)
  # "${BASE_NAME}.pdf" is the output file (e.g., my_drawing.pdf)
  rsvg-convert -f pdf -o "${BASE_NAME}.pdf" "$1"
}
