---

author: Federico Bruzzone
title: Make Vim as your C/C++ IDE 
date: 2023-04-26
draft: false
tags: [programming, vim, computer-science, editor, IDE]
categories: [programming, vim, editor]

summary: "In this blog post you will find a 'simple' guide to configure Vim as your C/C++ IDE. This procedure can be similar for VSCode and Fleet editor." 
mathjax: true

---

<!--
# Make Vim as your C/C++ IDE

## A summary of GoF Design Patters
-->

**This procedure can be similar for VSCode and Fleet editor.**

It happened to me in the past that I had to configure *Vim* to manage C projects, and after lots of useless attempts I gave up settings it up.


I am currently attending a university course called Advanced in Operating Systems. I am using a STM32 microcontroller and ST provides an Eclipse 2010 based IDE, but as a *Vim* programmer writing even 10 lines of code on this IDE made me frustrated. So, I decided to try again, and as you can imagine if you are reading this blog post I succeeded!


## Requirements

1. Make sure use Vim >= 8.1.1719 or Neovim >= 0.4.0 and make

2. Install nodejs >= 14.14:

`curl -sL install-node.vercel.app/lts | bash
`

## Configuration

### coc 

[coc GitHub](https://github.com/neoclide/coc.nvim)

Firstly, you should have a [`coc.nvim`](https://github.com/neoclide/coc.nvim) plug-in installed. I am currently using **vim-plug** as plug-ins manager, but you can use any other.

In my case I added to my `.vimrc` file 

```Vim
Plug 'https://github.com/neoclide/coc.nvim'
```

and run `:PlugInstall`

After that restart **Vim**and make sure you have installed two important extension which are `coc-json` and `coc-tsserver` using `:CocList extensions`, if not run `:CocInstall coc-json coc-tsserver`

### coc-clangd

[coc-clangd GitHub](https://github.com/clangd/coc-clangd)

As you can imagine, [`coc-clangd`](https://github.com/clangd/coc-clangd) is an extension of `coc.nvim` like the previous two, and you can install it just running `:CocInstall coc-clangd`, after that `coc-clangd` will try to find `clangd` from your `$PATH`, if not found, you can run `:CocCommand clangd.install` to install the latest release from GitHub.

At this point, you should be able to add to create `~/.vim/coc-settings.json` file and add        

```json
{
  "languageserver": {
    "ccls": {
      "command": "ccls",
      "args": ["--log-file=/tmp/ccls.log", "-v=1"],
      "filetypes": ["c", "cc", "cpp", "c++", "objc", "objcpp"],
      "rootPatterns": [".ccls", "compile_commands.json"],
      "initializationOptions": { 
         "cache": {
           "directory": "/tmp/ccls"
         },
         "client": {
          "snippetSupport": true
         }
       }
    }
  },
  "clangd.path": "~/.config/coc/extensions/coc-clangd-data/install/15.0.6/clangd_15.0.6/bin/clangd",
}
```

Obviusly, you should change the value of "clangd.path" field with your version, it may be something like `"clangd.path": "~/.config/coc/extensions/coc-clangd-data/install/<version>/clangd_<version>/bin/clangd"` (note \<version\> on the string).

I do not want to bore you eplaining whole fileds of the json file, the only thing I would like to say you is that that code is used to specify the type of language server and its behaviour.

### ccls

[ccls GitHub](https://github.com/MaskRay/ccls)

Basically, `ccls`, which originates from `cquery`, is a C/C++/Objective-C language server.

- code completition (with both signature help and snippets)

- definition/reference, and other cross references

- diagnostics and code actions

- semantic highlighting and preprocessor skipped regions
- diagnostics and code actions

- semantic highlighting and preprocessor skipped regions

and the other many usefull things.

You must install it because as you can see the language server specified in `coc-settings.json` is `ccls`.

You can do it using your package manager, in my case

```Bash
sudo apt-get install ccls
```

**Setup**

Typically, `ccls` indexes an entire project. In order for this to work properly, `ccls` needs to be able to obtain the source file list and their compilation command lines.

**How `ccls` obtains sources and compilation commands**

There are two main ways this happens:

1. Provide `compile_commands.json` at the project root
2. Provide a .ccls file.

If neither exists, then when `ccls` starts it will not index anything: instead it will wait for LSP clients to open files and index only those files.

I prefer use the first one, and to do that if you are using `Makefile` as build system for your C/C++ project you can generate `compile_commands.json` automatically with [bear](https://github.com/rizsotto/Bear) command, I will explain in detail how in the next paragraph.

If you are not using `Makefile` as build system, there are lots of ways to generate this file, for example with `CMake`, `compiledb`, `scan-build` and so on. I suggest you to take a look [here](https://github.com/MaskRay/ccls/wiki/Project-Setup).

### bear

[bear GitHub](https://github.com/rizsotto/Bear)



Bear is a tool that generates a compilation database for clang tooling. The compilation database is our `compile_commands.json`, a simple json file.

The JSON compilation database is used in the clang project to provide information on how a single compilation unit is processed. With this, it is easy to re-run the compilation with alternate programs.


