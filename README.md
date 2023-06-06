# Что это такое?

Тестовый проект - сервис хранения сведений о занятиях.

# Подготовка к работе

1. В PostgreSQL создайте базу данных `testlessonsreport`
2. Импортируйте таблицы и демонстрационные данные (`\i ‘C:/path/test.sql’`)
3. Клонируйте репозиторий и установите зависимости
4. Запустите сервис - сервис будет доступен на http://localhost:3333

# Endpoints /api

## GET / - получить сведения о занятиях

Пример запроса:

```http
GET /api/ HTTP/1.1

{
    "page": 1,
    "lessonsPerPage": 1,
    "date": "2019-01-09,2019-10-09",
    "studentsCount": 2,
    "teacherIds": [1],
    "status": 0
}
```

Пример ответа в случае успеха:

```http
200 OK

{
    "ok": true,
    "result": [
        {
            "id": 2,
            "date": "2019-09-02",
            "title": "Red Color",
            "status": 0,
            "visitcount": 2,
            "students": [
                {
                    "id": 2,
                    "name": "Sergey",
                    "visit": true
                },
                {
                    "id": 3,
                    "name": "Maxim",
                    "visit": true
                }
            ],
            "teachers": [
                {
                    "id": 1,
                    "name": "Sveta"
                },
                {
                    "id": 4,
                    "name": "Masha"
                }
            ]
        }
    ]
}
```

Пример ответа при некорректном запросе:

```http
400 Bad Request

{
    "ok": false,
    "error": {
        "message": "date: incorrect date format"
    }
}
```

## POST /lessons - внести сведения о занятиях

Пример запроса:

```http
POST /api/lessons HTTP/1.1

{
    "title": "Blue ocean",
    "days": [2],
    "firstDate": "2023-01-01",
    "teacherIds": [1],
    "lessonsCount": 7
}
```

Пример ответа в случае успеха (результат - ID созданных строк в таблице lessons):

```http
200 OK

{
    "ok": true,
    "result": [
        46,
        47,
        48,
        49,
        50,
        51,
        52
    ]
}
```

Пример ответа в случае ошибки:

```http
400 Bad Request

{
    "ok": false,
    "error": {
        "message": "firstDate: incorrect date format"
    }
}
```
