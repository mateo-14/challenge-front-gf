let cachedCars

export async function getGroups() {
  const res = await fetch('carsJSON.json')
  const { cars } = await res.json()
  return Object.keys(cars)
}

async function _getCars(
  filter = {
    group: 'all',
    manualTransmission: false,
    automaticTransmission: false,
    fiveSeats: false,
    sevenSeatsOrMore: false,
    convertibles: false
  }
) {
  const res = await fetch('carsJSON.json')
  const { cars } = await res.json()
  cachedCars = cars

  const filteredCars = []
  if (filter.group === 'all') {
    Object.values(cars).forEach(group => {
      for (const company in group) {
        filteredCars.push({ ...group[company], company: company })
      }
    })
  } else {
    for (const company in cars[filter.group]) {
      filteredCars.push({ ...cars[filter.group][company], company: company })
    }
  }

  return filteredCars.filter(car => {
    const seats = parseInt(car.Features2.seats)
    return (
      // Aplicar filtro transmisiones
      // Filtro transmisión seleccionado en manual y el auto tiene transmisión manual
      ((filter.manualTransmission && car.Features2.transmition === 'Manual') ||
        // Filtro transmisión seleccionado en automática y el auto tiene transmisión automática
        (filter.automaticTransmission && car.Features2.transmition === 'Automatic') ||
        // Ninguno de los dos filtros está seleccionado, pasan ambos
        (!filter.manualTransmission && !filter.automaticTransmission)) &&
      // Aplicar filtro asientos
      // Filtro de 5 asientos seleccionado y el auto tiene 5 asientos
      ((filter.fiveSeats && seats == 5) ||
        // Filtro más de 7 asientos y el auto tiene más de 7 asientos
        (filter.sevenSeatsOrMore && seats >= 7) ||
        // Ninguno de los dos filtros está seleccionado, pasan ambos
        (!filter.fiveSeats && !filter.sevenSeatsOrMore)) &&
      // Aplicar filtro convertibles
      // Filtro convertibles seleccionado y el auto es convertible. De lo contrario, mostrar ambos
      ((filter.convertibles && car.Features2.category === 'Convertible') || !filter.convertibles)
    )
  })
}

// Simular loading
export function getCars(filter) {
  return new Promise(async resolve => {
    const cars = await _getCars(filter)

    setTimeout(() => {
      resolve(cars)
    }, 300)
  })
}

export function getCarByGroupAndCompany(group, company) {
  return cachedCars[group][company]
}
