const formatCurrencyID = (number: number) => {
  const formatter = new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });

  var currency = formatter.format(number);
  return currency;
};

export { formatCurrencyID };
