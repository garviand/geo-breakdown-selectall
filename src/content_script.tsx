const selectAllPlayers = () => {
  const allScoreRows = document.querySelectorAll("[class^=results_row_]");
  allScoreRows.forEach((scoreRow) => {
    const className = scoreRow.className;
    if (!className.includes('results_headerRow') && !className.includes('results_selected')) {
      scoreRow.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    }
  })
}

const cellStyle = `display: flex; cursor: default; justify-content: center; align-items: center;`;
const buttonStyle = `align-items: center; color: #FFF; background: none; border: 0.0625rem solid var(--ds-color-white); border-radius: 0.25rem; cursor: pointer; display: flex; height: 2rem; justify-content: center; padding: 1rem; transition: transform .1s ease; z-index: 4000; position: relative; top: -12px;`

const getButton = () => {
  const button = document.createElement("button");
  button.appendChild(
    document.createTextNode('Select All')
  )
  button.setAttribute('style', buttonStyle);
  button.addEventListener('click', selectAllPlayers);
  return button;
}

const addButtonToFirstRow = (buttonCell: HTMLElement) => {
  if (buttonCell.className.includes('button_wrapper')) {
    return;
  }
  if (buttonCell) {
    buttonCell.setAttribute('style', cellStyle);
    const button = getButton();
    buttonCell.appendChild(button);
  }
}

const observer = new MutationObserver((mutations: Array<MutationRecord>) => {
  mutations.forEach((mutation) => {
    mutation.addedNodes.forEach((node) => {
      const buttonCell = node.firstChild?.firstChild as HTMLElement;
      addButtonToFirstRow(buttonCell);
    })
  })
});

chrome.runtime.onMessage.addListener(function (msg) {
  if (msg === 'on_results_page') {
    const breakdownTable = document.querySelectorAll("[class^=results_table__]")
    if (breakdownTable.length) {
      const buttonCell = breakdownTable[0].firstChild?.firstChild as HTMLElement;
      addButtonToFirstRow(buttonCell);
    }
    else {
      const breakdownTables = document.querySelectorAll("[class^=results_container]")
      if (breakdownTables?.length) {
        observer.observe(breakdownTables[0], { childList: true });
      }
    }
  }
});
