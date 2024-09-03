# UnoMasUnoAPI 
RESTful API para aplicación web para centro educativo Uno mas uno

## Endpoints

### Módulo autentificación

#### GET
- https://velazduran.com:3000/api/auth/check Verificar sesion iniciara y obtener tipo de usuario

  Requiere estar logueado

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

  Requiere administrador

### Módulo sucursaes

#### GET
- https://velazduran.com:3000/api/branches/all Obtener los datos de todas las sucursales

  Requiere estar logueado

- https://velazduran.com:3000/api/branches/search/[id] Obtener los datos de la sucursal indicada

  Requiere estar logueado

#### POST
- https://velazduran.com:3000/api/branches Crear una sucursal

  Requiere administrador
```
{
    "name": string min(3) max(40) required,
    "country": string min(3) max(20) required,
    "state": string min(3) max(20) required,
    "city": string min(3) max(20) required,
    "postalCode": string min(3) max(10) required,
    "address": string min(3) max(80) required
}
```

#### PUT
- https://velazduran.com:3000/api/branches/[id] Actualizar los datos de la sucursal indicada

  Requiere administrador
```
{
    "name": string min(3) max(40) required,
    "country": string min(3) max(20) required,
    "state": string min(3) max(20) required,
    "city": string min(3) max(20) required,
    "postalCode": string min(3) max(10) required,
    "address": string min(3) max(80) required
}
```

#### DELETE
- https://velazduran.com:3000/api/branches/[id] Elimina la sucursal indicada

  Requiere administrador

### Módulo estudiantes

#### GET
- https://velazduran.com:3000/api/students/all Obtener los datos de todos los estudiantes

  Requiere estar logueado

- https://velazduran.com:3000/api/students/search/[id] Obtener los datos del estudiante indicado

  Requiere estar logueado

#### POST
- https://velazduran.com:3000/api/students Registrar un estudiante

  Requiere administrador o independiente
```
{
    "name": string min(3) max(30) required,
    "patLastName": string min(3) max(30) required,
    "matLastName": string min(3) max(30),
    "momFullName": string min(3) max(50),
    "dadFullName": string min(3) max(50),
    "country": string min(3) max(20) required,
    "state": string min(3) max(20) required,
    "city": string min(3) max(20) required,
    "postalCode": string min(3) max(10) required,
    "address": string min(3) max(80) required,
    "emergencyPhone": string min(3) max(15) required,
    "visitReason": string min(3) max(255),
    "prevDiag": string min(3) max(255),
    "alergies": string min(3) max(255),
    "comments": string min(3) max(255),
    "idBranch": number integer min(1) required
}
```

#### PUT
- https://velazduran.com:3000/api/students/[id] Actualizar los datos del estudiante indicado

  Requiere administrador o independiente
```
{
    "name": string min(3) max(30) required,
    "patLastName": string min(3) max(30) required,
    "matLastName": string min(3) max(30),
    "momFullName": string min(3) max(50),
    "dadFullName": string min(3) max(50),
    "country": string min(3) max(20) required,
    "state": string min(3) max(20) required,
    "city": string min(3) max(20) required,
    "postalCode": string min(3) max(10) required,
    "address": string min(3) max(80) required,
    "emergencyPhone": string min(3) max(15) required,
    "visitReason": string min(3) max(255),
    "prevDiag": string min(3) max(255),
    "alergies": string min(3) max(255),
    "comments": string min(3) max(255),
    "idBranch": number integer min(1) required
}
```

#### DELETE
- https://velazduran.com:3000/api/branches/[id] Elimina al estudiante indicado

  Requiere administrador o independiente

### Módulo pagos

#### GET
- https://velazduran.com:3000/api/payments/all Obtener los datos de todos los pagos

  Requiere estar logueado

- https://velazduran.com:3000/api/payments/search/[id] Obtener los datos del pago indicado

  Requiere estar logueado

#### POST
- https://velazduran.com:3000/api/payments Registrar un pago

  Requiere estar logueado
```
{
    "concept": string min(3) max(20) required,
    "amount": number min(0) max(99999999) precision(2) required,
    "method": string min(3) max(20) required,
    "idStudent": number integer min(1) required
}
```
