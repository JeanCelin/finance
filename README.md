### Back-end

## Sistema de Login
# Rota ./api/auth:
 - register: rota de cadastro de usuários. 
  - Parametros: name, email, password.
  - Hash de senha com bcrypt.
 - login: rota de login do usuário
  - Parametros: email, senha.
  - Retorna se sucesso, usuário, mensagem, token JWT 
 - logout: Limpa token do usuário
 - change-password: Rota para alterar senha.
  - Parametros: email, newPassword. Recebe nova senha faz o hash e substituí no servidor se o usuário existir.

