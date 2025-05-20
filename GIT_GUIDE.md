# Git 操作指南

## 目錄
- [日常工作流程](#日常工作流程)
- [暫存區操作](#暫存區操作)
- [提交操作](#提交操作)
- [分支操作](#分支操作)
- [回滾和復原](#回滾和復原)
- [查看狀態和歷史](#查看狀態和歷史)

## 路徑參數說明

在 Git 命令中，路徑參數有特殊的含義：

```bash
.           # 當前目錄及其所有子目錄
./          # 同上，當前目錄
../         # 上一級目錄
*.js        # 當前目錄下所有 .js 文件
src/*.ts    # src 目錄下所有 .ts 文件
file.txt    # 特定的文件
```

例如：
```bash
# 添加文件到暫存區
git add .                  # 添加當前目錄及其子目錄的所有更改
git add *.js              # 只添加當前目錄的 js 文件
git add src/              # 添加 src 目錄下的所有更改

# 取消暫存
git restore --staged .     # 取消當前目錄及子目錄下所有文件的暫存
git restore --staged *.js  # 只取消 js 文件的暫存

# 丟棄更改
git restore .             # 丟棄當前目錄及子目錄下所有的更改
git restore src/*.ts      # 只丟棄 src 目錄下的 ts 文件的更改
```

使用建議：
1. 使用 `.` 時要注意它會影響所有子目錄
2. 如果只想操作特定文件，請明確指定文件名或使用通配符
3. 在執行命令前，可以用 `git status` 確認哪些文件會受影響

## 日常工作流程

### 基本工作流程
```bash
git status                   # 查看當前狀態
git add .                    # 添加更改到暫存區
git commit -m "提交信息"      # 提交更改
git push                     # 推送到遠程
```

### 分支合併工作流程

1. **正常的分支合併**（如 develop 合併到 main）：
```bash
# 1. 切換到目標分支（如 main）
git checkout main

# 2. 合併源分支（如 develop）
git merge develop           # 快速合併
# 或
git merge develop --no-ff   # 保留合併歷史

# 3. 推送到遠程
git push origin main
```

2. **處理提交歷史混亂的合併**（完全同步到目標分支）：
```bash
# 假設要讓 main 完全與 develop 一致
git checkout main          # 切換到目標分支
git reset --hard develop   # 強制指向與 develop 相同的提交
git push --force origin main  # 強制推送（謹慎使用）
```

### 分支管理最佳實踐

1. **開發新功能**：
```bash
git checkout -b feature/xxx develop  # 從 develop 創建功能分支
# 開發完成後
git checkout develop                 # 切回 develop
git merge feature/xxx               # 合併功能分支
```

2. **緊急修復**：
```bash
git stash                   # 保存當前工作
git checkout -b hotfix/xxx  # 創建修復分支
# 修復完成後
git checkout main          # 切換到主分支
git merge hotfix/xxx       # 合併修復
git checkout develop       # 切換回開發分支
git merge hotfix/xxx       # 同步修復到開發分支
git stash pop              # 恢復之前的工作
```

3. **保持分支同步**：
```bash
# 在功能分支上同步 develop 的更新
git checkout feature/xxx    # 切換到功能分支
git merge develop          # 合併 develop 的更新
```

### 注意事項
1. 合併前先確保本地分支是最新的
2. 大的功能改動建議使用 `--no-ff` 保留合併歷史
3. 使用 `--force` 推送時要特別小心，確保不會影響他人的工作
4. 合併後記得測試，確保功能正常
5. 養成經常性合併主分支更新的習慣，避免後期大量衝突

## 暫存區操作

### 添加到暫存區
```bash
git add .                    # 添加所有更改到暫存區
git add <文件名>             # 添加特定文件到暫存區
git add -p                   # 交互式添加，可以選擇部分更改
```

### 從暫存區移除
```bash
git reset                    # 取消所有暫存（不影響文件內容）
git reset <文件名>           # 取消特定文件的暫存
git restore --staged .       # 新版 Git 取消暫存的方式
```

### 查看暫存區
```bash
git diff --staged            # 查看已暫存的更改
git status                   # 查看當前狀態
```

## 提交操作

### 創建提交
```bash
git commit -m "提交信息"     # 創建新的提交
git commit -am "提交信息"    # 添加所有更改並提交（跳過暫存區）
```

### 修改提交
```bash
git commit --amend          # 修改最後一次提交的信息
git commit --amend --no-edit # 向最後一次提交添加新的更改，不修改信息
```

### 查看提交
```bash
git log                     # 查看提交歷史
git log --oneline          # 簡潔模式查看提交歷史
git show <commit-hash>      # 查看特定提交的詳細信息
```

## 分支操作

### 基本分支操作
```bash
git branch                  # 查看所有本地分支
git branch <分支名>         # 創建新分支
git checkout <分支名>       # 切換分支
git checkout -b <分支名>    # 創建並切換到新分支
git branch -d <分支名>      # 刪除分支（安全模式）
git branch -D <分支名>      # 強制刪除分支
```

### 分支重命名
```bash
git branch -m <舊名> <新名>  # 重命名分支
git branch -m <新名>         # 重命名當前分支
```

### 合併分支
```bash
git merge <分支名>          # 合併指定分支到當前分支
git merge --no-ff <分支名>  # 強制創建合併提交
git merge --abort          # 取消正在進行的合併
```

#### Fast-forward（快進）合併與 --no-ff 的區別

1. **Fast-forward 合併（預設行為）**：
```
      A---B---C (feature)
     /
D---E (main)
```
合併後：
```
D---E---A---B---C (main, feature)
```
- 當 main 分支沒有新的提交時，Git 直接將 main 指向 feature 的最新提交
- 不會創建新的合併提交
- 提交歷史是線性的
- 看不出來這些提交是來自哪個分支

2. **--no-ff（禁止快進）合併**：
```
      A---B---C (feature)
     /         \
D---E-----------M (main)
```
- 即使可以快進，也強制創建一個新的合併提交（M）
- 保留了分支的歷史記錄
- 可以清楚地看到哪些提交是來自特性分支
- 方便回滾整個特性分支的改動

使用建議：
1. 對於重要的特性分支開發，建議使用 `--no-ff`
2. 對於臨時性的 bugfix，使用預設的 fast-forward 即可
3. 在團隊開發中，`--no-ff` 有助於理解代碼的來源和歷史
4. 如果想保持清晰的 Git 歷史結構，建議在合併特性分支時總是使用 `--no-ff`

## 回滾和復原

### 復原工作目錄
```bash
git restore .              # 丟棄所有未提交的更改，將代碼恢復到最後一次 add 或 commit 的狀態（危險！無法恢復）
git restore --staged .     # 撤銷 git add，將文件從暫存區移回工作目錄（不改變文件內容）
git restore <文件名>       # 丟棄特定文件的更改
git checkout -- .          # 舊版本命令，效果等同於 git restore .
git checkout -- <文件名>   # 丟棄特定文件的未暫存更改
```

重要區別：
- `git restore .`：
  - 真正的"復原"操作
  - 會丟棄所有未提交的代碼更改
  - 將文件內容恢復到最後一次 add 或 commit 的狀態
  - 這個操作無法撤銷，請謹慎使用

- `git restore --staged .`：
  - 不是"復原"代碼，而是改變文件的狀態
  - 只是撤銷 git add 的操作
  - 將文件從暫存區移回工作目錄
  - 不會改變任何代碼內容
  - 完全安全的操作

使用建議：
1. 使用 `git restore --staged .` 來撤銷誤加入暫存區的文件
2. 使用 `git restore .` 時要非常小心，因為它會實際刪除你的代碼更改
3. 不確定時使用 `git status` 查看文件狀態
4. 如果想要安全地清理工作目錄，可以先 `git stash` 保存更改

### 回滾提交
```bash
git reset --soft HEAD^     # 回滾最後一次提交（保留更改在暫存區）
git reset --mixed HEAD^    # 回滾最後一次提交（保留更改在工作目錄）
git reset --hard HEAD^     # 完全回滾最後一次提交（丟棄更改）
```

### 回到特定提交
```bash
git reset --hard <commit-hash>  # 完全回到指定的提交
git checkout <commit-hash>      # 查看特定提交的代碼（會進入分離 HEAD 狀態）
```

## 查看狀態和歷史

### 狀態查看
```bash
git status                  # 查看當前狀態
git diff                    # 查看未暫存的更改
git diff --staged          # 查看已暫存的更改
git diff <commit1> <commit2> # 比較兩個提交
```

### 歷史查看
```bash
git log                     # 完整歷史
git log --oneline          # 簡潔歷史
git log --graph            # 圖形化顯示分支歷史
git reflog                 # 查看所有操作歷史（包括已回滾的提交）
```

## 常見問題處理

### 1. 意外提交了不想提交的文件
```bash
git reset --soft HEAD^     # 回滾提交但保留更改
# 然後重新選擇要提交的文件
```

### 2. 提交信息寫錯了
```bash
git commit --amend         # 修改最後一次提交的信息
```

### 3. 想回滾到之前的版本
```bash
git log --oneline         # 查看提交歷史
git reset --hard <commit-hash>  # 回到指定版本
```

### 4. 不小心刪除了分支
```bash
git reflog                # 查看操作歷史
git checkout -b <分支名> <commit-hash>  # 基於提交重新創建分支
```

## 建議的工作習慣

1. 經常使用 `git status` 查看當前狀態
2. 提交前使用 `git diff --staged` 檢查更改
3. 保持提交信息清晰明確
4. 定期推送到遠程備份
5. 重要操作前先創建分支
6. 不確定的操作先在本地測試

## 進階技巧

### 暫存工作區
```bash
git stash                 # 暫時保存所有未提交的更改（包括暫存和未暫存的）
git stash save "描述信息"  # 保存更改並添加描述
git stash list           # 查看所有已保存的 stash
git stash pop            # 恢復最近的 stash 並刪除它
git stash apply          # 恢復最近的 stash 但保留它
git stash drop           # 刪除最近的 stash
git stash clear          # 刪除所有 stash
```

stash 的主要用途：
1. 需要緊急切換分支處理其他事情時
2. 想要暫時回到乾淨的工作目錄
3. 在多個分支間臨時保存和移動更改

與 `git add` 的區別：
- `git add` 是為了提交，將更改放入暫存區
- `git stash` 是臨時保存所有未提交的更改，使工作目錄恢復乾淨

使用建議：
1. 在 stash 前先用 `git status` 確認要保存的內容
2. 使用 `git stash save "描述"` 添加清晰的說明
3. 定期清理不需要的 stash
4. 如果有多個 stash，使用 `git stash list` 查看後再恢復

### 遠程操作
```bash
git remote -v                 # 查看遠程倉庫
git remote add origin <URL>   # 添加遠程倉庫
git remote set-url origin <URL> # 修改遠程倉庫地址

# 獲取更新
git fetch                     # 獲取遠程更新但不合併
git pull                      # 獲取遠程更新並合併（相當於 fetch + merge）
git pull --rebase            # 使用 rebase 方式拉取更新

# 推送操作
git push                      # 推送當前分支到已設置的上游分支
git push origin <分支名>      # 推送到指定的遠程分支
git push -u origin <分支名>   # 推送並設置上游分支（之後可以直接用 git push）
git push --force             # 強制推送（危險！會覆蓋遠程歷史）
git push --force-with-lease  # 安全的強制推送（如果遠程有新提交會失敗）
```

### 分支追蹤和推送行為

1. **設置上游分支**：
```bash
# 方法一：在 push 時設置
git push -u origin <分支名>

# 方法二：直接設置
git branch --set-upstream-to=origin/<遠程分支名> <本地分支名>

# 方法三：創建新分支時直接設置追蹤
git checkout -b <本地分支名> origin/<遠程分支名>

# 查看分支追蹤狀態
git branch -vv
```

**為什麼允許不同名分支追蹤？**
- 提供更大的靈活性，適應不同的工作場景
- 允許多個開發者用不同的本地分支名追蹤同一個遠程分支
- 方便版本管理和團隊協作

常見場景：
```bash
# 場景一：多人協作同一個功能
git checkout -b my-feature origin/feature      # 你的本地分支
git checkout -b johns-feature origin/feature   # John 的本地分支
# 兩個不同的本地分支都可以追蹤和推送到 origin/feature

# 場景二：版本管理
git checkout -b stable origin/release-2.0      # 用簡單的本地名字追蹤規範的遠程分支名

# 場景三：臨時任務
git checkout -b hotfix-local origin/hotfix-2023-01  # 本地簡短名字，遠程完整名字
```

最佳實踐：
1. 如果是個人項目，保持本地和遠程分支同名會更直觀
2. 在團隊項目中，可以根據需要使用不同的本地分支名
3. 始終使用有意義的分支名，即使本地和遠程名字不同
4. 定期使用 `git branch -vv` 檢查分支追蹤關係

2. **更改默認推送行為**：
```bash
# 設置默認推送策略
git config --global push.default simple    # 只推送當前分支到其追蹤的上游分支
git config --global push.default current   # 推送當前分支到同名的遠程分支
git config --global push.default matching  # 推送所有有對應遠程分支的本地分支
```

3. **常見推送場景**：
```bash
# 首次推送新分支
git push -u origin <分支名>

# 已設置過上游分支，日常推送
git push

# 刪除遠程分支
git push origin --delete <分支名>

# 推送所有分支和標籤
git push --all origin
git push --tags
```

使用建議：
1. 首次推送分支時使用 `-u` 設置上游分支，後續可以直接 `git push`
2. 除非必要，避免使用 `--force`，優先使用 `--force-with-lease`
3. 推送前先 `git pull` 確保本地是最新的
4. 使用 `git branch -vv` 檢查分支追蹤關係
5. 如果不確定推送目標，使用完整命令 `git push origin <分支名>`

注意事項：
- `--force` 會覆蓋遠程歷史，在共享分支上極其危險
- 設置上游分支後，`git pull` 和 `git push` 都會變得更方便
- 不同的 `push.default` 設置會影響 `git push` 的行為
- 刪除遠程分支後，其他人需要使用 `git fetch --prune` 更新分支信息

記住：Git 是一個強大的工具，這些只是基礎操作。隨著使用的深入，您會逐漸發現更多有用的命令和技巧。建議保持良好的提交習慣，這樣即使出現問題也容易恢復。 