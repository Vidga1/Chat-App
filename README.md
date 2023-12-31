# Реализация приложения "Чат"

## Основные функции
- **Разработка чат-приложения**: Приложение позволяет отправлять и отображать входящие сообщения из канала в Firebase. API и формат сообщений будут предоставлены.
- **Redux структура**: Создана структура Redux для управления состоянием приложения чат.
- **Разработка интерфейса пользователя**: Создан эффективный и привлекательный пользовательский интерфейс для чат-приложения, обеспечивающий легкость в использовании и хорошую навигацию.
## Дополнительные функции
- **Отображение входящих сообщений**: Добавлена функциональность для отображения входящих сообщений в чате.
- **Отправка сообщений**: Реализована возможность отправки сообщений пользователями.
- **Обработка смайликов**: Добавлена функциональность по обработке и отображению смайликов в виде картинок.

## Технические детали
- **Язык программирования**: Всё написано на TypeScript.
- **Инструменты и настройки**:
  - Настроены хуки Husky и линтеры для обеспечения качества кода.
  - Проведено тестирование Redux с использованием Jest.
  - Настроен Webpack для компиляции проекта в папку `dist`.
  - Настроены GitHub Actions для автоматической проверки тестов, линтинга, создания ссылок на CodeSandbox и автодеплоя.
