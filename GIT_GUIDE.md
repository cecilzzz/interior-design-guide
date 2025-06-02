# Git 操作指南

## 目錄
- [路徑參數說明]（#路徑參數說明）
- [Git 工作區狀態詳解]（#Git 工作區狀態詳解）
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

## Git 工作區狀態詳解

### 三個工作區域
Git 有三個主要的工作區域：
1. **Working Directory（工作目錄）**：你實際編輯文件的地方
2. **Staging Area（暫存區）**：準備提交的文件快照
3. **Repository（倉庫）**：已提交的歷史記錄

### `git status` 的不同狀態顯示

#### 1. "working tree clean"
```bash
# 顯示：
On branch main
nothing to commit, working tree clean
```
**含義**：
- 工作目錄與最後一次 commit 完全一致
- 暫存區也是空的（沒有用 git add 添加任何文件）
- 沒有任何未追蹤的新文件

#### 2. 暫存區有內容，工作區乾淨
```bash
# 顯示：
On branch main
Changes to be committed:
  (use "git restore --staged <file>..." to unstage)
        modified:   file.txt
```
**含義**：
- 有文件在暫存區等待提交
- 工作目錄的文件與暫存區的文件一致
- **不會顯示** "working tree clean"

#### 3. 工作區有修改，暫存區為空
```bash
# 顯示：
On branch main
Changes not staged for commit:
  (use "git add <file>..." to update what will be committed)
  (use "git restore <file>..." to discard changes in working directory)
        modified:   file.txt
```

#### 4. 暫存區和工作區都有內容
```bash
# 顯示：
On branch main
Changes to be committed:
        modified:   file.txt

Changes not staged for commit:
        modified:   file.txt
```
**含義**：同一個文件在暫存區有一個版本，工作區又有新的修改

#### 5. 有未追蹤的文件
```bash
# 顯示：
On branch main
Untracked files:
  (use "git add <file>..." to include in what will be committed)
        newfile.txt

nothing added to commit but untracked files present (use "git add" to track)
```

### 關鍵理解點

1. **"working tree clean" 的條件**：
   - 工作目錄 = 最後一次 commit
   - 暫存區為空
   - 沒有未追蹤文件

2. **暫存區有內容時**：
   - 即使工作目錄沒有新修改
   - 也**不會**顯示 "working tree clean"
   - 會顯示 "Changes to be committed"

3. **狀態檢查命令**：
```bash
git status              # 查看詳細狀態
git status --short      # 簡潔格式
git status --porcelain  # 機器可讀格式
```

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
git commit --amend -m "新的 commit 訊息"         # 修改最後一次提交的信息
git commit --amend --no-edit # 向最後一次提交添加新的更改，不修改信息
```

### 查看提交
```bash
git log                     # 查看提交歷史
git log --oneline          # 簡潔模式查看提交歷史
git show <commit-hash>      # 查看特定提交的詳細信息
```

## 分支操作

### 分支創建與歷史繼承

#### 分支創建的歷史繼承原理

1. **基於當前分支創建新分支**：
```bash
git checkout -b new_branch    # 從當前分支創建新分支
# 或
git branch new_branch          # 創建新分支
git checkout new_branch        # 切換到新分支
```

2. **歷史繼承的工作原理**：
- 新分支會**完全繼承**創建時的提交歷史
- 新分支是原分支的一個**指針**，指向創建分支時的最後一個提交
- 新分支可以**獨立**於原分支進行後續開發
- 新的提交不會影響原分支的歷史

3. **分支創建示意圖**：
```
    A---B---C (main)
         \
          D---E (new_branch)
```

#### 分支創建的詳細行為

1. **完全繼承歷史**
   - 新分支包含原分支在創建時之前的所有提交
   - 新分支從原分支分叉點開始可以獨立發展
   - 不會複製原分支之後的提交

2. **輕量級分支**
   - Git 的分支創建非常輕量
   - 只是創建一個指向特定提交的指針
   - 不會複製整個代碼倉庫，只記錄分支信息

3. **獨立開發**
   - 在新分支上的提交不會影響原分支
   - 可以自由地在新分支上進行開發和實驗

#### 實際操作示例

```bash
# 查看當前分支
git branch

# 創建並切換到新分支
git checkout -b feature/new_feature

