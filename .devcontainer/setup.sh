#!/bin/bash
set -e

ENV_GIT=".envs/.local/.git_config"

echo "Configurando o Git..."

if [ -f "$ENV_GIT" ]; then
    source "$ENV_GIT"

    git config --global user.name "$GIT_USER_NAME"
    git config --global user.email "$GIT_USER_EMAIL"

    echo "✅ Git configurado lendo o arquivo .env exclusivo!"
else
    echo "⚠️ Arquivo $ENV_GIT não encontrado!"
fi
