---

author: Federico Bruzzone
title: Make Vim as your C/C++ IDE 
date: 2023-04-26
draft: false
tags: [programming, vim, computer-science, editor, IDE]
categories: [programming, vim, editor]

summary: "In this blog post you will find a simple guide to configure Vim as your C/C++ IDE. This procedure can be very similar for VSCode and Fleet editors." 
mathjax: true

weight: 1

---

<!--
# Make Vim as your C/C++ IDE

## A summary of GoF Design Patters
-->

> This procedure can be very similar for `VSCode` and `Fleet` editors. In this case, you should only create the `compile_commands.json` file, and this procedure is illustrated in the [`bear`](#bear) subsection, but I suggest you read the whole post.

It happened to me in the past that I had to configure *Vim* to manage C projects with some external library, and after lots of useless attempts, I gave up setting it up.

I am currently attending a university course called Advanced in Operating Systems. I am using a STM32 microcontroller and ST provides an "Eclipse 2010 based" IDE with lots of proprietary libraries, but as a *Vim* programmer writing even 10 lines of code on this IDE made me frustrated. So, I decided to try again, and as you can imagine if you are reading this blog post, I succeeded!

## Requirements

1. Make sure use Vim >= 8.1.1719 or Neovim >= 0.4.0 and make

2. Install nodejs >= 14.14:

`curl -sL install-node.vercel.app/lts | bash
`

## Configuration

### coc 

[coc GitHub](https://github.com/neoclide/coc.nvim)

Firstly, you should have a [`coc.nvim`](https://github.com/neoclide/coc.nvim) plug-in installed. I am currently using **vim-plug** as plug-in manager, but you can use any other.

In my case, I added it to my `.vimrc` file 

```Vim
Plug 'https://github.com/neoclide/coc.nvim'
```

and run `:PlugInstall`

After that restart **Vim**and make sure you have installed two important extensions, which are `coc-json` and `coc-tsserver` using `:CocList extensions`, if not run `:CocInstall coc-json coc-tsserver`

### coc-clangd

[coc-clangd GitHub](https://github.com/clangd/coc-clangd)

As you can imagine, [`coc-clangd`](https://github.com/clangd/coc-clangd) is an extension of `coc.nvim` like the previous two, and you can install it just by running `:CocInstall coc-clangd`, after that `coc-clangd` will try to find `clangd` from your `$PATH`, if not found, you can run `:CocCommand clangd.install` to install the latest release from GitHub.

At this point, you should be able to create `~/.vim/coc-settings.json` file and add the code below to it

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

Obviusly, you should change the value of the "clangd.path" field with your version, it may be something like `"clangd.path": "~/.config/coc/extensions/coc-clangd-data/install/<version>/clangd_<version>/bin/clangd"` (note \<version\> on the string).

I do not want to bore you by explaining whole fields of the json file, the only thing I would like to say to you is that this code is used to specify the type of language server (`ccls` in this case) and its behavior.

### ccls

[ccls GitHub](https://github.com/MaskRay/ccls)

Basically, [`ccls`](https://github.com/MaskRay/ccls), which originates from `cquery`, is a C/C++/Objective-C language server.

It provides:

- code completition (with both signature help and snippets)

- definition/reference, and other cross references

- diagnostics and code actions

- semantic highlighting and preprocessor skipped regions
- diagnostics and code actions

- semantic highlighting and preprocessor skipped regions

and the other many usefull things.

You must install it because, as you can see in the `coc-settings.json`, the language server specified is `ccls`.

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


[Bear](https://github.com/rizsotto/Bear) is a tool that generates a compilation database for clang tooling. The compilation database is our `compile_commands.json`, a simple json file.

The JSON compilation database is used in the clang project to provide information on how a single compilation unit is processed. With this, it is easy to re-run the compilation with alternate programs.

Some build system natively supports the generation of JSON compilation database. For projects which does not use such build tool, Bear generates the JSON file during the build process.

You can install it using your package manager, in my case

```Bash
sudo apt-get install bear
```

## Use case

Consider this simple C project, but it can be extended to much larger projects.

I assure you that it works exactly as in the case I am going to illustrate now, the only important thing is to write your makefile correctly, but this is also obvious because otherwise your project would not compile. :D

```bash
.
├── inc/
│   └── main.h
├── src/
│   └── main.c
└── Makefile
```

```C
// main.h

#define TEST "test"
```

```C
// main.c

#include "main.h"
#include <stdio.h>

int main() {
    int *ptrarray[4];
    int w = 100, x = 200, y = 300, z = 400;

    ptrarray[0] = &w;
    ptrarray[1] = &x;
    ptrarray[2] = &y;
    ptrarray[3] = &z;

    for (int i = 0; i< 4; i++) {
         printf("The value %d has the adddress %d\n", *ptrarray[i], ptrarray[i]);
    }

    printf("I am printing a variable of main.h file %d", &TEST);
    
    return 0;
}
```

It is a silly file that prints the values and memory area of the elements of an array.


```Make
CC = gcc
CFLAGS = -Wall

INC_DIR = inc
SRC_DIR = src

SRC_FILES = $(wildcard $(SRC_DIR)/*.c)
INC_FILES = $(wildcard $(INC_DIR)/*.h)

main: $(SRC_FILES) $(INC_FILES)
	$(CC) $(CFLAGS) $(SRC_FILES) -o main -I$(INC_DIR)
```

But, the main problem is that *Vim*, specially `ccls` and `coc` tells me that I have an error in line 1 of the `main.c`, and as you can imagine, the error is `main.h file not found`, and this problem is difficult to manage manually, also having external libraries .  

This problem is also blocking all the LSP features, for example go-to-definition, go-to-implementation etc...

To solve this problem, we just have to run the  

```bash 
bear -- make
``` 
command, and it will generate the `compile_commands.json` and there will be no more errors.

```bash
.
├── inc/
│   └── main.h
├── src/
│   └── main.c
├── compile_commands.json
├── main*
└── Makefile
```

and `compile_commands.json` will something like this

```json
[
  {
    "arguments": [
      "/usr/bin/gcc",
      "-c",
      "-Wall",
      "-Iinc",
      "-o",
      "main",
      "src/main.c"
    ],
    "directory": "/home/c_project",
    "file": "/home/c_project/src/main.c",
    "output": "/home/c_project/main"
  }
]
```

For bigger projects, so for example the one I am currently working on for the Advanced in OS course that uses a lot of external libraries, this file can reach even 600 lines.
