import React from 'react'

export default function Home() {
  return (
    <>


      <div className="grid">
        <div className="card">
          <h2>Что делает проект</h2>
          <ul className="list">
            <li>Сервер ищет заголовки разделов из эталона.</li>
            <li>Возвращает <b>found</b> и <b>missing</b> (чего не хватает).</li>
            <li>Сохраняет результат в историю (после входа).</li>
          </ul>
        </div>
      </div>
    </>
  )
}
