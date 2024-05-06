# To make new secret key

<code>openssl rand -hex 32</code>

# To setup server

## With reload (for development)

<code>granian --interface asgi --reload --host 127.0.0.1 --port 1121 {{path_to_API.py}:app, Example Photofox/Alex/backend/API:app}</code>

## Without reload

<code>granian --interface asgi --host {your_host} --port {your_port} {{path_to_API.py}:app }</code>