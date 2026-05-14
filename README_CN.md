# Gradio 隧道工具

[English](README.md) | 简体中文

一个反向代理隧道工具，可以为任何本地 Web 服务提供公网访问能力，支持自定义子域名功能。

https://github.com/arkohut/gradio-tunneling/assets/39525455/f38b7db2-517b-4e30-b15e-8787485095d0

## 安装

`gradio-tunneling` 是一个命令行工具，推荐使用 [`pipx`](https://pipx.pypa.io/) 或 [`uv tool`](https://docs.astral.sh/uv/guides/tools/) 安装到独立环境，这样 `gradio-tun` 命令会注册到 `PATH`，又不会污染你项目的虚拟环境。

```sh
# 推荐：uv tool（速度快，已经在用 uv 的话零额外成本）
uv tool install gradio-tunneling

# 或者：pipx
pipx install gradio-tunneling

# 或者：直接 pip（也能用，但会装到当前环境里）
pip install gradio-tunneling
```

后续升级：

```sh
uv tool upgrade gradio-tunneling
# 或
pipx upgrade gradio-tunneling
```

安装完成后，PATH 中会出现两个等价的命令：

- `gradio-tun`：短名（本文档统一使用）
- `gradio-tunneling`：长名，为兼容旧用法保留

确认安装成功：

```sh
gradio-tun --help
```

## 运行隧道

端口号可以通过以下两种方式指定：

```sh
gradio-tun 7860 [--sd your-subdomain]
# 或者
gradio-tun --port 7860 [--sd your-subdomain]
```

- `PORT` 或 `--port PORT`：指定隧道的端口号
- `--sd`：（可选）指定自定义子域名。注意：出于安全考虑，您的输入会被转换为一个唯一的字符串。使用相同的 `--sd` 值将始终生成相同的唯一字符串。

示例：

```sh
# 使用位置参数指定端口
gradio-tun 7860

# 使用 --port 标志
gradio-tun --port 7860

# 使用自定义子域名
gradio-tun 7860 --sd mycustomsubdomain
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
