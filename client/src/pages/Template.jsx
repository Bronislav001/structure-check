import React from 'react'

const TEMPLATE = [
  'Введение',
  'Теоретическая часть',
  'Практическая часть',
  'Методология',
  'Результаты',
  'Выводы',
  'Список литературы',
  'Приложения'
]

export default function Template() {
  return (
    <div className="grid">
      <div className="card">
        <h2>Эталонный шаблон</h2>
        <ul className="list">
          {TEMPLATE.map(s => <li key={s}>{s}</li>)}
        </ul>
      </div>

      <div className="card">
        <h2>Как проходит проверка</h2>
        <ul className="list">
          <li>Ты вводишь текст отчёта.</li>
          <li>Сервер ищет заголовки разделов из эталона.</li>
          <li>Возвращает found и missing.</li>
          <li>Результат сохраняется в историю (после входа).</li>
        </ul>
      </div>
    </div>
  )
}
