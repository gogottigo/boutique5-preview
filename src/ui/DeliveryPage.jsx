import React from 'react';

export default function DeliveryPage() {
  return <main className="section delivery-page">
    <header className="delivery-heading">
      <p className="eyebrow">BOUTIQUE N5 / ИНФОРМАЦИЯ</p>
      <h1>Доставка и оплата</h1>
    </header>

    <div className="delivery-content">
      <section className="delivery-section">
        <p className="eyebrow">01 / ДОСТАВКА</p>
        <div className="delivery-section-body">
          <h2>Доставка по России</h2>
          <p>Доставка возможна во все города России. <strong>Стоимость доставки 700 рублей по Москве и Санкт-Петербургу</strong>, в другие города стоимость зависит от региона.</p>
          <p className="delivery-pickup"><strong><em>В Санкт-Петербурге Вы можете забрать заказ самостоятельно, с примеркой, по адресу Невский проспект, д.111/3</em></strong></p>
          <p>Мы осуществляем курьерскую доставку компаниями ЭМСК и СДЭК:</p>
          <ul>
            <li>Москва в пределах МКАД</li>
            <li>Санкт-Петербург в пределах КАД</li>
            <li>и другие города России</li>
          </ul>
          <p>Доставка осуществляется курьером в рабочее время (10.00-18.00).</p>
          <p>Курьер позвонит по указанному Вами телефону и уточнит время и место доставки.</p>
          <p>Время ожидания курьера на примерку 15 минут.</p>
          <div className="delivery-terms">
            <p>Срок доставки по Москве 2-3 рабочих дня.</p>
            <p>Срок доставки по Санкт-Петербургу 1-2 рабочих дня.</p>
            <p>Срок доставки в остальные города – от 4 до 10 дней.</p>
          </div>
        </div>
      </section>

      <section className="delivery-section">
        <p className="eyebrow">02 / ОПЛАТА</p>
        <div className="delivery-section-body">
          <h2>Оплата товаров</h2>
          <p>Оплата производится наличным и безналичным расчётом курьеру при получении заказа.</p>
        </div>
      </section>

      <section className="delivery-section">
        <p className="eyebrow">03 / ПРИВИЛЕГИИ</p>
        <div className="delivery-section-body">
          <h2>Накопительная скидка</h2>
          <p>Делая покупки в нашем интернет-магазине, вы получаете скидку на следующие заказы!</p>
          <p>Скидка накопительная и зависит от общей суммы ваших покупок:</p>
          <div className="delivery-table-wrap">
            <table className="delivery-discount-table">
              <thead><tr><th scope="col">Сумма ваших покупок</th><th scope="col">Скидка</th></tr></thead>
              <tbody>
                <tr><td>Более 100 000 руб.</td><td>3%</td></tr>
                <tr><td>Более 200 000 руб.</td><td>5%</td></tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section className="delivery-section">
        <p className="eyebrow">04 / ОТГРУЗКА</p>
        <div className="delivery-section-body">
          <h2>Отгрузка заказа</h2>
          <p>После получения заказа, мы свяжемся с Вами по телефону, чтобы подтвердить указанные Вами данные и сообщить сроки отгрузки товара.</p>
          <p>После подтверждения Вашего заказа, отгрузка происходит в течение 1-2 рабочих дней.</p>
        </div>
      </section>
    </div>
  </main>;
}
