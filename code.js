const WEB_APP_URL =
  'https://script.google.com/macros/s/AKfycbyqCUuu9xkDfzmp3hO7Q-LZ1-kyftEM9qN2zIy3gA7ggewBSQIs3tvVV_Zh3qXS_6De0g/exec';


document.addEventListener('DOMContentLoaded', () => {

  const form = document.querySelector('#participation-form');

  if (!form) {
    console.error('No se encontró el formulario #participation-form');
    return;
  }


  const successMessage = document.querySelector('#success');

  let errorMessage = document.querySelector('#error');


  // Si el HTML no tiene un div de error, lo creamos automáticamente
  if (!errorMessage) {

    errorMessage = document.createElement('div');

    errorMessage.id = 'error';

    errorMessage.style.display = 'none';
    errorMessage.style.marginTop = '14px';
    errorMessage.style.padding = '12px 14px';
    errorMessage.style.borderRadius = '14px';
    errorMessage.style.background = '#ffe8e8';
    errorMessage.style.color = '#9b1c1c';
    errorMessage.style.fontSize = '.86rem';
    errorMessage.style.fontWeight = '800';
    errorMessage.style.textAlign = 'center';

    form.appendChild(errorMessage);
  }


  const submitButton = form.querySelector('button[type="submit"]');


  form.addEventListener('submit', async (event) => {

    event.preventDefault();


    // Validación normal del navegador
    if (!form.reportValidity()) {
      return;
    }


    if (!submitButton) {
      console.error('No se encontró el botón submit.');
      return;
    }


    // Ocultar mensajes anteriores
    if (successMessage) {
      successMessage.style.display = 'none';
    }

    errorMessage.style.display = 'none';


    // Bloquear botón mientras envía
    const originalButtonText = submitButton.textContent;

    submitButton.disabled = true;
    submitButton.textContent = 'Enviando...';


    try {

      const formData = new FormData(form);


      // Datos esperados:
      //
      // fullName
      // email
      // phone
      // follows


      const fullName = formData.get('fullName');
      const email = formData.get('email');
      const phone = formData.get('phone');
      const follows = formData.get('follows');


      // Validación adicional
      if (!fullName || !email || !phone || !follows) {

        throw new Error(
          'Por favor completa todos los campos antes de confirmar.'
        );
      }


      // Guardamos también desde qué página llegó el RSVP
      formData.append(
        'sourceUrl',
        window.location.href
      );


      // Convertir FormData a URL encoded
      const body = new URLSearchParams();

      for (const [key, value] of formData.entries()) {
        body.append(key, value);
      }


      // Enviar a Google Apps Script
      await fetch(WEB_APP_URL, {

        method: 'POST',

        mode: 'no-cors',

        body: body

      });


      // Mostrar confirmación
      if (successMessage) {

        successMessage.textContent =
          '¡Gracias! Tu participación ha sido confirmada. Revisa tu correo electrónico para más información.';

        successMessage.style.display = 'block';
      }


      // Limpiar formulario
      form.reset();


      // Ir a la sección de detalles
      const detailsSection =
        document.querySelector('#detalles');


      if (detailsSection) {

        setTimeout(() => {

          detailsSection.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });

        }, 500);

      }


    } catch (error) {

      console.error(
        'Error enviando RSVP:',
        error
      );


      errorMessage.textContent =
        error.message ||
        'No pudimos enviar tu confirmación. Por favor intenta nuevamente.';

      errorMessage.style.display =
        'block';

    } finally {

      submitButton.disabled = false;

      submitButton.textContent =
        originalButtonText;

    }

  });

});