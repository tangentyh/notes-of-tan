# Miscellanea

1. docs
   - [Mac keyboard shortcuts - Apple Support](https://support.apple.com/en-us/HT201236)
   - [Mac tips for Windows switchers - Apple Support](https://support.apple.com/en-us/HT204216)
   - [What’s it called on my Mac? - Apple Support](https://support.apple.com/guide/mac-help/whats-it-called-on-my-mac-cpmh0038/mac)

1. customize
   - [pqrs-org/Karabiner-Elements: Karabiner-Elements is a powerful utility for keyboard customization on macOS Sierra (10.12) or later.](https://github.com/pqrs-org/Karabiner-Elements)

# Commons

1. del -- `fn` `delete`

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
   - `command` `space`
   - `^` `command` `space` -- emojis and symbols
   - `^` `command` `d` -- the definition of the selected word
   - Spelling
     - `shift` `command` `:` -- Display the Spelling and Grammar window
     - `command` `;` -- Find misspelled words in the document.
   - `option` `command` `f` -- Show or hide a toolbar in the app
   - `option` `command` `i` -- Show or hide the inspector window
   - `command` `+`, `command` `-`, `command` `0` -- zoom
   - `shift` `command` `?` -- help

1. edit
   - `option` `delete`, `option` `backspace` -- delete word
   - `^` `h`, `^` `d`
     - if no character when `^` `d` -- `exit`
   - `^` `u`, `^` `k`
     - `^` `u` generally only in Terminal
   - `^` `a`, `^` `e`
   - `^` `f`, `^` `b`
   - `^` `l` -- Center the cursor or selection in the visible area
     - `clear` in Terminal
   - `^` `p`, `^` `n`
   - `^` `o` -- Insert a new line after the insertion point
   - `^` `t` -- swap character
   - Terminal only
     - `^` `i` -- tab
     - `^` `j` -- enter
     - `^` `v` -- control sequence, `^` `v` + `^` `h` types "^H", a literal backspace
     - search
       - `^` `r` -- reverse search, a second `^` `r` recalls the previous search
       - `^` `s` -- search forwards
       - `^` `g` -- Abort the research and restore the original line
       - `^` `o` -- Executes the found command from history, and fetch the next line relative to the current line from the history for editing
   <!-- - align
     - `^` `[` -- left align
     - `^` `]` -- right align
     - `shift` `^` `\` -- center align -->

# System

1. navigation -- snap aware, in System Preferences > Keyboard > Shortcuts > Keyboard
   - switch navigation on / off -- `^` `F1`
   - menu bar navigation -- `^` `F2`
   - dock navigation -- `^` `F3`
     - hide dock -- `option` `command` `d`

1. windows
   - `Command-H` -- Hide the windows of the front app. Press `Command-Option-H` to view the front app but hide all other apps.
     - invisible in mission control
   - `Command-M` -- Minimize the front window to the Dock. Press `Command-Option-M` to minimize all windows of the front app.
     - `command` `tab` can switch to a minimized app but windows of the app will stay minimized
     - invisible in mission control
   - `command` `w`
     - `command` `option` `w` -- all windows
     - `command` `shift` `w` -- all tabs of this window
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

1. force quit app -- `option` `command` `esc`

1. input method
   <!-- - change order of input sources -- &#x2318; -->
   - change order of input sources -- tbd
   - emoji, Keyboard viewer -- in the input menu, or `^` `command` `space`
   - alternative keyboard -- hold `option`
     - show alternative keyboard layout -- System Preferences > Keyboard > Input Sources, hold `option` key
     - [dead key](https://en.wikipedia.org/wiki/Dead_key)
       - `option` `e` -- á, é, í, ó, ú
       - `option` `~` -- à, è, ì, ò, ù
       - `option` `u` -- ä, ë, ï, ö, ü, ÿ
       - `option` `i` -- â, ê, î, ô, û
       - `option` `n` -- ã, õ, ñ
       - `option` `c` -- ç

1. boot start
   - login items
   - plist -- `launchctl list`, `launchctl unload`
     - Apple daemons, agents only -- `/System/Library/LaunchDaemons`, `/System/Library/LaunchAgents`
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
   - `command` `shift` `5` -- general
   - `command` `shift` `6` -- touch bar

1. `defaults`

## Accessibility

1. tts
   - `alt` `esc`

# Terminal

1. meta key

1. zsh

1. [tbd](https://zhuanlan.zhihu.com/p/34497527)

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

1. preview -- `space` or `^` `y`
   - with `option` to preview in fullscreen

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

1. `brew cask` -- apps
   - `overwrite` -- `brew cask install --force`

# Chrome

1. drag text -- hold for a while

# 3rd party Apps
