export default function numberFormat(value) {
  return new Intl.NumberFormat('ru-RU').format(value);
}
