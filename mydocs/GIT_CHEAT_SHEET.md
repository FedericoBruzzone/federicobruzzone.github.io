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

## Maintainer's Guide: Managing PRs from External Forks

This guide explains how to contribute commits, fix errors, or reset the state of a Pull Request (PR) opened by an external contributor.


### 1. Setup: Adding the Fork
First, you need to let your local Git know where the contributor's code is located by adding their fork as a new remote.

```bash
# Add the user's repository as a 'remote'
git remote add fork-user [https://github.com/USER_NAME/REPO_NAME.git](https://github.com/USER_NAME/REPO_NAME.git)

# Download the contributor's branches and commits
git fetch fork-user
```

### 2. Handling "Detached HEAD"

If you run git checkout fork-user/main, you enter Detached HEAD mode. Git warns you because you are not on a real local branch, and any new commits won't be easily trackable.

How to recover if you are already in Detached HEAD:
If you have already made commits in this state, "pin" them to a new local branch immediately:
```bash
git checkout -b fix-pr
```

**How to avoid it from the start:**
Instead of checking out the remote tracking branch directly, create a local branch that follows it:
```bash
git checkout -b fix-pr fork-user/pr-branch-name
```

### 3. Modifying and Pushing (Updating the PR)
Once you have committed your changes locally, you need to push them back to the contributor's fork to update the PR.

```bash
# Standard push (use this if you only added new commits)
git push fork-user fix-pr:pr-branch-name

# Force push (required if you used 'commit --amend' or 'rebase')
git push fork-user fix-pr:pr-branch-name --force
```

### 4. Undoing Changes (Undo & Reset)

If something goes wrong during the process, use these commands to roll back.

**A. Soft Reset: Undo the last commit (keep your changes)**
Use this if you want to fix the commit message or group changes differently.
```bash
git reset --soft HEAD~1
```

**B. Hard Reset: Delete the last commit and all changes**
Use this to completely discard the last local commit.
```bash
git reset --hard HEAD~1
```

**C. Total Reset: Match the Fork exactly (Clean Slate)**
If your local branch is in a mess, force it to match the contributor's remote branch exactly:
```bash
git fetch fork-user
git reset --hard fork-user/pr-branch-name
```
