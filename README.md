# UnoMasUnoAPI 
RESTful API para aplicación web para centro educativo Uno mas uno

## Endpoints

### Módulo autentificación

#### POST
- https://velazduran.com:3000/api/auth/signup Registrar usuario.

  Requiere administrador

```
{
  "username": string min(3) max(20) required,
  "password": string min(3) required,
  "name": string min(3) max(30) required,
  "patLastName": string min(3) max(30) required,
  "matLastName": string min(3) max(30),
  "phone": string min(3) max(15) required,
  "type": string valid('admin','general','independiente') required,
  "commision": number min(0) max(99.99) precision(2)
}
```

- https://velazduran.com:3000/api/auth/login Iniciar sesion

  Requiere no estar logueado
```
{
    "username": string min(3) max(20) required,
    "password": string min(3) required
}
```

#### PUT
- https://velazduran.com:3000/api/auth/changePassword/[id] Cambiar la contraseña del usuario indicado en el parámetro

  Requiere administrador
```
{
    "password":  string min(3) required,
    "newPassword":  string min(3) required
}
```

#### DELETE
- https://velazduran.com:3000/api/auth/logout Cerrar la sesión del usuario actual

  Requiere estar logueado

### Módulo usuarios

#### GET
- https://velazduran.com:3000/api/users/all Obtener los datos de todos los usuarios

  Requiere administrador


- https://velazduran.com:3000/api/users/current Obtener los datos del usuario actual

  Requiere estar logueado

- https://velazduran.com:3000/api/users/search/[id] Obtener los datos del usuario indicado

  Requiere administrador


#### PUT
- https://velazduran.com:3000/api/users/[id] Actualizar los datos del usuario indicado

  Requiere administrador
```
{
    "name": string min(3) max(30) required,
    "patLastName": string min(3) max(30) required,
    "matLastName": string min(3) max(30),
    "phone": string min(3) max(15) required,
    "commission": number min(0) max(99.99) precision(2)
}
```

#### DELETE
- https://velazduran.com:3000/api/users/[id] Elimina al usuario indicado
