import { getCarByGroupAndCompany } from './carsService'

const carsSection = document.getElementById('cars-section')
const modalWrapper = document.getElementById('modal-wrapper')

function convertFeatureText(key, value) {
  switch (key) {
    case 'doors':
      return `${value} doors`
    case 'seats':
      return `${value} seats`
    case 'air':
      return value
    case 'transmition':
      return `${value} transmission`
    case 'largeSuitcase':
      return `${value} large suitcase`
    case 'smallSuitcase':
      return `${value} small suitcase`
    default:
      return null
  }
}

function formatPrice(price) {
  return price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

carsSection.addEventListener('click', e => {
  if (e.target.tagName === 'BUTTON') {
    const { group, company, rate } = e.target.dataset
    if (group && company && rate) {
      const car = getCarByGroupAndCompany(group, company)
      const rateData = car.Rates[rate].RateData
      openInclusionsModal(`${rate} - ${rateData.name}`, rateData.inclusions)
    }
  }
})

export function renderCarCards(cars) {
  carsSection.innerHTML = ''

  cars.forEach(car => {
    const article = document.createElement('article')
    article.classList.add('car-card')

    let features = ''
    for (const feature in car.Features2) {
      const text = convertFeatureText(feature, car.Features2[feature])
      if (text) {
        features += `<li>
                      <img src="/assets/images/${feature}.svg" alt="${car.Features2[feature]} icon" />
                      ${text}
                    </li>`
      }
    }

    let rates = ''
    for (const rate in car.Rates) {
      const data = car.Rates[rate]
      rates += `<tr>    
                  <td>
                    <label class="car-card__rate-label">
                      <input type="radio" value="${rate}" name="${car.VehGroup + '-' + car.company}" ${!rates.length ? 'checked' : ''}/>
                      ${rate} - ${data.RateData.name}
                    </label>
                  </td>
                  <td>
                    <button role="button" class="car-card__rate-btn" data-company=${
                      car.company
                    } data-group=${car.VehGroup} data-rate=${rate}>
                      Rate Inclusions
                    </button>
                  </td>
                  <td class="car-card__rate-currency">
                    ${data.CurrencyCode}              
                  </td>
                  <td  class="car-card__rate-amount">
                    ${formatPrice(data.RateTotalAmount)}
                  </td>
                </tr>
      `
    }

    article.innerHTML += `
      <img
        src="${car.PictureURL}"
        alt="${car.Name} image"
        class="car-card__img"
      />
      <header class="car-card__header">
        <div>
          <h2 class="car-card__category">${car.Features2.category}</h2>
          <p class="car-card__group">GROUP ${car.VehGroup} (${car.Code})</p>
          <h1 class="car-card__name">${car.Name}</h1>
        </div>
        <button class="button car-card__btn" role="button">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            stroke-width="2"
          >
            <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" /></svg
          >Book now!
        </button>
      </header>
      <div>
        <h3 class="car-card__section-heading">CHARACTERISTICS</h3>
        <ul class="car-card__characteristics">
          ${features}
        </ul>
      </div>

      <div>
        <h3 class="car-card__section-heading">AVAILABLE RATES</h3>
        <table class="car-card__rates">
          <tbody>
            ${rates}
          </tbody>
        </table>
      </div>
    `
    carsSection.appendChild(article)

    // Timeout para animar
    setTimeout(() => {
      article.classList.add('animate')
    }, 0)
  })
}

function openInclusionsModal(name, inclusions) {
  const modal = document.createElement('div')
  modal.ariaRoleDescription = 'dialog'
  modal.classList.add('inclusions-modal')

  let inclusionsItems = ''
  inclusions?.forEach(inclusion => {
    inclusionsItems += `<li>
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                            <path
                              fill-rule="evenodd"
                              d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                              clip-rule="evenodd"
                            />
                          </svg>
                          ${inclusion}
                        </li>`
  })

  modal.innerHTML = `<div class="inclusions-modal__header">
                        <h2 class="inclusions-modal__heading">Rate Information</h2>
                        <button role="button" class="inclusions-modal__close-btn modal-close-btn">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                            class="modal-close-btn"
                          >
                            <path
                              fill-rule="evenodd"
                              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                              clip-rule="evenodd"
                              class="modal-close-btn"
                            />
                          </svg>
                        </button>
                      </div>
                      <div>
                        <h3 class="inclusions-modal__rate">${name}</h3>
                        <ul class="inclusions-modal__list">
                          ${inclusionsItems}
                        </ul>
                      </div>`

  modalWrapper.appendChild(modal)
  document.body.style.overflow = 'hidden'
  modalWrapper.classList.add('open')

  // Timeout para animar
  setTimeout(() => {
    modal.classList.add('animate')
  }, 0)
}

export function showLoader() {
  carsSection.innerHTML = ''
  const loader = document.createElement('div')
  loader.classList.add('loader', 'cars-loader')
  carsSection.appendChild(loader)
}
