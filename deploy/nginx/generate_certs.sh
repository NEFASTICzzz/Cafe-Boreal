#!/bin/bash
# Generacion automatica de certificados TLS Autofirmados (OpenSSL) para Cafe Boreal SRL

CERTS_DIR="$(dirname "$0")/certs"
mkdir -p "$CERTS_DIR"

echo "🔐 Generando CA Local y Certificado Servidor para localhost..."

# 1. Generar CA Key y Certificado
openssl genrsa -out "$CERTS_DIR/ca.key" 4096
openssl req -x509 -new -nodes -key "$CERTS_DIR/ca.key" -sha256 -days 3650 \
  -out "$CERTS_DIR/ca.crt" \
  -subj "/CN=CafeBoreal-Local-CA/O=UTN ITI-522/C=CR"

# 2. Generar Certificado Servidor
openssl genrsa -out "$CERTS_DIR/server.key" 2048
openssl req -new -key "$CERTS_DIR/server.key" \
  -out "$CERTS_DIR/server.csr" \
  -subj "/CN=localhost/O=Cafe Boreal SRL/C=CR"

# Config SAN (Subject Alternative Name)
cat <<EOF > "$CERTS_DIR/san.cnf"
[req]
default_bits = 2048
prompt = no
default_md = sha256
req_extensions = req_ext
distinguished_name = dn

[dn]
C = CR
O = Cafe Boreal SRL
CN = localhost

[req_ext]
subjectAltName = @alt_names

[alt_names]
DNS.1 = localhost
IP.1 = 127.0.0.1
EOF

openssl x509 -req -in "$CERTS_DIR/server.csr" \
  -CA "$CERTS_DIR/ca.crt" -CAkey "$CERTS_DIR/ca.key" -CAcreateserial \
  -out "$CERTS_DIR/server.crt" -days 825 -sha256 \
  -extfile "$CERTS_DIR/san.cnf" -extensions req_ext

chmod 600 "$CERTS_DIR/server.key"
chmod 644 "$CERTS_DIR/server.crt"

echo "✅ Certificados TLS autofirmados creados exitosamente en $CERTS_DIR:"
ls -l "$CERTS_DIR"
