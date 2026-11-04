import { filterRows } from './filter-rows';

describe('filterRows', () => {
  const filas = [
    { nombre: 'Ana Pérez', documento: '1001' },
    { nombre: 'Luis Gómez', documento: '2002' },
  ];
  const pick = (f: { nombre: string; documento: string }) => [f.nombre, f.documento];

  it('should return a copy when the query is empty', () => {
    const resultado = filterRows(filas, '  ', pick);
    expect(resultado).toEqual(filas);
    expect(resultado).not.toBe(filas);
  });

  it('should match case-insensitively on any picked field', () => {
    expect(filterRows(filas, 'ANA', pick)).toEqual([filas[0]]);
    expect(filterRows(filas, '2002', pick)).toEqual([filas[1]]);
  });

  it('should return an empty array when nothing matches', () => {
    expect(filterRows(filas, 'zzz', pick)).toEqual([]);
  });
});
