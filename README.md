# Gradio Tunneling

English | [简体中文](README_CN.md)

A tunneling tool that provides reverse proxy functionality for non-Gradio web services, allowing you to expose your local services to the internet with customizable subdomains.

https://github.com/arkohut/gradio-tunneling/assets/39525455/f38b7db2-517b-4e30-b15e-8787485095d0

## Setup

```sh
pip install gradio-tunneling
```

## Run tunnel

You can specify the port in two ways:

```sh
gradio-tun 7860 [--sd your-subdomain]
# or
gradio-tun --port 7860 [--sd your-subdomain]
```

- `PORT` or `--port PORT`: Specify the port number for the tunnel
- `--sd`: (Optional) Specify a custom subdomain. Note: For security reasons, your input will be converted into a unique string. Using the same `--sd` value will always generate the same unique string.

Examples:

```sh
# Using positional port argument
gradio-tun 7860

# Using --port flag
gradio-tun --port 7860

# With custom subdomain
gradio-tun 7860 --sd mycustomsubdomain
# This will generate a URL with a unique string (e.g., abc123def...)
# Using "mycustomsubdomain" again will generate the same unique string
```

### About Custom Subdomains

When you use the `--sd` option:

- The subdomain you provide won't be used directly in the URL
- Instead, it will be converted into a unique string for security
- If you use the same `--sd` value later, you'll get the same unique string
- This helps you get consistent URLs while maintaining security

For example, if you always use `--sd myapp`, you'll get the same unique subdomain each time, making your URL predictable for your users.

### Important Note

The generated tunnel URL will expire after 72 hours. After expiration, you'll need to restart the tunnel to get a new URL. If you're using a custom subdomain with `--sd`, using the same value will generate the same subdomain in the new URL.
