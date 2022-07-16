import '../styles/style.css'
import { renderCarCards, showLoader } from './carsSection'
import { getCars } from './carsService'
import { setupFilterBar } from './filterBar'

(async () => {
  setupFilterBar(async filter => {
    showLoader()
    const cars = await getCars(filter)
    renderCarCards(cars)
  })

  const cars = await getCars()
  renderCarCards(cars)

  const modalWrapper = document.getElementById('modal-wrapper')
  modalWrapper.addEventListener('click', e => {
    if (e.target.classList.contains('modal-close-btn')) closeModal()
  })
})()


function closeModal() {
  const modalWrapper = document.getElementById('modal-wrapper')
  modalWrapper.innerHTML = ''
  modalWrapper.classList.remove('open')
  document.body.style.overflow = 'auto'
}