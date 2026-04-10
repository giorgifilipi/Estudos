# Criptografia — Guia do Projeto

Este documento descreve as tecnologias de criptografia utilizadas neste projeto de estudos.

---

## HMAC

### O que é
HMAC (Hash-based Message Authentication Code) é um mecanismo de autenticação de mensagens baseado em funções hash (como SHA256). Ele combina a mensagem com uma chave secreta para gerar um código único.

### Para que serve
Garante **integridade** e **autenticidade** de uma mensagem: prova que o conteúdo não foi alterado e que foi gerado por quem possui a chave secreta. Não criptografa o conteúdo — apenas autentica.

### Exemplos concretos
- **Webhooks do Stripe e GitHub**: ao enviar uma notificação, o serviço assina o payload com HMAC. O receptor recalcula o HMAC e compara para confirmar que veio do remetente legítimo.
- **Tokens JWT (HS256)**: o padrão JSON Web Token usa HMAC-SHA256 para assinar tokens de autenticação em APIs REST.
- **Validação de arquivos**: sistemas verificam o HMAC de arquivos baixados para garantir que não foram corrompidos ou adulterados.

---

## AES

### O que é
AES (Advanced Encryption Standard) é um algoritmo de criptografia **simétrica**, ou seja, usa a mesma chave para criptografar e descriptografar. Opera em blocos de 128 bits e suporta chaves de 128, 192 ou 256 bits.

### Para que serve
Protege a **confidencialidade** de dados: transforma o conteúdo em algo ilegível para quem não possui a chave secreta. É rápido e eficiente para grandes volumes de dados.

### Exemplos concretos
- **Criptografia de disco**: BitLocker (Windows) e FileVault (macOS) usam AES-256 para criptografar todo o conteúdo do HD.
- **WhatsApp**: usa AES para criptografar mensagens entre os dispositivos dos usuários.
- **Criptografia de bancos de dados**: senhas, dados pessoais e informações sensíveis são armazenados criptografados com AES.
- **Backup seguro**: ferramentas de backup criptografam arquivos com AES antes de enviá-los para a nuvem.

---

## RSA

### O que é
RSA é um algoritmo de criptografia **assimétrica**, cujo nome vem dos seus criadores: Rivest, Shamir e Adleman. Usa um par de chaves: uma **pública** (pode ser compartilhada) e uma **privada** (mantida em segredo). Sua segurança é baseada na dificuldade matemática de fatorar grandes números primos.

### Para que serve
Permite comunicação segura entre partes que nunca compartilharam um segredo antes. Usado tanto para **criptografia** quanto para **assinaturas digitais**.

### Exemplos concretos
- **Certificados HTTPS/TLS**: ao acessar um site com HTTPS, o servidor apresenta um certificado assinado com RSA para provar sua identidade.
- **Assinatura de software**: atualizações do Windows, drivers e aplicativos são assinados com RSA para garantir que vieram do fabricante legítimo.
- **SSH**: a autenticação por chave pública/privada em servidores Linux usa RSA (ou algoritmos similares).
- **Assinatura de documentos digitais**: contratos e documentos eletrônicos usam RSA para garantir autenticidade e não-repúdio.

---

## Criptografia Híbrida (AES + RSA)

### O que é
A criptografia híbrida combina criptografia simétrica (AES) e assimétrica (RSA) para aproveitar os pontos fortes de cada uma. O RSA resolve o problema de troca segura de chaves; o AES garante desempenho na criptografia dos dados.

### Para que serve
Permite comunicação segura e eficiente entre partes que **nunca compartilharam um segredo previamente**, sem sacrificar desempenho.

### Como funciona
1. O remetente gera uma chave AES aleatória.
2. Criptografa os dados com AES (rápido).
3. Criptografa a chave AES com a chave pública RSA do destinatário.
4. Envia ambos juntos.
5. O destinatário usa sua chave privada RSA para recuperar a chave AES e descriptografar os dados.

### Exemplos concretos
- **HTTPS/TLS**: o protocolo usado em todos os sites seguros. RSA troca a chave de sessão, AES criptografa o tráfego.
- **E-mail seguro (PGP/GPG)**: o corpo do e-mail é criptografado com AES; a chave AES é criptografada com a chave pública do destinatário via RSA.
- **Aplicativos de mensagens seguras (Signal, WhatsApp)**: usam variações de criptografia híbrida para garantir privacidade nas conversas.

---

## Comparativo

| Tecnologia | Tipo         | Confidencialidade | Autenticidade | Desempenho |
|------------|--------------|:-----------------:|:-------------:|:----------:|
| HMAC       | Hash + Chave |        ❌         |      ✅       |    ✅✅✅  |
| AES        | Simétrica    |        ✅         |      ❌       |    ✅✅✅  |
| RSA        | Assimétrica  |        ✅         |      ✅       |    ✅      |
| AES + RSA  | Híbrida      |        ✅         |      ✅       |    ✅✅    |