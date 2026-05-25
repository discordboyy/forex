export function attachExpandEvents() {

  const items =
    document.querySelectorAll('.inbox-item');


  items.forEach(item => {

    item.addEventListener('click', () => {

      const alreadyOpen =
        item.classList.contains('expanded');


      // закрыть остальные

      document
        .querySelectorAll('.inbox-item.expanded')
        .forEach(open => {

          if (open !== item) {

            open.classList.remove(
              'expanded'
            );

          }

        });


      item.classList.toggle(
        'expanded'
      );


      // если открыли →
      // плавно поднять карточку вверх

      if (!alreadyOpen) {

        setTimeout(() => {

          item.scrollIntoView({

            behavior: 'smooth',

            block: 'start'

            // start = верх item
            // center = центр экрана

          });

        }, 150);

      }

    });

  });

}