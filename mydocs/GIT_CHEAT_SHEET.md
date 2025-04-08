# GIT Cheat Sheet

**Sync a forked repository**

```bash
git checkout <branch>
git fetch upstream <branch> # or --all
git rebase upstream/<branch>
git push -u origin <branch>
```

**Create a new branch**

```bash
git branch <branch>
git checkout <branch>
git push -u origin <branch>
```

**Delete a branch**

```bash
git branch -d <branch> # or -D if you want to force delete
git push origin -d <branch>
```

**Different kind of DIFF**

```bash
git diff # diff between working directory and staging area (unstaged)
git diff --staged # diff between staging area and last commit (staged)
git diff <commit-hash> <commit-hash> # show changes between two commits
git diff <branch> <branch> # show changes between two branches
git diff HEAD HEAD~1 --name-only # show files changed between two commits
```

**Unstage a file**

```bash
git reset HEAD <file> # or `git restore --staged <file>`
```

**Revert file to a specific commit**

```bash
git checkout <commit-hash> -- <file>
```

**Move last commit to a new branch**

```bash
git branch <new-branch>
git reset --hard HEAD~1
git checkout <new-branch>
```

**Edit a commit (rebase)**

```bash
git rebase -i <commit-hash> # or HEAD~n
```

then you can switch the commit that you want to edit from `pick` to `edit`.

```bash
git add <file> # or --all
git commit --amend
git rebase --continue
git push -u origin <branch> --force
```

**Squash commits**

```bash
git rebase -i <commit-hash> # or HEAD~n
```

then you can switch the commit that you want to squash from `pick` to `squash`.

```bash
git rebase --continue
git push -u origin <branch> --force
```

**Reproduce a PR**

```bash
git fetch origin pull/<PR_NUMBER>/head:<BRANCH_NAME>
```

