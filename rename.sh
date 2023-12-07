#!/bin/bash -e

# 公司名称
COMPANY_NAME=MyCompany
# 服务端项目名称
PROJ_NAME=TplApp
# 部署虚拟目录
CONTEXT_ROOT=tpl-app
# 新的服务端项目前缀（公司名称+项目名称, 特殊符号需要用 \ 进行转义）
SERVER_PREFIX="${COMPANY_NAME}.${PROJ_NAME}"
# 修改客户端相关文件
sed -i.bak "s/net-core-app/${CONTEXT_ROOT}/g" .package.json
sed -i.bak "s/net-core-app/${CONTEXT_ROOT}/g" .angular.json
sed -i.bak "s/net-core-app/${CONTEXT_ROOT}/g" .projects/web/src/app/app.module.ts
sed -i.bak "s/net-core-app/${CONTEXT_ROOT}/g" .projects/handset/src/app/app.module.ts
sed -i.bak "s/NetCoreApp/${PROJ_NAME}/g" .smartcode.yml
sed -i.bak "s/Beginor/${COMPANY_NAME}/g" .smartcode.yml
# 删除备份文件
find . -name '*.bak' -delete
# 提交一下客户端文件
git add *
git commit --amend -m "Rename to ${COMPANY_NAME}.${PROJ_NAME}"
