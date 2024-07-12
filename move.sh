#!/bin/bash


current_version=$(cat "app\.version")
echo -e "当前版本 \033[0;32m$current_version\033[0m"

mkdir -p "backup"

if [[ "$current_version" == "server" ]]; then
    echo -e "开始替换为 \033[0;32mclient\033[0m"

    mapfile -t files < <(find "./local" -type f)

    for file in "${files[@]}"; do
        basefile="${file/"./local/"/""}"
        # echo "$basefile"
        if [[ -f "app/$basefile" ]]; then
            echo -e "File exists: \033[0;32mapp/$basefile\033[0m"
            mkdir -p "backup/$(dirname "$basefile")"
            mv "app/$basefile" "backup/$basefile"
            echo -e "File moved to backup: \033[0;32mbackup/$basefile\033[0m"
            cp "$file" "app/$basefile"
        else
            echo -e "File does not exist: \033[0;31mapp/$basefile\033[0m"
            cp "$file" "app/$basefile"
        fi
    done

else
    echo -e "开始恢复为 \033[0;32mserver\033[0m"

    mapfile -t files < <(find "./local" -type f)
    for file in "${files[@]}"; do
        basefile="${file/"./local/"/""}"
        # echo "$basefile"
        if [[ -f "backup/$basefile" ]]; then
            echo -e "File exists: \033[0;32mbackup/$basefile\033[0m"
            mv "backup/$basefile" "app/$basefile"
            echo -e "File restored to app: \033[0;32mapp/$basefile\033[0m"
        else
            echo -e "File does not exist: \033[0;31mbackup/$basefile\033[0m"
            rm "app/$basefile"
            echo -e "File deleted: \033[0;31mapp/$basefile\033[0m"
        fi
    done
fi

