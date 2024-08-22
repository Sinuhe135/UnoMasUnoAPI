# UnoMasUnoAPI 
RESTful API para aplicación web para centro educativo Uno mas uno

## Endpoints

### POST
- https://velazduran.com:3000/api/auth/signup Registrar usuario.

```
{
  "username": string,
  "password": string,
  "name": string
}
```

- https://velazduran.com:3000/api/auth/login Iniciar sesion

```
{
  "username": string,
  "password": string
}
```

- https://velazduran.com:3000/api/auth/logout Cerrar sesion

### GET
- https://velazduran.com:3000/api/users/userInfo Obtiene id, nombre y estado del usuario
- https://velazduran.com:3000/api/users/allUsersInfo Obtiene informacion de todos los usuarios
