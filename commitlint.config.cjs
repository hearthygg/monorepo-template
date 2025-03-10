// type: 提交类型，常见值包括：
// feat: 新功能
// fix: 修复 bug
// docs: 文档更新
// style: 样式修改（不影响代码逻辑）
// refactor: 重构代码
// test: 添加或修改测试
// chore: 构建或工具变更
// scope（可选）：影响范围，比如模块名。
// subject: 简短的描述，首字母小写，不以句号结尾。
module.exports = {
  extends: ['@commitlint/config-conventional']
};