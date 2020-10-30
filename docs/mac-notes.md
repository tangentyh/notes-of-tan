# MacOS

## Miscellanea

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

## Commons

1. right click — `⌃` `click`

1. home / end
   - `fn` `←` and `→`
   - `⌘` `←` and `→` — move the insertion point
     - backwards / forwards in Chrome
   - `⌥` `↑` and `↓` — `ctrl` home / end when edit
     - first / last item in Finder
   - `⌘` `↑` and `↓` — `ctrl` `home` or `ctrl` `end` in Windows
     - move around folder in Finder

1. page up / down
   - `fn` `↑` and `↓`

1. `ctrl` `arrow` in Windows — `⌥` `←` and `→`

1. `⌘`
   - `⌘` `g` — find next, with `⇧` to find previous
     - `⌘` `e` in Chrome — use selection for find
   - `⌥` `⌘` `esc` — in the Apple menu
   - `⌘` `␣` — Spotlight
     - `⌘` `l` — dictionary
     - `⌘` — show path
     - [Spotlight keyboard shortcuts on Mac - Apple Support](https://support.apple.com/guide/mac-help/spotlight-keyboard-shortcuts-mh26783/mac)
   - `⌃` `⌘` `␣` — emojis and symbols
   - `⌃` `⌘` `d` — the definition of the selected word
   - Spelling
     - `⇧` `⌘` `:` — Display the Spelling and Grammar window
     - `⌘` `;` — Find misspelled words in the document.
   - `⌥` `⌘` `f` — Show or hide a toolbar in the app
   - `⌥` `⌘` `i` — Show or hide the inspector window
   - `⌘` `+`, `⌘` `-`, `⌘` `0` — zoom
   - `⇧` `⌘` `?` — help

### Edit

1. edit
   - backspace (`^?`) and delete
     - del — `fn` `delete`
     - `⌥` `delete`, `⌥` `backspace` — delete word
   - align
     - `⌃` `[` — left align
     - `⌃` `]` — right align
     - `⇧` `⌃` `\` — center align
   - from emacs
     - `⌃` `h`, `⌃` `d` — backward-delete-char, delete-char-or-list
     - `⌃` `k`
     - `⌃` `y` — yank
     - `⌃` `a`, `⌃` `e` — beginning-of-line, end-of-line
     - `⌃` `f`, `⌃` `b` — backward-char, forward-char
     - `⌃` `l` — Center the cursor or selection in the visible area
       - `clear` in Terminal
     - `⌃` `p`, `⌃` `n`
     - `⌃` `o` — Insert a new line after the insertion point, cursor stays
     - `⌃` `t` — swap character

1. edit in Terminal — `bindkey -M main`, `⌥` or `esc` (`^[`) as meta key
   - docs
     - [zsh: 18 Zsh Line Editor](http://zsh.sourceforge.net/Doc/Release/Zsh-Line-Editor.html)
     - [ANSI escape code - Wikipedia](https://en.wikipedia.org/wiki/ANSI_escape_code)
   - arguments — most commands support argument for repeating
     - `⌥` `number` — digit-argument
     - `⌥` `-` — neg-argument
   - movement
     - `⌥` left click
     - `^x` `⌃` `f` — vi-find-next-char
     - `^x` `⌃` `b` — vi-match-bracket
     - `⌥` `⇧` `|` (vim: `|`) — vi-goto-column, use with number argument
     - `⌥` `b`, `⌥` `f` — backward-word, forward-word
     - `⌃` `a`, `⌃` `e` — beginning-of-line, end-of-line
     - `⌃` `n`, `⌃` `p` — down-line-or-history, up-line-or-history
   - history
     - `⌥` `⇧` `<` (vim: `gg`), `⌥` `⇧` `>` — beginning-of-buffer-or-history, end-of-buffer-or-history
     - `⌃` `n`, `⌃` `p` — down-line-or-history, up-line-or-history
     - `⌥` `p`, `⌥` `n` — history-search-backward, history-search-forward
     - `^x` `⌃` `n` — infer-next-history, search in the history list for a line matching the current one and fetch the event following it
     - `⌥` `.`, `⌥` `-` — insert-last-word, use with positive and negative (can be `-0`) argument, loop through previous lines when used consecutively
     - `⌥` `,`, `⌥` `/` — \_history-complete-newer, \_history-complete-older, Complete words from the history
     - search
       - keymap — `bindkey -M isearch`
       - `⌃` `r`, `^x` `r` — history-incremental-search-backward, reverse search, a second `⌃` `r` recalls the previous search
       - `⌃` `s`, `^x` `s` — history-incremental-search-forward
       - supported functions
         - accept-*
         - backward kill or delete
         - history-incremental-search-forward, history-incremental-search-backward — find next occurrence or invert search
         - quote-insert
         - vi prefixed version of the above and vi-cmd-mode, vi-repeat-search, vi-rev-repeat-search
         - exit — send-break restores, movement commands retains
   - modifying text
     - kill
       - `⌃` `h`, `⌃` `d` — backward-delete-char, delete-char-or-list, in Terminal `exit` if no character when `⌃` `d`
       - `⌃` `w` or `⌥` `⌃` `h`, `⌥` `d` — backward-kill-word, kill-word
       - `⌃` `k`, `⌃` `u` — kill-line, kill-whole-line (remapped to backward-kill-line)
       - `^x` `⌃` `k` — kill-buffer
     - yank
       - `⌃` `y` — yank
       - `⌥` `y` — yank-pop, cycle though previously yanked
     - transpose
       - `⌃` `t` — transpose-chars
       - `⌥` `t` — transpose-words
     - case
       - `⌥` `c`, `⌥` `l` (remapped to `ls^J`) — capitalize-word, down-case-word
       - `⌥` `u` — up-case-word
     - join
       - `^x` `⌃` `j` — vi-join
     - selection region
       - `⌥` `w` — copy-region-as-kill
       - `^x`, `⌃` `x` — exchange-point-and-mark
       - `⌥` `"` — quote-region
       - `⌃` `@` — set-mark-command, Set the mark at the cursor position, also mapped to `⌃` `␣`
   - insert
     - `⌃` `i`, `⌥` `⌃` `i` — expand-or-complete, self-insert-unmeta, `\t`
     - `⌃` `m`, `⌥` `⌃` `m` — accept-line, self-insert-unmeta, `\r`
     - `⌃` `j`, `⌥` `⌃` `j` — accept-line, self-insert-unmeta, `\n`
     - `⌃` `v` — quoted-insert, control sequence, `⌃` `v` + `⌃` `h` types "^H", a literal backspace
     - `⌥` `.`, `⌥` `-` — insert-last-word, use with positive and negative (can be `-0`) argument, loop through previous lines when used consecutively
     - `⌥` `⌃` `-` — copy-prev-word
     - `⌥` `m` — copy-prev-shell-word
     - `⌥` `"` — quote-region
     - `⌥` `'` — quote-line
     - `^x` `⌃` `r` — [_read_comp](https://github.com/johan/zsh/blob/master/Completion/Base/Widget/_read_comp), set the variable `_read_comp` or insert if already set
     - `^x` `m` — _most_recent_file, supports globbing
   - mode
     - `^x` `⌃` `o` — overwrite-mode
     - `^x` `⌃` `v` — vi-cmd-mode
     - `^x` `⌃` `e` — edit-command-line, edit line in vim
     - `⌥` `x` — execute-named-cmd, keymap `bindkey -M command`
       - `⌥` `z` — execute-last-named-cmd
     - `⌃` `g`, `⌥` `⌃` `g` — send-break, Abort the current editor function: Abort the research and restore the original line
     - `⌃` `l` — clear-screen
     - buffer — registers in vim
       - the ‘yank’ buffer `"0`, the nine ‘queued’ buffers `"1` to `"9` — If no buffer is specified for a cut or change command, `"1` is used, and the contents of `"1` to `"8` are each shifted along one buffer; the contents of `"9` is lost. If no buffer is specified for a yank command, `"0` is used
       - the 26 ‘named’ buffers `"a` to `"z` — If a named buffer is specified using a capital, the newly cut text is appended to the buffer instead of overwriting it
       - the ‘black hole’ buffer `"_` — When using the `"_` buffer, nothing happens. This can be useful for deleting text without affecting any buffers
   - completion
     - `⌃` `d` — delete-char-or-list, If the cursor is at the end of the line, list possible completions for the current word
     - `⌥` `⌃` `d` — list-choices
     - `tab`, `⌃` `i` — expand-or-complete
     - `^x` `n` — _next_tags, basically same as `tab`?
     - `⌃` `@` — autosuggest-accept (also mapped to `⌃` `␣`)
       - deprecated — use below instead
       - accept — history-search-backward, forward-char, end-of-line
       - partial accept — forward-word
     - spelling
       - `⌥` `$`, `⌥` `s` — spell-word, Attempt spelling correction on the current word
       - `^x` `c` — _correct_word, spell correction, with choice selection
   - expand or print
     - `tab` — expand-or-complete
     - `⌥` `␣`, `⌥` `!` — expand-history (`!!` for example)
     - `^x` `⇧` `*`, `^x` `e` — expand-word (`$PATH` expands to the path), _expand_word (with completion selection)
     - `^x` `g`, `^x` `d` — list-expand, _list_expansions, `echo` that word
     - `^x` `a` — _expand_alias
     - `^x` `=` — `ga` in vim, what-cursor-position, print char code
   - accept or buffer stack
     - `⌃` `m`, `⌃` `j` — accept-line
     - `⌃` `o` — accept-line-and-down-history, Executes the found command from history, and fetch the next line relative to the current line from the history for editing
     - `⌥` `a` — accept-and-hold, Push the contents of the buffer on the buffer stack and execute it
     - `⌃` `q`, `⌥` `q` — push-line, remapped to push-line-or-edit
     - `⌥` `h` — run-help, Push the buffer onto the buffer stack, and execute the command `run-help cmd`, where cmd is the current command, `run-help` is normally aliased to `man`
     - `⌥` `⇧` `?` — which-command, push current and `which-command cmd`, `which-command` is normally aliased to `whence`
     - `⌥` `g` — get-line, Pop the top line off the buffer stack and insert it at the cursor position
   - undo
     - `⌃` `-`, `^x` `u`, `^x` `⌃` `u` — undo
     - `⌃` `r` in vim — redo

## System

1. navigation — snap aware, in System Preferences > Keyboard > Shortcuts > Keyboard
   - switch navigation on / off — `⌃` `F1`
   - menu bar navigation — `⌃` `F2`
   - dock navigation — `⌃` `F3`
     - hide dock — `⌥` `⌘` `d`
   - move focus to active or next window — `^` `F4`
   - move focus to window toolbar — `^` `F5`
   - move focus to the floating window — `^` `F6`
   - change the way Tab moves focus — `^` `F7`
   - move focus to status bar — `^` `F8`

1. windows
   - `⌘` `h` — Hide the windows of the front app. Press `Command-Option-H` to view the front app but hide all other apps.
     - invisible in mission control
   - `⌘` `m` — Minimize the front window to the Dock. Press `Command-Option-M` to minimize all windows of the front app.
     - `⌘` `tab` can switch to a minimized app but windows of the app will stay minimized
     - invisible in mission control
   - `⌘` `w`
     - `⌥` `⌘` `w` — all windows
     - `⇧` `⌘` `w` — all tabs of this window
   - `⌃` `⌘` `f` — fullscreen
   - `⌘` `tab` — app switcher
     - can use arrow keys to switch and show application windows
     - use `h` to hide and `q` to `quit`
     - drag aware
   - `⌘` `~`
     - switch between windows of the same app
     - switch backwards when `⌘` `tab`
   - `⌃` `arrow`
     - mission control
     - application windows — snap aware
   - open new via double clicking
     - with `⌘` — in a new tab / window
     - with `⌥` — Open the item in a separate window, then close the original window
   - drag app to upper menu bar — mission control
   - scroll bar
     - click — page up / down
     - `⌥` and click — scroll to
   - [rectangle](https://github.com/rxhanson/Rectangle) app
   - virtual desktops
   - show launchpad and show desktop
     - show launchpad — `⌃` `F10`, in System Preferences > Keyboard > Shortcuts > Launchpad & Dock
     - show desktop — in System Preferences > Mission Control

1. force quit app — `⌥` `⌘` `esc`

1. input method
   - change order of input sources — tbd
   - emoji, Keyboard viewer — in the input menu, or `⌃` `⌘` `␣`
   - popup for accented alphabet — hold the key
     - disable popup — `defaults write -g ApplePressAndHoldEnabled -bool false`
   - alternative keyboard — hold `⌥`, optionally `shift`
     - show alternative keyboard layout — System Preferences > Keyboard > Input Sources, hold `⌥` key
     - [dead key](https://en.wikipedia.org/wiki/Dead_key)
       - `⌥` `e` — á, é, í, ó, ú
       - `⌥` `~` — à, è, ì, ò, ù
       - `⌥` `u` — ä, ë, ï, ö, ü, ÿ
       - `⌥` `i` — â, ê, î, ô, û
       - `⌥` `n` — ã, õ, ñ
       - `⌥` `c` — ç
   - unicode hex input — hold `⌥` to input chars by unicode hex

1. boot start
   - login items
   - plist — `launchctl list`, `launchctl unload`
     - Apple daemons, agents only — `/System/Library/LaunchDaemons`, `/System/Library/LaunchAgents`
       - stop Apple Music from responding to media play button (also affects other apps when using external keyboard)
         ```shell
         launchctl unload -w /System/Library/LaunchAgents/com.apple.rcd.plist
         ```
     - 3rd party processes — `/Library/LaunchDaemons`
     - 3rd agents — `/Library/LaunchAgents`, `~/Library/LaunchAgents`
     - obsolete — `/Library/StartupItems` and `/System/Library/StartupItems`
   - kernal extension (kext) — `/System/Library/Extensions`
   - cron job — `cron`

1. volume
   - `⌥` `⇧` `volume` — Adjust the sound volume in smaller steps
     - also applies to brightness, with `⌃` for external display (if supported)
     - also applies to keyboard brightness

1. screenshot
   - with `⌃` to save to clipboard
   - `⇧` `⌘` `3` — whole screen
   - `⇧` `⌘` `4` — selection
   - `⇧` `⌘` `5` — general
   - `⇧` `⌘` `6` — touch bar

### Accessibility

1. tts
   - `⌥` `esc`

## Terminal

1. meta key

1. zsh
   - `upgrade_oh_my_zsh`

1. cli
   - `open` — opens each file using the default application for that file
     ```shell
     open [-e] [-t] [-f] [-W] [-R] [-n] [-g] [-h] [-s <partial SDK name>][-b <bundle identifier>] [-a <application>] [filenames] [--args arguments]
     ```
     - open in Finder if directory
     - `-a <application>` — Opens with the specified application
       ```shell
       open -a Preview file # open in preview
       ```
     - `-e` — Opens with TextEdit
   - `defaults` — like registry in Windows
     - location — `~/Library/Preferences`, `/Library/Preferences`
     - mouse acceleration — `defaults write .GlobalPreferences com.apple.mouse.scaling -1`
     - hidden files — `defaults write com.apple.finder AppleShowAllFiles -bool true`
     - power chime — `defaults write com.apple.PowerChime ChimeOnAllHardware -bool false && killall PowerChime`
   - ip — `ifconfig`

1. command utilities
   - `say` — text to speech
   - `killall` — kill processes by name (e.g. Finder)
   - `pmset` — manipulate power management settings
     - `displaysleepnow`
     - `sleepnow`
   - `caffeinate` — prevent the system from sleeping on behalf of a utility (the assertion releases after the exit of the utility)
     - `-t timeout`, in seconds
     - `-w pid`
     - `-i utility arguments...`
     - `-s utility arguments...` — the assertion is valid only when on AC power
   - `chflags` — change file flags
     - `hidden`
     - `schg` — system immutable flag
     - `uchg` — user immutable flag
   - launchpad icon number per row and column
     ```shell
     defaults write com.apple.dock springboard-columns -int 8; defaults write com.apple.dock springboard-rows -int 7; defaults write com.apple.dock ResetLaunchPad -bool TRUE; killall Dock
     ```

1. clear
   - clear to previous mark — `⌘` `l`

1. ports — `netstat -vanp tcp`
   - `-a` — show the state of all sockets
   - `-n` — Show network addresses as numbers
   - `-p` — protocol

## Finder

1. show hidden files — `command + shift + .`

1. Add selected Finder item to the Dock — `⌃` `⇧` `⌘` `t`

1. Add the selected item to the sidebar — `⌃` `⌘` `t`

1. move after copy — `⌥` `⌘` `v`

1. basic operations
   - rename — `enter`
   - open — `⌘` `o`
   - del — `⌘` `del`
   - get info — `⌘` `i`
   - show origin of alias — `⌘` `r`
   - preview — `␣` or `⌃` `y`
     - with `⌥` to preview in fullscreen
   - new folder — `⇧` `⌘` `N`

1. move around folder tree
   - `⌘` `up arrow`
     - with `⌃` to open in new window
   - `⌘` `down arrow`

1. drag
   - drag only
   - drag with `⌘` — move
   - drag with `⌥` — copy
   - drag with `⌥` `⌘` — alias

1. disclose all folder in list view — `⌥` click the disclosure triangle

1. Select multiple items that are listed together — Click the first item, then press the Shift key and click the last item. All items in between are included in the selection.

1. View in menu

1. search — [Narrow your search results on Mac - Apple Support](https://support.apple.com/guide/mac-help/narrow-search-results-mh15155/10.15/mac/10.15)

1. paste image from clipboard — open preview.app, in menu File -> New from Clipboard

## pkg and brew

1. SHA
   ```shell
   openssl dgst -sha256 ./file
   ```
   ```shell
   shasum -a 256 filename
   ```

1. pkg — `pkgutil`
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
   - `brew cask` — apps
     - overwrite — `brew cask install --force`
   - `brew cleanup`
   - `brew tap buo/cask-upgrade` for `brew cu`
   - install older version
     1. `cd` to `brew --repo homebrew/cask`
     1. `git log ./Casks/visual-studio-code.rb`
     1. `git checkout b9381533f8c8af449c8cb05103afc8418fcf5e4e`
     1. `brew cask reinstall visual-studio-code`
     1. `git switch master`

1. appleID association to app — `/path_to_app/Contents/_MASReceipt`

## Chrome

1. drag text — hold for a while
