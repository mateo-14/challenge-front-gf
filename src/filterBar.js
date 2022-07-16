import { getGroups } from './carsService'

const filterSelect = document.getElementById('filter-select')
const filterSelectBtn = document.getElementById('filter-select-btn')
const filterSelectList = document.getElementById('filter-select-list')
const filterCheckBoxes = document.getElementById('filter-checkboxes')
const checkBoxes = {}

document
  .querySelectorAll('input[type="checkbox"]')
  .forEach(checkbox => (checkBoxes[checkbox.value] = checkbox))

function getFilterFromCheckbox() {
  return {
    manualTransmission: checkBoxes['manual-transmission'].checked,
    automaticTransmission: checkBoxes['automatic-transmission'].checked,
    fiveSeats: checkBoxes['5-seats'].checked,
    sevenSeatsOrMore: checkBoxes['7-seats'].checked,
    convertibles: checkBoxes['convertibles'].checked
  }
}

function addGroupsToSelect(groups) {
  groups.forEach(group => {
    const li = document.createElement('li')
    const button = document.createElement('button')

    button.dataset.group = group
    button.textContent = `Group ${group}`
    button.ariaRoleDescription = 'option'

    li.appendChild(button)
    filterSelectList.appendChild(li)
  })
}

export async function setupFilterBar(onFilterChange) {
  const groups = await getGroups()
  addGroupsToSelect(groups)

  filterSelectBtn.addEventListener('click', () => {
    filterSelect.classList.toggle('open')
  })

  filterSelectList.addEventListener('click', async e => {
    if (e.target.tagName === 'BUTTON') {
      const svg = filterSelectBtn.children[0]
      filterSelectBtn.innerHTML = `${e.target.innerText}${svg.outerHTML}`
      filterSelectList.classList.toggle('open')

      const group = e.target.dataset.group
      filterSelectBtn.dataset.currGroup = group

      onFilterChange({ group, ...getFilterFromCheckbox() })
    }
  })

  filterCheckBoxes.addEventListener('change', async e => {
    if (e.target.tagName === 'INPUT' && e.target.type === 'checkbox') {
      const currGroup = filterSelectBtn.dataset.currGroup

      onFilterChange({ group: currGroup, ...getFilterFromCheckbox() })
    }
  })
}
