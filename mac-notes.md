# Miscellanea

1. docs
   - [Mac keyboard shortcuts - Apple Support](https://support.apple.com/en-us/HT201236)
     - [Mac startup key combinations - Apple Support](https://support.apple.com/en-us/HT201255)
     - [Mac accessibility shortcuts - Apple Support](https://support.apple.com/en-us/HT204434)
   - [Mac tips for Windows switchers - Apple Support](https://support.apple.com/en-us/HT204216)
   - [What’s it called on my Mac? - Apple Support](https://support.apple.com/guide/mac-help/whats-it-called-on-my-mac-cpmh0038/mac)
   - [zsh: Table of Contents](http://zsh.sourceforge.net/Doc/Release/zsh_toc.html)
     - [zsh/Completion/Base/Widget at master · johan/zsh](https://github.com/johan/zsh/tree/master/Completion/Base/Widget)

1. customize
   - [pqrs-org/Karabiner-Elements: Karabiner-Elements is a powerful utility for keyboard customization on macOS Sierra (10.12) or later.](https://github.com/pqrs-org/Karabiner-Elements)

# Commons

1. right click -- `^` `click`

1. home / end
   - `fn` `arrow` (left and right)
   - `command` `arrow` (left and right) -- move the insertion point
     - backwards / forwards in Chrome
     - `option` `arrow` (up and down) -- see below
   - `command` `arrow` (up and down) -- `ctrl` `home` or `ctrl` `end` in Windows

1. page up / down
   - `fn` `arrow` (up and down)
   - `option` `arrow` (up and down)
     - home / end when edit
     - first / last item in Finder
     - next / previous item in Previewer

1. `ctrl` `arrow` in Windows -- `option` `arrow` (left and right)

1. `command`
   - `command` `g` -- find next, with `shift` to find previous
     - `command` `e` in Chrome -- use selection for find
   - `option` `command` `esc` -- in the Apple menu
   - `command` `space` -- Spotlight
     - `command` `l` -- dictionary
     - `command` -- show path
     - [Spotlight keyboard shortcuts on Mac - Apple Support](https://support.apple.com/guide/mac-help/spotlight-keyboard-shortcuts-mh26783/mac)
   - `^` `command` `space` -- emojis and symbols
   - `^` `command` `d` -- the definition of the selected word
   - Spelling
     - `shift` `command` `:` -- Display the Spelling and Grammar window
     - `command` `;` -- Find misspelled words in the document.
   - `option` `command` `f` -- Show or hide a toolbar in the app
   - `option` `command` `i` -- Show or hide the inspector window
   - `command` `+`, `command` `-`, `command` `0` -- zoom
   - `shift` `command` `?` -- help

## Edit

1. edit
   - backspace (`^?`) and delete
     - del -- `fn` `delete`
     - `option` `delete`, `option` `backspace` -- delete word
   - align
     - `^` `[` -- left align
     - `^` `]` -- right align
     - `shift` `^` `\` -- center align
   - from emacs
     - `^` `h`, `^` `d` -- backward-delete-char, delete-char-or-list
     - `^` `k`
     - `^` `y` -- yank
     - `^` `a`, `^` `e` -- beginning-of-line, end-of-line
     - `^` `f`, `^` `b` -- backward-char, forward-char
     - `^` `l` -- Center the cursor or selection in the visible area
       - `clear` in Terminal
     - `^` `p`, `^` `n`
     - `^` `o` -- Insert a new line after the insertion point, cursor stays
     - `^` `t` -- swap character

1. edit in Terminal -- `bindkey -M main`, `option` or `esc` (`^[`) as meta key
   - docs
     - [zsh: 18 Zsh Line Editor](http://zsh.sourceforge.net/Doc/Release/Zsh-Line-Editor.html)
     - [ANSI escape code - Wikipedia](https://en.wikipedia.org/wiki/ANSI_escape_code)
   - arguments -- most commands support argument for repeating
     - `option` `number` -- digit-argument
     - `option` `-` -- neg-argument
   - movement
     - `^` `b`, `^` `f` -- backward-char, forward-char
     - `^x` `^` `f` -- vi-find-next-char
     - `option` `shift` `|` (vim: `|`) -- vi-goto-column, use with number argument
     - `option` `b`, `option` `f` -- backward-word, forward-word
     - `^` `a`, `^` `e` -- beginning-of-line, end-of-line
     - `^` `n`, `^` `p` -- down-line-or-history, up-line-or-history
     - `^x` `^` `b` -- vi-match-bracket
   - history
     - `option` `shift` `<` (vim: `gg`), `option` `shift` `>` -- beginning-of-buffer-or-history, end-of-buffer-or-history
     - `^` `n`, `^` `p` -- down-line-or-history, up-line-or-history
     - `option` `p`, `option` `n` -- history-search-backward, history-search-forward
     - `^x` `^` `n` -- infer-next-history, search in the history list for a line matching the current one and fetch the event following it
     - `option` `.`, `option` `-` -- insert-last-word, use with positive and negative (can be `-0`) argument
     - `option` `,`, `option` `/` -- _history-complete-newer, _history-complete-older, Complete words from the history
     - search
       - keymap -- `bindkey -M isearch`
       - `^` `r`, `^x` `r` -- history-incremental-search-backward, reverse search, a second `^` `r` recalls the previous search
       - `^` `s`, `^x` `s` -- history-incremental-search-forward
       - supported functions
         - accept-*
         - backward kill or delete
         - history-incremental-search-forward, history-incremental-search-backward -- find next occurrence or invert search
         - quote-insert
         - vi prefixed version of the above and vi-cmd-mode, vi-repeat-search, vi-rev-repeat-search
         - exit -- send-break restore, movement commands retain
   - modifying text
     - kill
       - `^` `h`, `^` `d` -- backward-delete-char, delete-char-or-list, in Terminal `exit` if no character when `^` `d`
       - `^` `w` or `option` `^` `h`, `option` `d` -- backward-kill-word, kill-word
       - `^` `k`, `^` `u` -- kill-line, kill-whole-line (remapped to backward-kill-line)
       - `^x` `^` `k` -- kill-buffer
     - yank
       - `^` `y` -- yank
       - `option` `y` -- yank-pop, cycle though
     - transpose
       - `^` `t` -- transpose-chars
       - `option` `t` -- transpose-words
     - case
       - `option` `c`, `option` `l` (remapped to `ls^J`) -- capitalize-word, down-case-word
       - `option` `u` -- up-case-word
     - join
       - `^x` `^` `j` -- vi-join
     - selection region
       - `option` `w` -- copy-region-as-kill
       - `^x`, `^` `x` -- exchange-point-and-mark
       - `option` `"` -- quote-region
       - `^` `@` -- set-mark-command, Set the mark at the cursor position
   - insert
     - `^` `i`, `option` `^` `i` -- expand-or-complete, self-insert-unmeta, `\t`
     - `^` `m`, `option` `^` `m` -- accept-line, self-insert-unmeta, `\r`
     - `^` `j`, `option` `^` `j` -- accept-line, self-insert-unmeta, `\n`
     - `^` `v` -- quoted-insert, control sequence, `^` `v` + `^` `h` types "^H", a literal backspace
     - `option` `.`, `option` `-` -- insert-last-word
     - `option` `^` `-` -- copy-prev-word
     - `option` `m` -- copy-prev-shell-word
     - `option` `"` -- quote-region
     - `option` `'` -- quote-line
     - `^x` `^` `r` -- [_read_comp](https://github.com/johan/zsh/blob/master/Completion/Base/Widget/_read_comp)
     - `^x` `m` -- _most_recent_file, supports globbing
   - mode
     - `^x` `^` `o` -- overwrite-mode
     - `^x` `^` `v` -- vi-cmd-mode
     - `^x` `^` `e` -- edit-command-line, edit line in vim
     - `option` `x` -- execute-named-cmd, keymap `bindkey -M command`
       - `option` `z` -- execute-last-named-cmd
     - `^` `g`, `option` `^` `g` -- send-break, Abort the current editor function: Abort the research and restore the original line
     - `^` `l` -- clear-screen
     - buffer -- registers in vim
       - the ‘yank’ buffer `"0`, the nine ‘queued’ buffers `"1` to `"9` -- If no buffer is specified for a cut or change command, `"1` is used, and the contents of `"1` to `"8` are each shifted along one buffer; the contents of `"9` is lost. If no buffer is specified for a yank command, `"0` is used
       - the 26 ‘named’ buffers `"a` to `"z` -- If a named buffer is specified using a capital, the newly cut text is appended to the buffer instead of overwriting it
       - the ‘black hole’ buffer `"_` -- When using the `"_` buffer, nothing happens. This can be useful for deleting text without affecting any buffers
   - completion
     - `^` `d` -- delete-char-or-list, If the cursor is at the end of the line, list possible completions for the current word
     - `option` `^` `d` -- list-choices
     - `tab`, `^` `i` -- expand-or-complete
     - `^x` `n` -- _next_tags, basically same as `tab`?
     - `^` `@` -- autosuggest-accept (also mapped to `^` `space`)
       - deprecated, use `option` `p` instead
     - spelling
       - `option` `$`, `option` `s` -- spell-word, Attempt spelling correction on the current word
       - `^x` `c` -- _correct_word, spell correction
   - expand or print
     - `tab` -- expand-or-complete
     - `option` `space`, `option` `!` -- expand-history (`!!` for example)
     - `^x` `shift` `*`, `^x` `e` -- expand-word (`$PATH` expands to the path), _expand_word (with completion selection)
     - `^x` `g`, `^x` `d` -- list-expand, _list_expansions, `echo` that word
     - `^x` `a` -- _expand_alias
     - `^x` `=` -- `ga` in vim, what-cursor-position, print char code
   - accept or buffer stack
     - `^` `m`, `^` `j` -- accept-line
     - `^` `o` -- accept-line-and-down-history, Executes the found command from history, and fetch the next line relative to the current line from the history for editing
     - `option` `a` -- accept-and-hold, Push the contents of the buffer on the buffer stack and execute it
     - `^` `q`, `option` `q` -- push-line, remapped to push-line-or-edit
     - `option` `h` -- run-help, Push the buffer onto the buffer stack, and execute the command `run-help cmd`, where cmd is the current command, `run-help` is normally aliased to `man`
     - `option` `shift` `?` -- which-command, push current and `which-command cmd`, `which-command` is normally aliased to `whence`
     - `option` `g` -- get-line, Pop the top line off the buffer stack and insert it at the cursor position
   - undo
     - `^` `-`, `^x` `u`, `^x` `^` `u` -- undo
     - `^` `r` in vim -- redo

# System

1. navigation -- snap aware, in System Preferences > Keyboard > Shortcuts > Keyboard
   - switch navigation on / off -- `^` `F1`
   - menu bar navigation -- `^` `F2`
   - dock navigation -- `^` `F3`
     - hide dock -- `option` `command` `d`

1. windows
   - `command` `h` -- Hide the windows of the front app. Press `Command-Option-H` to view the front app but hide all other apps.
     - invisible in mission control
   - `command` `m` -- Minimize the front window to the Dock. Press `Command-Option-M` to minimize all windows of the front app.
     - `command` `tab` can switch to a minimized app but windows of the app will stay minimized
     - invisible in mission control
   - `command` `w`
     - `option` `command` `w` -- all windows
     - `shift` `command` `w` -- all tabs of this window
   - `^` `command` `f` -- fullscreen
   - `command` `tab` -- app switcher
     - can use arrow keys to switch and show application windows
     - use `h` to hide and `q` to `quit`
     - drag aware
   - `command` `~`
     - switch between windows of the same app
     - switch backwards when `command` `tab`
   - `^` `arrow`
     - application windows -- snap aware
   - open new via double clicking
     - with `command` -- in a new tab / window
     - with `option` -- Open the item in a separate window, then close the original window
   - drag app to upper menu bar -- mission control
   - scroll bar
     - click -- page up / down
     - `option` and click -- scroll to
   - [rectangle](https://github.com/rxhanson/Rectangle) app
   - virtual desktops

1. force quit app -- `option` `command` `esc`

1. input method
   <!-- - change order of input sources -- &#x2318; -->
   - change order of input sources -- tbd
   - emoji, Keyboard viewer -- in the input menu, or `^` `command` `space`
   - popup for accented alphabet -- hold the key
     - disable popup -- `defaults write -g ApplePressAndHoldEnabled -bool false`
   - alternative keyboard -- hold `option`
     - show alternative keyboard layout -- System Preferences > Keyboard > Input Sources, hold `option` key
     - [dead key](https://en.wikipedia.org/wiki/Dead_key)
       - `option` `e` -- á, é, í, ó, ú
       - `option` `~` -- à, è, ì, ò, ù
       - `option` `u` -- ä, ë, ï, ö, ü, ÿ
       - `option` `i` -- â, ê, î, ô, û
       - `option` `n` -- ã, õ, ñ
       - `option` `c` -- ç
   - unicode hex input -- hold `option` to input chars by unicode hex

1. boot start
   - login items
   - plist -- `launchctl list`, `launchctl unload`
     - Apple daemons, agents only -- `/System/Library/LaunchDaemons`, `/System/Library/LaunchAgents`
       - stop Apple Music from responding to media play button (also affects other apps when using external keyboard)
         ```shell
         launchctl unload -w /System/Library/LaunchAgents/com.apple.rcd.plist
         ```
     - 3rd party processes -- `/Library/LaunchDaemons`
     - 3rd agents -- `/Library/LaunchAgents`, `~/Library/LaunchAgents`
     - obsolete -- `/Library/StartupItems` and `/System/Library/StartupItems`
   - kernal extension (kext) -- `/System/Library/Extensions`
   - cron job -- `cron`

1. volume
   - `option` `shift` `volume` -- Adjust the sound volume in smaller steps
     - also applies to brightness, with `^` for external display (if supported)
     - also applies to keyboard brightness

1. screenshot
   - with `^` to save to clipboard
   - `shift` `command` `5` -- general
   - `shift` `command` `6` -- touch bar

## Accessibility

1. tts
   - `option` `esc`

# Terminal

1. meta key

1. zsh
   - `upgrade_oh_my_zsh`

1. cli
   - `open` -- opens each file using the default application for that file
     ```shell
     open [-e] [-t] [-f] [-W] [-R] [-n] [-g] [-h] [-s <partial SDK name>][-b <bundle identifier>] [-a <application>] [filenames] [--args arguments]
     ```
     - open in Finder if directory
     - `-a <application>` -- Opens with the specified application
       ```shell
       open -a Preview file # open in preview
       ```
     - `-e` -- Opens with TextEdit
   - `defaults` -- like registry in Windows
     - mouse acceleration -- `defaults write .GlobalPreferences com.apple.mouse.scaling -1`
     - hidden files -- `defaults write com.apple.finder AppleShowAllFiles -bool true`

1. command utilities
   - `say` -- text to speech
   - `killall` -- kill processes by name (e.g. Finder)
   - `pmset` -- manipulate power management settings
     - `displaysleepnow`
     - `sleepnow`
   - `caffeinate` -- prevent the system from sleeping on behalf of a utility (the assertion releases after the exit of the utility)
     - `-t timeout`
     - `-w pid`
     - `-i utility arguments...`
     - `-s utility arguments...` -- the assertion is valid only when on AC power
   - `chflags` -- change file flags
     - `hidden`
     - `schg` -- system immutable flag
     - `uchg` -- user immutable flag
   - launchpad icon number per row and column
     ```shell
     defaults write com.apple.dock springboard-columns -int 8; defaults write com.apple.dock springboard-rows -int 7; defaults write com.apple.dock ResetLaunchPad -bool TRUE; killall Dock
     ```

1. clear
   - clear to previous mark -- `command` `l`

1. ports -- `netstat -vanp tcp`
   - `-a` -- show the state of all sockets
   - `-n` -- Show network addresses as numbers
   - `-p` -- protocol

# Finder

1. show hidden files -- `command + shift + .`

1. Add selected Finder item to the Dock -- `^` `shift` `command` `t`

1. Add the selected item to the sidebar -- `^` `command` `t`

1. move after copy -- `option` `command` `v`

1. basic operations
   - rename -- `enter`
   - open -- `command` `o`
   - del -- `command` `del`
   - get info -- `command` `i`
   - show origin of alias -- `command` `r`
   - preview -- `space` or `^` `y`
     - with `option` to preview in fullscreen
   - new folder -- `shift` `command` `N`

1. move around folder tree
   - `command` `up arrow`
     - with `^` to open in new window
   - `command` `down arrow`

1. drag
   - drag only
   - drag with `command` -- move
   - drag with `option` -- copy
   - drag with `option` `command` -- alias

1. disclose all folder in list view -- `option` click the disclosure triangle

1. Select multiple items that are listed together -- Click the first item, then press the Shift key and click the last item. All items in between are included in the selection.

1. View in menu

1. search -- [Narrow your search results on Mac - Apple Support](https://support.apple.com/guide/mac-help/narrow-search-results-mh15155/10.15/mac/10.15)

# pkg and brew

1. sha
   ```shell
   openssl dgst -sha256 ./file
   ```

1. pkg -- `pkgutil`
   - uninstall
     ```shell
     pkgutil --pkgs # list all installed packages
     pkgutil --files the-package-name.pkg # list installed files
     pkgutil --pkg-info the-package-name.pkg # check the location
     cd / # assuming the package is rooted at /...
     pkgutil --only-files --files the-package-name.pkg | tr '\n' '\0' | xargs -n 1 -0 sudo rm -f
     pkgutil --only-dirs --files the-package-name.pkg | tail -r | tr '\n' '\0' | xargs -n 1 -0 sudo rmdir
     sudo pkgutil --forget the-package-name.pkg
     ```

1. Homebrew
   - `brew cask` -- apps
     - overwrite -- `brew cask install --force`
   - `brew cleanup`
   - `brew tap buo/cask-upgrade` for `brew cu`

# Chrome

1. drag text -- hold for a while