# 在新分支上開發
git add .
git commit -m "在新分支上的第一個提交"

# 查看分支歷史
git log --graph --oneline --all
```

#### 常見使用場景

1. **功能開發**：為新功能創建獨立的開發分支
2. **實驗性改動**：嘗試新的代碼實現
3. **bug 修復**：從主分支創建修復分支

#### 注意事項
- 創建分支是非常輕量和快速的操作
- 不需要擔心分支創建會佔用大量存儲空間
- 建議為每個功能或修復創建獨立的分支

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

## Git 內部機制深度解析

### Git 文件追蹤的工作原理

#### 1. SHA-1 哈希機制
Git 使用 SHA-1 哈希算法來追蹤文件變更：

```bash
# Git 為每個文件內容計算唯一的哈希值
文件內容 → SHA-1 算法 → 40位哈希值 (如: a1b2c3d4e5f6...)
```

**關鍵特點**：
- 相同內容 = 相同哈希值
- 內容有任何變化 = 完全不同的哈希值
- 哈希值作為文件的「指紋」

#### 2. Git 的三層存儲結構

```
工作目錄 (Working Directory)
    ↓
暫存區 (Staging Area/Index)
    ↓
Git 倉庫 (.git/objects/)
```

#### 3. 文件變更檢測流程

1. **初始狀態**：
```bash
# Git 記錄文件的元數據
文件路徑: public/logo.png
文件大小: 12253 bytes
修改時間: 2024-06-03 03:41
SHA-1 哈希: a1b2c3d4e5f6...
```

2. **檢測變更時**：
```bash
git status  # 觸發檢測流程

# Git 的檢測步驟：
1. 檢查文件修改時間 → 如果沒變，跳過
2. 檢查文件大小 → 如果沒變，可能跳過
3. 計算文件哈希值 → 與記錄的哈希比較
4. 哈希不同 → 文件已變更
```

#### 4. 成本優化策略

**Git 的聰明之處**：

1. **時間戳優化**：
   - 先檢查文件修改時間
   - 時間沒變 → 直接跳過哈希計算
   - 大幅減少不必要的計算

2. **增量存儲**：
   - Git 不存儲完整文件副本
   - 使用「對象」(objects) 系統
   - 相同內容只存儲一次

3. **Pack 文件壓縮**：
   - 定期將小對象打包成 pack 文件
   - 使用差異壓縮算法
   - 大幅節省存儲空間

#### 5. 實際成本分析

**計算成本**：
```bash
# 對於一個 1MB 的文件
SHA-1 計算時間: ~1-2 毫秒 (現代 CPU)
磁盤讀取時間: ~5-10 毫秒 (SSD)
總時間: 非常短，用戶感覺不到
```

**存儲成本**：
```bash
# Git 的存儲效率
原始項目大小: 100MB
.git 目錄大小: 通常 20-30MB (包含完整歷史)
壓縮率: 70-80%
```

#### 6. 為什麼這樣設計？

1. **內容導向**：
   - Git 關心的是內容，不是文件名
   - 重命名文件不會增加存儲成本
   - 相同內容的文件共享存儲

2. **完整性保證**：
   - SHA-1 哈希幾乎不可能碰撞
   - 任何數據損壞都能被檢測到
   - 提供強大的數據完整性保證

3. **分佈式需求**：
   - 每個克隆都是完整的倉庫
   - 不依賴中央服務器
   - 離線工作能力

#### 7. 與其他版本控制系統的對比

| 特性 | Git | SVN | CVS |
|------|-----|-----|-----|
| 追蹤方式 | 內容哈希 | 文件路徑 + 版本號 | 文件路徑 + 時間戳 |
| 存儲方式 | 對象數據庫 | 差異文件 | 完整副本 |
| 重命名檢測 | 自動 | 手動標記 | 不支持 |
| 離線能力 | 完全支持 | 有限 | 不支持 |

#### 8. 實際驗證 Git 的效率

```bash
# 查看 Git 對象
git cat-file -p HEAD:public/logo.png | wc -c

# 查看存儲統計
git count-objects -v

# 查看 pack 文件效率
git gc --aggressive --prune=now
```

#### 9. Git 的差異壓縮機制深度解析

**Git 對不同類型文件的處理策略**：

##### A. 文本文件的差異壓縮
```bash
# 原始文件 v1
function hello() {
    console.log("Hello");
}

