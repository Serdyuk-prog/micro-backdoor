# micro-backdoor

Для запуска приложения:
``
    node index.js
``

## Описание API

### Получить страницу с содержимым директории  

**URL** : `/show/{path}`

**Method** : `GET`

#### Success Response: `страница с содержимым папки по адресу {path}`

---

### Скачать файл  

**URL** : `/download{path}`

**Method** : `GET`

#### Success Response: `файл по адресу {path}`

---

### Создать папку  

**URL** : `/new-folder`

**Method** : `POST`

**Data constraints**

```json
{
    "dir": "string"
}
```

#### Success Response: `Code: 200`

---

### Загрузить файл  

**URL** : `/new-file/{path}`

**Method** : `POST`

**Data constraints**

```json
}
    "file": "file"
}
```

#### Success Response: `Code: 200`

Создается файл по пути {path}

---

### Загрузить файл  

**URL** : `/delete`

**Method** : `POST`

**Data constraints**

```json
}
    "path": "string"
}
```

#### Success Response: `Code: 200`

Удаляется файл или папка по адресу в теле запроса
