# Introduction

1. help
   ```shell
   man git-command
   # or
   git help command
   git command --help
   ```
   - [Git - Documentation](https://git-scm.com/doc)
     - [Git - Reference](https://git-scm.com/docs)
     - [Git, including all commands](https://git-scm.com/docs/git)
     - [Git - gitglossary Documentation](https://git-scm.com/docs/gitglossary)
   - `git help`
     ```shell
     git help [-a|--all [--[no-]verbose]] [-g|--guide]
            [-i|--info|-m|--man|-w|--web] [COMMAND|GUIDE]
     ```
   - `-h` `--help` option
   - [GitHub.com Help Documentation](https://docs.github.com/en)
   - [GitHub Learning Lab](https://lab.github.com/)

1. `git`
   ```shell
   git [--version] [--help] [-C <path>] [-c <name>=<value>]
       [--exec-path[=<path>]] [--html-path] [--man-path] [--info-path]
       [-p|--paginate|-P|--no-pager] [--no-replace-objects] [--bare]
       [--git-dir=<path>] [--work-tree=<path>] [--namespace=<name>]
       [--super-prefix=<path>]
       <command> [<args>]
   ```

1. `git config`
   - location
     - `/etc/gitconfig` -- `--system`
     - `~/.gitconfig` or `~/.config/git/config` -- `--global`
     - `.git/config` -- `--local` or by default
   - show configuration and where it comes from
     ```shell
     # git config [<file-option>] [--show-origin] [-z|--null] [--name-only] -l | --list
     git config --list --show-origin
     ```
   - common configurations -- list available in `git help config`
     - identity
       - `user.name`
       - `user.email`
       - `credential.helper`
       - `user.signingkey` -- typically from `gpg --gen-key` or `gpg --list-keys`
     - utilities
       - `core.editor` or `EDITOR` environment variable
     - aliases -- `alias.<string>`
   - branch
     - `branch.<name>.remote`, `branch.<name>.merge` -- usually use `git checkout` or `git branch` with `-t` to set
     - `branch.autoSetupMerge`
   - remote
     - `pull.rebase`, boolean
   - functionality
     - `rerere.enabled`

1. `.gitignore`
   - docs -- `man gitignore`
   - syntax
     - inline comment -- `#`
     - glob patterns -- applied recursively, like simplified regexp
       - `*` -- zero or more characters
       - `?` -- one character
       - `**` -- `a/**/z` would match `a/z`, `a/b/z`, `a/b/c/z`, and so on
       - `[abc]` -- same as regexp
     - avoid recursivity -- start patterns with `/`
     - specify directory -- end patterns with `/`
     - negate patterns -- start with `!`
   - commonly used -- [github/gitignore: A collection of useful .gitignore templates](https://github.com/github/gitignore)
     ```shell
     *.[oa] # object and archive files
     *~ # temporary files of editors such as vim and emacs
     ```

1. CLI
   - `gitk`

1. GitHub API
   - `/users/<username>`
     ```
     curl https://api.github.com/users/schacon
     ```
   - gitignore
     ```
     curl https://api.github.com/gitignore/templates/Java
     ```
   - comment
     ```
     curl -H "Content-Type: application/json" \
         -H "Authorization: token TOKEN" \
         --data '{"body":"A new comment, :+1:"}' \
         https://api.github.com/repos/schacon/blink/issues/6/comments
     ```
   - gist -- like normal git repo
     - anonymous
       ```
       git clone https://gist.github.com/<gist-id>.git
       ```
     - with user
       ```
       git clone https://<user>@gist.github.com/<gist-id>.git
       ```

# Quick Reference

1. initialization
   ```shell
   cd dir_name
   git init
   git add .
   git commit
   ```

1. add files to the index
   ```shell
   git add file1 file2 file3
   ```

1. changes made to indexed files
   ```shell
   git diff --cached
   git status
   ```

1. all in one step
   ```shell
   git add -a
   ```

# Philosophy

1. philosophy -- [Git - gitglossary Documentation](https://git-scm.com/docs/gitglossary)
   - snapshots -- stream of snapshots instead of delta-based version control
   - local -- most operations are local compared to the central-based
   - integrity -- everything is checksummed (SHA-1) before it is stored and is then referred to by that checksum
   - only add (generally) -- hard to get the system to do anything that is not undoable or to make it erase data in any way
   - three states -- modified, staged and commited
   - index -- cache
   - working tree -- current file contents tree for files in track

1. common options
   - list files
     - `--` -- used to separate command-line options from the list of files, (useful when filenames might be mistaken for command-line options)
     - escape like `git rm \*~` -- Git does its own filename expansion in addition to your shell’s filename expansion
     - `-r` -- recursively
   - how to run
     - `-n` `--dry-run`
     - `-i` `--interactive`
     - `-p` `--patch` -- partially for files
     - `-f` `--force`
     - `-e` `--edit` -- Open the diff vs. the index in an editor and let the user edit it
   - stdout
     - `-q` `--quiet`
     - `-v`, `-vv`, `--verbose`
   - message
     - `-m <msg>` `--message=<msg>`
     - `-F <file>` `--file=<file>`
     - `-e` `--edit` -- further edit the message from `-m` or `-F`
     - otherwise configured editor is started for message
   - operations
     - `-d`, `--delete`

1. data types
   - `<date>`
   - `<pattern>` -- shell wildcard / glob pattern, except that slashes are not treated specially
   - `<revision range>`
   - `<repository>` -- `<url>` or `<name>` of a remote
   - `<object>`, `<rev>`
     - blobs, trees, tags and commits, `<commit>` -- defaults to `HEAD`
     - `<sha1>` -- full or leading substring that is unique
     - `<describeOutput>` -- `git describe` output, optionally followed by a dash and a number of commits, followed by a dash, a g, and an abbreviated object name, e.g. `v1.7.4.2-679-g3bee7fb`
     - `<refname>` -- e.g. `master`, `heads/master`, `refs/heads/master`, see below
     - more below
   - `<range>` -- a set of commits
   - `<refspec>`

1. `<rev>`, `<refname>` -- checked by `git check-ref-format`, see also above
   - resolved by the order below
     - `$GIT_DIR/<refname>` that is what you mean (this is usually useful only for `HEAD`, `FETCH_HEAD`, `ORIG_HEAD`, `MERGE_HEAD` and `CHERRY_PICK_HEAD`);
       - `HEAD`, `@` -- commit on which you based the changes in the working tree
       - `FETCH_HEAD` -- the last `git fetch` branch
       - `ORIG_HEAD` -- created by commands that move your `HEAD` in a drastic way, for undo
       - `MERGE_HEAD` -- the commit(s) which you are merging into your branch when you run `git merge`
       - `CHERRY_PICK_HEAD` -- records the commit which you are cherry-picking when you run `git cherry-pick`
     - `refs/<refname>` if it exists;
     - `refs/tags/<refname>` if it exists;
     - `refs/heads/<refname>` if it exists;
     - `refs/remotes/<refname>` if it exists;
     - `refs/remotes/<refname>/HEAD` if it exists.
   - with `@`
     - `@` -- `HEAD`
     - `[<refname>]@{<date>}` -- the value of the ref at a prior point in time, e.g. `master@{yesterday}`, `HEAD@{5 minutes ago}`
     - `<refname>@{<n>}` -- the n-th prior value of that ref, e.g. `master@{1}`, see `git reflog`
       - `@{<n>}` -- current branch
       - `@{-<n>}` -- the n-th branch/commit checked out before the current one
     - `[<branchname>]@{upstream}`, `<branchname>@{u}` -- upstream branch for `branchname`, configured with `branch.<name>.remote` and `branch.<name>.merge`, e.g. `master@{upstream}`, `@{u}`
     - `[<branchname>]@{push}` -- the local tracking branch (`refs/remotes/`) for `git push` destination (checked out branch or the current `HEAD` if no branchname is specified), e.g. `master@{push}`, `@{push}`
       - difference -- In a non-triangular workflow, `@{push}` is the same as `@{upstream}`
       - triangular workflow -- where we pull from one location and push to another
         ```shell
         git config push.default current
         git config remote.pushdefault myfork
         git switch -c mybranch origin/master
         ```
   - `<rev>`
     - `<rev>^[<n>]` -- the nth parent of that commit object, `<rev>^` is equivalent to `<rev>^1`
     - `<rev>~[<n>]` -- `<rev>~3` is equivalent to `<rev>^^^` which is equivalent to `<rev>^1^1^1`
     - `<rev>^{<type>}`
       - `<rev>^{}`
     - `:/<text>` -- search commit by commit message with regex `<text>`, with [special sequence](https://git-scm.com/docs/gitrevisions#Documentation/gitrevisions.txt-emlttextgtemegemfixnastybugem)
       - `<rev>^{/<text>}`
     - `<rev>:<path>` -- the blob or tree, e.g. `HEAD:README`, `master:./README`
     - `:[<n>:]<path>` -- a blob object in the index
       - `n` -- stage number, defaults to 0, during a merge, stage 1 is the common ancestor, stage 2 is the target branch’s version (typically the current branch), and stage 3 is the version from the branch which is being merged.
   - `<tree-ish>` -- a (sub)directory tree
     ```
     ----------------------------------------------------------------------
     |    Commit-ish/Tree-ish    |                Examples
     ----------------------------------------------------------------------
     |  1. <sha1>                | dae86e1950b1277e545cee180551750029cfe735
     |  2. <describeOutput>      | v1.7.4.2-679-g3bee7fb
     |  3. <refname>             | master, heads/master, refs/heads/master
     |  4. <refname>@{<date>}    | master@{yesterday}, HEAD@{5 minutes ago}
     |  5. <refname>@{<n>}       | master@{1}
     |  6. @{<n>}                | @{1}
     |  7. @{-<n>}               | @{-1}
     |  8. <refname>@{upstream}  | master@{upstream}, @{u}
     |  9. <rev>^                | HEAD^, v1.5.1^0
     | 10. <rev>~<n>             | master~3
     | 11. <rev>^{<type>}        | v0.99.8^{commit}
     | 12. <rev>^{}              | v0.99.8^{}
     | 13. <rev>^{/<text>}       | HEAD^{/fix nasty bug}
     | 14. :/<text>              | :/fix nasty bug
     ----------------------------------------------------------------------
     |       Tree-ish only       |                Examples
     ----------------------------------------------------------------------
     | 15. <rev>:<path>          | HEAD:README, :README, master:./README
     ----------------------------------------------------------------------
     |       Tree-ish/Blob       |                Examples
     ----------------------------------------------------------------------
     | 16. :<n>:<path>           | :0:README, :README
     ----------------------------------------------------------------------
     ```

1. `<range>` -- a set of commits
   - reachable set -- the commit itself and the commits in its ancestry chain
   - `<rev>` -- the set of commits reachable from the given commit
   - `^<rev>` -- exclude
   - dot range
     - `<rev>..<rev>` -- range, `r1..r2` is equivalent to `^r1 r2`
     - `<rev>...<rev>` -- symmetric difference, `r1...r2` is equivalent to `r1 r2 --not $(git merge-base --all r1 r2)`, the set of commits that are reachable from either one of `r1` (left side) or `r2` (right side) but not from both
     - default `<rev>` -- `HEAD`, `origin..` is a shorthand for `origin..HEAD`
   - parent
     - `<rev>^@` -- all parents of `<rev>`
     - `<rev>^!` -- `<rev>` but its parents, i.e. single commit
     - `<rev>^-[<n>]` -- `<rev>^<n>..<rev>`, `<n>` defaults to 1

1. `<refspec>` -- the destination ref to update with what source object, a way of mapping names on the remote with local names
   ```
   [+]<src>:<dst>
   ```
   - `+` -- override restriction rules, like `--force`
   - `<src>` -- `<rev>`
     - empty `<src>` without `+` or `--force`: `:<dst>` -- delete `<dst>`
   - `<dst>` -- defaults to `remote.<repository>.push`, if not set, defaults to the same ref as `<src>`
   - `tag <tag>` -- the same as `refs/tags/<tag>:refs/tags/<tag>`
   - single `:` -- "matching" branches: for every branch that exists on the local side, the remote side is updated if a branch of the same name already exists on the remote side
   - example -- in gitconfig also `fetch` pull request heads to `refs/remotes/origin/pr`
     ```
     [remote "origin"]
         url = https://github.com/libgit2/libgit2.git
         fetch = +refs/heads/*:refs/remotes/origin/*
         fetch = +refs/pull/*/head:refs/remotes/origin/pr/*
     ```

1. `<pathspec>` -- see [Git gitglossary](https://git-scm.com/docs/gitglossary#Documentation/gitglossary.txt-aiddefpathspecapathspec)

# Git Basics

## Getting and Creating Projects

1. `git init`
   ```shell
   git init [-q | --quiet] [--bare] [--template=<template_directory>]
         [--separate-git-dir <git dir>]
         [--shared[=<permissions>]] [directory]
   ```

1. `git clone`
   ```shell
   git clone [<options>] [--] <repository> [<directory>]
   ```
   - `-o <name>`, `--origin <name>`

## Basic Snapshotting

### Add

1. `git add`
   ```
   git add [--verbose | -v] [--dry-run | -n] [--force | -f] [--interactive | -i] [--patch | -p]
         [--edit | -e] [--[no-]all | --[no-]ignore-removal | [--update | -u]]
         [--intent-to-add | -N] [--refresh] [--ignore-errors] [--ignore-missing] [--renormalize]
         [--chmod=(+|-)x] [--] [<pathspec>…​]
   ```

1. `git commit`
   - commit message
     - `-m <msg>`, `--message=<msg>`
       - without `-m` to open an editor for commit message
       - `-v` for verbose reminder
     - `-C <commit>`, `--reuse-message=<commit>`
     - `-c <commit>`, `--reedit-message=<commit>`
     - `-F <file>`, `--file=<file>`
   - `-a`, `--all` -- automatically stage files that have been modified and deleted, but new files you have not told Git about are not affected
   - `--amend` -- Replace the tip of the current branch by creating a new commit
     - has the same parents and author as the current one -- the `--reset-author` option can countermand this
     - --no-edit -- keep commit message

### Deletion

1. `git rm` -- Remove files from the working tree and from the index
   ```
   git rm [-f | --force] [-n] [-r] [--cached] [--ignore-unmatch] [--quiet] [--] <file>…​
   ```
   - `--cached` -- Use this option to unstage and remove paths only from the index. Working tree files, whether modified or not, will be left alone.

1. `git reset` -- Reset current HEAD to the specified state
   ```
   git reset [-q] [<tree-ish>] [--] <paths>…​
   git reset (--patch | -p) [<tree-ish>] [--] [<paths>…​]
   git reset [--soft | --mixed [-N] | --hard | --merge | --keep] [-q] [<commit>]
   ```
   - mode
     - `--soft` -- only move `HEAD`
     - `--mixed` -- also reset index
     - `--hard` -- also reset the working tree
   - with file path -- `git restore`
   - `git revert` -- Revert some existing commits

### Get Info

1. `git status` -- Show the working tree status
   ```shell
   git status [<options>…​] [--] [<pathspec>…​]
   ```
   - statuses
     - ' ' = unmodified
     - M = modified
     - A = added
     - D = deleted
     - R = renamed
     - C = copied
     - U = updated but unmerged
   - `-s`, `--short` -- Give the output in the short-format.
     ```
     X          Y     Meaning
     -------------------------------------------------
              [AMD]   not updated
     M        [ MD]   updated in index
     A        [ MD]   added to index
     D                deleted from index
     R        [ MD]   renamed in index
     C        [ MD]   copied in index
     [MARC]           index and work tree matches
     [ MARC]     M    work tree changed since index
     [ MARC]     D    deleted in work tree
     [ D]        R    renamed in work tree
     [ D]        C    copied in work tree
     -------------------------------------------------
     D           D    unmerged, both deleted
     A           U    unmerged, added by us
     U           D    unmerged, deleted by them
     U           A    unmerged, added by them
     D           U    unmerged, deleted by us
     A           A    unmerged, both added
     U           U    unmerged, both modified
     -------------------------------------------------
     ?           ?    untracked
     !           !    ignored
     -------------------------------------------------
     ```
     - X shows the status of the index, and Y shows the status of the work tree

1. `git diff` -- Show changes between commits, commit and working tree, etc
   ```shell
   git diff [<options>] [<commit>] [--] [<path>…​]
   git diff [<options>] --cached [<commit>] [--] [<path>…​] # --staged is a synonym of --cached
   git diff [<options>] <commit> <commit> [--] [<path>…​]
   git diff [<options>] <blob> <blob>
   git diff [<options>] --no-index [--] <path> <path>
   ```
   - `git difftool` -- `git diff` in an external tool
     - `git difftool --tool-help` to see available tools

# Branching

1. `git checkout` -- Switch branches or restore working tree files
   ```
   git checkout [-q] [-f] [-m] [<branch>]
   ```
   - options
     - `-m`, `--merge` -- error when checking out not indexed changes, use this option to try to merge, staged changes may be lost
     - `-t`, `--track` -- see `git branch`
   - `DETACHED HEAD` -- new commit won’t belong to any branch and will be unreachable, except by the exact commit hash
     ```
     git checkout [-q] [-f] [-m] --detach [<branch>]
     git checkout [-q] [-f] [-m] [--detach] <commit>
     ```
   - `-b` -- check out and create new branch
     ```
     git checkout [-q] [-f] [-m] [[-b|-B|--orphan] <new_branch>] [<start_point>]
     ```
     - `-B` -- `-f -b`, reset to `<start_point>` if already exists
     - `--orphan` -- the first commit made on this new branch will have no parents and it will be the root of a new history totally disconnected from all the other branches and commits
   - restore files
     ```
     git checkout [-f|--ours|--theirs|-m|--conflict=<style>] [<tree-ish>] [--] <pathspec>…​
     git checkout [-f|--ours|--theirs|-m|--conflict=<style>] [<tree-ish>] --pathspec-from-file=<file> [--pathspec-file-nul]
     ```
     - `<tree-ish>` -- defaults to index, with which overwrite both the index and the working tree
   - `git switch` -- branch switching, specialized `git checkout`
     ```
     git switch [<options>] [--no-guess] <branch>
     git switch [<options>] --detach [<start-point>]
     git switch [<options>] (-c|-C) <new-branch> [<start-point>]
     git switch [<options>] --orphan <new-branch>
     ```
   - `git restore` -- reset files to certain revisions, specialized `git checkout`, see [Basic Snapshotting](#Basic-Snapshotting)

1. `git branch` -- List, create, or delete branches
   - create branch and checkout -- `git checkout -b`, see `git checkout`
   - delete
     ```
     git branch (-d | -D) [-r] <branchname>…​
     ```
     - `-d`, `--delete`
     - `-D` -- `--delete --force`
   - list
     ```
     git branch -vv
     ```
     - `[(--merged | --no-merged) [<commit>]]`
   - remote related -- see [Remote](#Remote)

1. `git merge`
   ```
   git merge [-n] [--stat] [--no-commit] [--squash] [--[no-]edit]
       [--no-verify] [-s <strategy>] [-X <strategy-option>] [-S[<keyid>]]
       [--[no-]allow-unrelated-histories]
       [--[no-]rerere-autoupdate] [-m <msg>] [-F <file>] [<commit>…​]
   ```
   - merge commit -- more than one parent
     - `--commit`
     - `--no-commit` -- stop just before creating a merge commit, use in tandem with `--no-ff` if necessary
   - `--squash` -- as if a real merge happened, except for the merge information, fail if used with `--commit`
     - move the `HEAD`, or record `$GIT_DIR/MERGE_HEAD` causing the next `git commit` command to create a merge commit
   - fast forward merge -- only move the pointer, no merge commit
     - `--ff` -- default, fast forward whenever possible
     - `--no-ff` -- merge commit in all cases
     - `--ff-only` -- fast forward or no merge
   - `--allow-unrelated-histories` -- can merge another repo
   - conflict -- also for `git rebase`, `git cherry-pick` etc.
     ```
     git merge (--continue | --abort | --quit)
     ```
     - resolve conflict
       - inspect conflict -- `git status`
       - mark conflict resolved -- stage conflict file, or `git rm`
       - `git mergetool` -- Run merge conflict resolution tools to resolve merge conflicts
       - after resolved -- `git commit` or `git merge --continue`; the latter command checks whether there is a (interrupted) merge in progress before calling `git commit`
     - stop merge
       ```
       git merge (--abort | --quit)
       ```
       - `--abort` -- abort and try to reconstruct the pre-merge state
       - `--quit` -- forget the current merge and leave index and working tree as-is
   - `git rerere` -- Reuse recorded resolution of conflicted merges
     - config -- `rerere.enabled`
   - `git merge-file` -- incorporates all changes that lead from the `<base-file>` to `<other-file>` into `<current-file>`

1. `git tag`
   - list tags
     ```shell
     git tag
     git tag [-n[<num>]] -l [--contains <commit>] [--no-contains <commit>]
         [--points-at <object>] [--column[=<options>] | --no-column]
         [--create-reflog] [--sort=<key>] [--format=<format>]
         [--[no-]merged [<commit>]] [<pattern>…​]
     ```
   - create lightweight tags -- pointers to specific `<object>`s, meant for private or temporary object labels
     ```shell
     git tag <tagname> [<commit> | <object>]
     ```
   - create annotated tags -- stored as full `<object>`, meant for release, containing a creation date, the tagger name and e-mail, a tagging message, and an optional GnuPG signature
     ```shell
     git tag [-a | -s | -u <keyid>]
             [-f]
             [-m <msg> | -F <file>] [-e]
         <tagname>
         [<commit> | <object>]
     ```
     - `-a` `--annotate` -- Make an unsigned, annotated tag object
     - `<tagname>` -- `<refname>`
   - push tags -- have to explicitly push tags to a shared server after creation or deletion
     - `git push <repository> <refspec>…​`
     - `git push <repository> --tags`
     - `git push origin --delete <tagname>`
   - delete
     ```shell
     git tag -d <tagname>…​
     ```

## Patching

1. `git rebase` -- Reapply commits on top of another base tip
   ```
   git rebase [-i | --interactive] [<options>] [--exec <cmd>] [--onto <newbase> | --keep-base] [<upstream> [<branch>]]
   ```
   - `[<upstream> [<branch>]]` -- make `<branch>` based on `<upstream>`, by applying commits `<upstream>..<branch>` to `<upstream>`
     - `<upstream>` -- Upstream branch to compare against, defaults to corresponding configurations
     - `<branch>` -- defaults to `HEAD`, `git switch` if not already on
     - duplicates -- any patch already accepted upstream with a different commit message or timestamp will be skipped
   - `--onto <newbase>` -- start point to base on, defaults to `<upstream>` if omitted; apply commits `<upstream>..HEAD` to `<newbase>`
     - `A...B` as `<newbase>` -- the merge base of A and B if there is exactly one merge base
   - `-keep-base` -- equivalent to `--onto <upstream>…​ <upstream>`, merge base preserved
   - `git pull --rebase` -- `git fetch` and `git rebase <remote>`
   - conflict
     ```
     git rebase (--continue | --skip | --abort | --quit | --edit-todo | --show-current-patch)
     ```
   - `-i`, `--interactive` -- specific action for each commit
     ```
     pick f7f3f6d changed my name a bit
     pick 310154e updated README formatting and added blame
     pick a5f4a0d added cat-file
     # Rebase 710f0f8..a5f4a0d onto 710f0f8
     #
     # Commands:
     # p, pick <commit> = use commit
     # r, reword <commit> = use commit, but edit the commit message
     # e, edit <commit> = use commit, but stop for amending
     # s, squash <commit> = use commit, but meld into previous commit
     # f, fixup <commit> = like "squash", but discard this commit's log message
     # x, exec <command> = run command (the rest of the line) using shell
     # b, break = stop here (continue rebase later with 'git rebase --continue')
     # d, drop <commit> = remove commit
     # l, label <label> = label current HEAD with a name
     # t, reset <label> = reset HEAD to a label
     # m, merge [-C <commit> | -c <commit>] <label> [# <oneline>]
     # . create a merge commit using the original merge commit's
     # . message (or the oneline, if no original merge commit was
     # . specified). Use -c <commit> to reword the commit message.
     #
     # These lines can be re-ordered; they are executed from top to bottom.
     #
     # If you remove a line here THAT COMMIT WILL BE LOST.
     #
     # However, if you remove everything, the rebase will be aborted.
     #
     # Note that empty commits are commented out
     ```

1. `git cherry-pick` -- Apply the changes introduced by some existing commits
   ```
   git cherry-pick [--edit] [-n] [-m parent-number] [-s] [-x] [--ff] [-S[<keyid>]] <commit>…​
   ```
   - conflict
     ```
     git cherry-pick (--continue | --skip | --abort | --quit)
     ```

1. `git filter-branch` -- Rewrite branches, the nuclear option, run test if possible
   - example -- remove a file from entire history
     ```
     git filter-branch --tree-filter 'rm -f passwords.txt' HEAD
     ```
   - example -- make a subdirectory the new project root
     ```
     git filter-branch --subdirectory-filter trunk HEAD
     ```
   - example -- change email of someone
     ```
     git filter-branch --commit-filter '
         if [ "$GIT_AUTHOR_EMAIL" = "schacon@localhost" ];
         then
             GIT_AUTHOR_NAME="Scott Chacon";
             GIT_AUTHOR_EMAIL="schacon@example.com";
             git commit-tree "$@";
         else
             git commit-tree "$@";
         fi' HEAD
     ```

# Remote

1. `git remote` -- Manage set of tracked repositories
   ```shell
   # show
   git remote [-v | --verbose]
   git remote [-v | --verbose] show [-n] <name>…​
   # edit
   git remote add [-t <branch>] [-m <master>] [-f] [--[no-]tags] [--mirror=<fetch|push>] <name> <url>
   git remote rename <old> <new>
   git remote remove <name>
   git remote set-head <name> (-a | --auto | -d | --delete | <branch>)
   git remote set-branches [--add] <name> <branch>…​
   git remote get-url [--push] [--all] <name>
   git remote set-url [--push] <name> <newurl> [<oldurl>]
   git remote set-url --add [--push] <name> <newurl>
   git remote set-url --delete [--push] <name> <url>
   git remote prune [-n | --dry-run] <name>…​
   git remote [-v | --verbose] update [-p | --prune] [(<group> | <remote>)…​]
   ```
   - `origin` -- `git clone` command implicitly adds the `origin` remote
   - remote branches: List references in a remote repository
     ```
     git ls-remote [<repository> [<refs>…​]]
     git remote show [<repository> [<refs>…​]]
     ```
     - pull requests -- references as `refs/pull/<num>/head` and `refs/pull/<num>/merge` (potential merge commit), not `fetch`ed by default

1. `git fetch` -- Download objects and refs from another repository, not merged
   ```shell
   git fetch [<options>] [<repository> [<refspec>…​]]
   git fetch [<options>] <group>
   git fetch --multiple [<options>] [(<repository> | <group>)…​]
   git fetch --all [<options>]
   ```
   - updates `.git/FETCH_HEAD`
   - fetch a pull request
     ```
     git fetch origin refs/pull/958/head
     ```
   - gitconfig for auto fetch pull request heads
     ```
     [remote "origin"]
         url = https://github.com/libgit2/libgit2.git
         fetch = +refs/heads/*:refs/remotes/origin/*
         fetch = +refs/pull/*/head:refs/remotes/origin/pr/*
     ```

1. `git pull` -- fetch and merge a tracking branch
   ```
   git pull [<options>] [<repository> [<refspec>…​]]
   ```
   - tracking branch -- local branches that have a direct relationship to a remote branch
     - `checkout -b` from a remote-tracking branch automatically makes it tracking branch -- `branch.autoSetupMerge`
     - upstream branch -- the remote branch tracked
   - `--rebase` -- see `git rebase`, can be made default by configuration `pull.rebase`
   - merge pull requests locally
     ```
     git pull <url> <branch>
     ```

1. `git branch` -- see also [Branching](#Branching)
   - track -- `-t`, `--track`, set up `branch.<name>.remote` and `branch.<name>.merge` configuration entries
     ```
     git branch [--track | --no-track] [-f] <branchname> [<start-point>]
     ```
     - `--no-track` -- no set up even `branch.autoSetupMerge` is true
   - set upstream -- `--set-upstream-to`, `-u`
     ```
     git branch (--set-upstream-to=<upstream> | -u <upstream>) [<branchname>]
     ```

1. `git push` -- Update remote refs along with associated objects
   ```shell
   git push [--all | --mirror | --tags] [--follow-tags] [--atomic] [-n | --dry-run] [--receive-pack=<git-receive-pack>]
          [--repo=<repository>] [-f | --force] [-d | --delete] [--prune] [-v | --verbose]
          [-u | --set-upstream] [-o <string> | --push-option=<string>]
          [--[no-]signed|--signed=(true|false|if-asked)]
          [--force-with-lease[=<refname>[:<expect>]]]
          [--no-verify] [<repository> [<refspec>…​]]
   ```
   - `-d`, `--delete` -- All listed refs are deleted from the remote repository. This is the same as prefixing all refs with a colon.
   - `-u`, `--set-upstream`

# Inspection and Comparison

1. `git status`

1. `git diff`

1. `git log` -- Show commit logs
   ```shell
   git log [<options>] [<revision range>] [[--] <path>…​]
   ```
   - commit limiting
     - `-<number>`, `-n <number>`, `--max-count=<number>` -- Limit the number of commits to output.
     - `--since=<date>`, `--after=<date>`
     - `--until=<date>`, `--before=<date>`
     - `--no-merges` -- Do not print commits with more than one parent. This is exactly the same as `--max-parents=1`
   - diff
     - `-p`, `-u`, `--patch` -- Generate patch
     - `--stat`
     - `-S<string>` -- Look for differences that add/delete the specified string in a file, can also be file name or directory name
     - `-G<regex>` -- Look for differences whose patch text contains added/removed lines that match `<regex>`
   - formatting
     ```shell
     git log --pretty=format:"%h %s" --graph
     git log --pretty=oneline
     ```
     - `--pretty[=<format>]`, `--format=<format>`
       - `<format>` -- [git docs](https://git-scm.com/docs/git-log#_pretty_formats)
     - `--graph` -- text-based graphical representation of the commit history
     - `--decorate[=short|full|auto|no]` -- Print out the ref names of any commits that are shown
     - `--oneline` -- `--pretty=oneline --abbrev-commit`
     - more
   - `git shortlog` -- Summarize `git log` output
   - `-g` `--walk-reflogs` -- Instead of walking the commit ancestry chain, walk reflog entries from the most recent one to older ones

1. `git show` -- show one or more objects (blobs, trees, tags and commits)
   ```shell
   git show [<options>] [<object>…​]
   ```
   - show
     - For commits -- shows the log message and textual diff
       - merge commit -- in a special format as produced by `git diff-tree --cc`.
     - For tags -- it shows the tag message and the referenced objects.
     - For trees -- it shows the names (equivalent to `git ls-tree` with `--name-only`).
     - For plain blobs -- it shows the plain contents.
   - options -- `git diff-tree` options to control how the changes the commit introduces are shown.

1. `git describe` -- Give an object a human readable name based on an available ref, require annotated tags
   - `--tags` -- also lightweight tags

# Utility

1. `git check-ref-format` -- ensures that a reference name `<refname>` is well formed
   ```shell
   git check-ref-format [--normalize]
          [--[no-]allow-onelevel] [--refspec-pattern]
          <refname>
   git check-ref-format --branch <branchname-shorthand>
   ```

1. `git rev-list` -- lists commit objects in reverse chronological order, with pretty formats, underlying command for other commands
   ```shell
   git rev-list [<options>] <commit>…​ [[--] <path>…​]
   ```

1. `git rev-parse` -- pick out and massage parameters??
   ```shell
   git rev-parse [<options>] <args>…​
   ```
   - options
     - mode
     - filtering
     - for output
       - `--symbolic`
       - `--symbolic-full-name`
         ```shell
         $ git rev-parse --symbolic-full-name @{push}
         refs/remotes/myfork/mybranch
         ```
     - more
   - example
     ```shell
     $ git rev-parse topic1
     ca82a6dff817ec66f44342007202690a93763949
     ```

## Content Search

1. `git grep`

1. `git bisect`

1. `git blame` -- Show what revision and author last modified each line of a file

1. `git log`
   - `-S <string>`
   - `-G <regex>`
   - `-L <start>,<end>:<file>`
   - `-L :<funcname>:<file>`

## Administration

1. `git archive` -- Create an archive of files from a named tree
   - example
     ```shell
     git archive master --prefix='project/' --format=zip > `git describe master`.zip
     ```

1. `git bundle` -- `git archive` but with `.git` folder

1. `git reflog` -- the tips of branches and other references were updated in the local repository

1. `git stash`
   - `--index` -- also restore the index
   - `-k` `--keep-index`, `--no-keep-index` -- keep the index intact
   - `-u` `--include-untracked`
   - `-a` `--all`

1. `git clean` -- Remove untracked files from the working tree
   - backup before clean -- `git stash -a`

## Submodules

1. `git submodule`
   - clone a project with submodules
     - clone one by one
       ```
       cd sub_name
       git submodule init
       git submodule update
       ```
     - clone recursively
       ```
       git clone --recurse-submodules
       ```
   - more
