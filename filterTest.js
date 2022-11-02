let array = [
  { name: 'ted' },
  { name: 'roy' },
  { name: 'kyle' },
  { name: 'moe' },
  { name: 'ray' },
];

array = array.filter((o) => o.name.includes('roy'));

console.log(array);
