# Gradio 隧道工具

https://github.com/arkohut/gradio-tunneling/assets/39525455/f38b7db2-517b-4e30-b15e-8787485095d0

[English](README.md) | 简体中文

## 安装

```sh
pip install gradio-tunneling
```

## 运行隧道

端口号可以通过以下两种方式指定：

```sh
gradio-tunneling 7860 [--sd your-subdomain]
# 或者
gradio-tunneling --port 7860 [--sd your-subdomain]
```

- `PORT` 或 `--port PORT`：指定隧道的端口号
- `--sd`：（可选）指定自定义子域名。注意：出于安全考虑，您的输入会被转换为一个唯一的字符串。使用相同的 `--sd` 值将始终生成相同的唯一字符串。

示例：

```sh
# 使用位置参数指定端口
gradio-tunneling 7860

# 使用 --port 标志
gradio-tunneling --port 7860

# 使用自定义子域名
gradio-tunneling 7860 --sd mycustomsubdomain
# 这将生成一个带有唯一字符串的 URL（例如 abc123def...）
# 再次使用 "mycustomsubdomain" 将生成相同的唯一字符串
```

### 关于自定义子域名

当您使用 `--sd` 选项时：

- 您提供的子域名不会直接用于 URL
- 相反，它会被转换为一个唯一的字符串以确保安全
- 如果您之后使用相同的 `--sd` 值，您将获得相同的唯一字符串
- 这有助于您在保持安全性的同时获得一致的 URL

例如，如果您总是使用 `--sd myapp`，您每次都会得到相同的唯一子域名，这样可以让您的 URL 对用户来说是可预测的。

### 重要说明

生成的隧道 URL 将在 72 小时后过期。过期后，您需要重新启动隧道以获取新的 URL。如果您使用 `--sd` 自定义子域名，使用相同的值将在新 URL 中生成相同的子域名。
