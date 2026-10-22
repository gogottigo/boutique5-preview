import React, { useState } from 'react';

export default function ContactsPage({ navigate }) {
  const [formNotice, setFormNotice] = useState('');

  const submit = event => {
    event.preventDefault();
    // TODO: connect this form to the approved BOUTIQUE 5 contact API.
    // Do not send personal data until a first-party endpoint is available.
    setFormNotice('Форма пока не подключена к серверу. Отправка обращений временно недоступна.');
  };

  return <main className="section contacts-page">
    <nav className="breadcrumbs" aria-label="Хлебные крошки">
      <button type="button" onClick={() => navigate('/')}>Главная</button><span>/</span><span aria-current="page">Контакты</span>
    </nav>
    <header className="contacts-heading">
      <p className="eyebrow">БУТИК BOUTIQUE 5</p>
      <h1>Контакты</h1>
    </header>

    <div className="contacts-layout">
      <div className="contacts-information">
        <section className="contact-block">
          <h2>Адрес и телефон</h2>
          <address>Санкт-Петербург, Невский пр., д. 111/3</address>
          <div className="contact-phones">
            <a href="tel:+78127170044">+7 (812) 717 00 44</a>
            <a href="tel:+79991870044">+7 (999) 187 00 44</a>
          </div>
        </section>

        <section className="contact-block">
          <h2>Реквизиты</h2>
          <dl className="company-details">
            <div><dt>Организация</dt><dd>ООО «Арт Фейшн»</dd></div>
            <div><dt>ИНН</dt><dd>7842396250</dd></div>
            <div><dt>КПП</dt><dd>784201001</dd></div>
            <div><dt>ОГРН</dt><dd>1089847403920</dd></div>
            <div><dt>Юридический адрес</dt><dd>191036, Санкт-Петербург, Невский пр., д. 111/3</dd></div>
            <div><dt>Р/С</dt><dd>40702810333000004993</dd></div>
            <div><dt>Банк</dt><dd>ПАО «Банк Санкт-Петербург»</dd></div>
            <div><dt>БИК</dt><dd>044030790</dd></div>
            <div><dt>К/С</dt><dd>30101810900000000790</dd></div>
          </dl>
        </section>

        <section className="contact-block contact-return">
          <h2>Возврат и корреспонденция</h2>
          <p>191036, Санкт-Петербург, Невский пр., д. 111/3</p>
        </section>
      </div>

      <section className="contacts-form-section" aria-labelledby="contacts-form-title">
        <p className="eyebrow">МЫ НА СВЯЗИ</p>
        <h2 id="contacts-form-title">Напишите нам</h2>
        <p className="contacts-form-intro">Оставьте сообщение — поля формы проверяются в браузере.</p>
        <form className="contacts-form" onSubmit={submit}>
          <label>Имя<input name="name" type="text" autoComplete="name" minLength="2" required /></label>
          <label>Телефон<input name="phone" type="tel" autoComplete="tel" inputMode="tel" pattern="[0-9+() -]{10,}" title="Введите номер телефона" required /></label>
          <label>E-mail<input name="email" type="email" autoComplete="email" required /></label>
          <label>Текст сообщения<textarea name="message" rows="4" minLength="5" required /></label>
          <button className="button" type="submit">Отправить <span>↗</span></button>
          <p className="contacts-form-note">Форма пока не подключена к серверу. Введённые данные никуда не отправляются.</p>
          {formNotice&&<p className="contacts-form-status" role="status">{formNotice}</p>}
        </form>
      </section>
    </div>
  </main>;
}
