#!/bin/bash
# ==============================================================================
# Script para montar la Carpeta Compartida de VirtualBox en la VM Ubuntu
# Cafe Boreal S.R.L. (UTN ITI-522)
# ==============================================================================

echo "📁 Montando carpeta compartida 'praEXAM_share' entre Windows 11 y la VM..."

TARGET_DIR="${1:-$HOME/praEXAM}"

mkdir -p "$TARGET_DIR"

# 1. Agregar usuario actual al grupo vboxsf para permisos de acceso
sudo usermod -aG vboxsf "$USER" 2>/dev/null || true

# 2. Montar el recurso compartido vboxsf
if sudo mount -t vboxsf praEXAM_share "$TARGET_DIR"; then
    echo "✅ Carpeta compartida montada exitosamente en: $TARGET_DIR"
    echo "📄 Contenido sincronizado desde Windows 11:"
    ls -l "$TARGET_DIR"
else
    echo "⚠️ Verifique que VirtualBox Guest Additions este instalado en la VM."
fi