# 修改後 v2  
function hello() {
    console.log("Hello World");
}

# Git 存儲方式：
base: 完整的 v1 內容
delta: - console.log("Hello");
       + console.log("Hello World");
```

##### B. 二進制文件的差異壓縮
```bash
# 對於圖片、音頻、視頻等二進制文件
logo_v1.png (50KB) → base object
logo_v2.png (52KB) → delta: 只存儲與 v1 的二進制差異

# 即使是二進制文件，Git 也能找到相似的字節序列！
```

##### C. 壓縮效果對比

**文本文件**（效果最佳）：
```bash
原始大小: 100KB
壓縮後: 5-10KB
壓縮率: 90-95%
```

**圖片文件**（效果中等）：
```bash
# 相似圖片（如 logo 的小修改）
原始大小: 50KB + 52KB = 102KB
壓縮後: 50KB + 3KB = 53KB
壓縮率: 48%

# 完全不同的圖片
壓縮率: 10-20%（主要靠 zlib 壓縮）
```

**已壓縮文件**（效果有限）：
```bash
# ZIP、JPG、MP4 等已壓縮格式
壓縮率: 5-15%（因為已經壓縮過了）
```

#### 10. Git 差異算法的工作原理

##### A. 二進制差異檢測
```bash
# Git 使用滑動窗口算法
文件A: [字節1][字節2][字節3]...[字節N]
文件B: [字節1][字節X][字節3]...[字節N]

# 找到相同的字節序列
相同部分: 字節1, 字節3-N
差異部分: 字節2 → 字節X
```

##### B. Delta 壓縮示例
```bash
# 假設你的 logo 只是改了顏色
原始 logo: 50KB
新 logo:   52KB

# Git 的處理：
1. 找到相同的像素區域（90%）
2. 只存儲不同的像素數據（10%）
3. 最終 delta: 可能只有 2-3KB！
```

#### 11. 實際驗證差異壓縮效果

```bash
# 查看 pack 文件的壓縮統計
git verify-pack -v .git/objects/pack/pack-*.idx | head -20

# 查看特定文件的存儲方式
git cat-file -s <文件的SHA-1>  # 查看對象大小

# 強制重新打包以獲得最佳壓縮
git gc --aggressive
```

#### 12. 為什麼 Git 這麼聰明？

##### A. 內容感知壓縮
- Git 不只是簡單的文件壓縮
- 會分析文件內容的相似性
- 跨文件、跨版本尋找重複內容

##### B. 多層壓縮策略
```bash
第一層: 內容去重（相同內容只存一份）
第二層: 差異壓縮（相似內容存差異）
第三層: zlib 壓縮（最終的字節壓縮）
```

##### C. 智能基準選擇
```bash
# Git 會選擇最佳的 base 對象
不一定是前一個版本！

例如：
v1 → v2 → v3 → v4
如果 v4 和 v1 更相似，Git 會用 v1 作為 base
```

#### 13. 實際案例分析

**你的 logo 替換案例**：
```bash
# 假設情況
舊 logo: akio-hasegawa-dark.png (12KB)
新 logo: akio-hasegawa-dark.png (12KB，但內容不同)

# Git 的處理
1. 檢測到內容變更（SHA-1 不同）
2. 分析二進制差異
3. 如果相似度高：存儲為 delta
4. 如果完全不同：存儲為新對象

# 最終存儲可能只增加 2-5KB！
```

#### 14. Git vs 其他壓縮方案

| 方案 | 壓縮範圍 | 效果 | 智能程度 |
|------|----------|------|----------|
| ZIP/RAR | 單個文件 | 中等 | 低 |
| Git Pack | 整個倉庫歷史 | 極佳 | 極高 |
| rsync | 文件同步 | 好 | 中等 |
| 專業備份軟件 | 備份集 | 好 | 高 |

### 總結：Git 的「黑魔法」

Git 的差異壓縮不只是技術，更像是藝術：
- **跨時間**：不同版本間的差異壓縮
- **跨空間**：不同文件間的內容去重  
- **跨類型**：文本和二進制文件都能處理
- **自適應**：根據內容特性選擇最佳策略

這就是為什麼一個包含完整歷史的 Git 倉庫，往往比單純的文件備份還要小的原因！ 