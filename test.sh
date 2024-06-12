#!/bin/bash

# 遍历 src 目录下所有 .module.less 文件
find ./src -type f -name '*.module.less' | while read -r file; do
  # 获取文件名（不包括扩展名）
  base_name=$(basename "$file" .module.less)
  dir_name=$(dirname "$file")

  # 新文件名
  new_file="${dir_name}/${base_name}.module.scss"

  # 重命名文件
  mv "$file" "$new_file"

  # 在整个 src 目录中替换对 .module.less 文件的引用
  grep -rl "${base_name}.module.less" ./src | while read -r ref_file; do
    sed -i "s/${base_name}\.module\.less/${base_name}\.module\.scss/g" "$ref_file"
  done
done

echo "重命名和替换操作完成。"
