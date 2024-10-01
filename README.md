# UnoMasUnoAPI 
RESTful API para aplicación web para Centro educativo Uno+1

## Endpoints

### Módulo autentificación

#### GET
- **/api/auth/check** Verificar sesion iniciada y obtener tipo de usuario

  - Requiere estar logueado

#### POST
- **/api/auth/signup** Registrar usuario.

  - Requiere administrador

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

- **/api/auth/login** Iniciar sesion

  - Requiere no estar logueado
```
{
    "username": string min(3) max(20) required,
    "password": string min(3) required
}
```

#### PUT
- **/api/auth/changePassword/[id]** Cambiar la contraseña del usuario indicado en el parámetro

  - Requiere administrador
```
{
    "password":  string min(3) required,
    "newPassword":  string min(3) required
}
```

#### DELETE
- **/api/auth/logout** Cerrar la sesión del usuario actual

  - Requiere estar logueado

### Módulo usuarios

#### GET
- **/api/users/all/[page]** Obtener los datos de todos los usuarios. Página y cantidad de páginas. Cada página contiene 20 registros.

  - Requiere administrador


- **/api/users/current** Obtener los datos del usuario actual

  - Requiere estar logueado

- **/api/users/search/[id]** Obtener los datos del usuario indicado

  - Requiere administrador


#### PUT
- **/api/users/[id]** Actualizar los datos del usuario indicado

  - Requiere administrador
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
- **/api/users/[id]** Elimina al usuario indicado

  - Requiere administrador

### Módulo sucursaes

#### GET
- **/api/branches/all/[page]** Obtener los datos de todas las sucursales. Página y cantidad de páginas. Cada página contiene 20 registros.

  - Requiere estar logueado

- **/api/branches/search/[id]** Obtener los datos de la sucursal indicada

  - Requiere estar logueado

#### POST
- **/api/branches** Crear una sucursal

  - Requiere administrador
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
- **/api/branches/[id]** Actualizar los datos de la sucursal indicada

  - Requiere administrador
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
- **/api/branches/[id]** Elimina la sucursal indicada

  - Requiere administrador

### Módulo estudiantes

#### GET
- **/api/students/all/[page]** Obtener los datos de todos los estudiantes. Página y cantidad de páginas. Cada página contiene 20 registros.

  - Requiere estar logueado

- **/api/students/search/[id]** Obtener los datos del estudiante indicado

  - Requiere estar logueado

#### POST
- **/api/students** Registrar un estudiante

  - Requiere administrador o independiente
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
- **/api/students/[id]** Actualizar los datos del estudiante indicado

  - Requiere administrador o independiente
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
- **/api/branches/[id]** Elimina al estudiante indicado

  - Requiere administrador o independiente

### Módulo pagos

#### GET
- **/api/payments/all/[page]** Obtener los datos de todos los pagos. Página y cantidad de páginas. Cada página contiene 20 registros.

  - Requiere estar logueado

- **/api/payments/search/[id]** Obtener los datos del pago indicado

  - Requiere estar logueado

#### POST
- **/api/payments** Registrar un pago

  - Requiere estar logueado
```
{
    "concept": string min(3) max(20) required,
    "amount": number min(0) max(99999999) precision(2) required,
    "method": string min(3) max(20) required,
    "idStudent": number integer min(1) required
}
```
