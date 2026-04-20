import Swal from 'sweetalert2';

function getBaseConfig() {
  const isDarkMode = document.documentElement.getAttribute('data-theme') === 'dark';

  return {
    confirmButtonColor: isDarkMode ? '#3e5b83' : '#2d4159',
    background: isDarkMode ? '#172638' : '#f7f8fa',
    color: isDarkMode ? '#e5edf8' : '#25354a',
  };
}

function notifyError(message, title = 'Terjadi Kesalahan') {
  return Swal.fire({
    ...getBaseConfig(),
    icon: 'error',
    title,
    text: message,
  });
}

function notifyWarning(message, title = 'Perhatian') {
  return Swal.fire({
    ...getBaseConfig(),
    icon: 'warning',
    title,
    text: message,
  });
}

function notifySuccess(message, title = 'Berhasil') {
  return Swal.fire({
    ...getBaseConfig(),
    icon: 'success',
    title,
    text: message,
    timer: 1400,
    showConfirmButton: false,
  });
}

function notifyConfirm({
  title,
  message,
  confirmText,
  cancelText,
  icon = 'warning',
}) {
  return Swal.fire({
    ...getBaseConfig(),
    icon,
    title,
    text: message,
    showCancelButton: true,
    confirmButtonText: confirmText,
    cancelButtonText: cancelText,
    cancelButtonColor: '#8a98aa',
    reverseButtons: true,
  });
}

export { notifyConfirm, notifyError, notifySuccess, notifyWarning };
